package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tn.gov.ms.sidra.entity.Patient;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.PatientMapper;
import tn.gov.ms.sidra.repository.PatientRepository;
import tn.gov.ms.sidra.repository.StructureRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;
    private final StructureRepository structureRepository;
    private final PatientMapper patientMapper;

    /**
     * Récupère tous les patients selon le rôle de l'utilisateur
     */
    @Transactional(readOnly = true)
    public List<PatientListDto> getAllPatients(User currentUser) {
        log.info("Récupération des patients pour l'utilisateur: {}", currentUser.getEmail());

        List<Patient> patients;

        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            // SUPER_ADMIN voit tous les patients
            patients = patientRepository.findAll();
        } else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // ADMIN_STRUCTURE voit les patients de sa structure
            patients = patientRepository.findByStructureId(currentUser.getStructure().getId());
        } else if (currentUser.getRole() == UserRole.UTILISATEUR) {
            // UTILISATEUR voit les patients de sa structure
            patients = patientRepository.findByStructureId(currentUser.getStructure().getId());
        } else {
            throw new BusinessException("Vous n'avez pas les permissions pour consulter les patients");
        }

        return patients.stream()
                .map(patientMapper::toListDto)
                .collect(Collectors.toList());
    }

    /**
     * Recherche des patients dans d'autres structures (accès limité)
     */
    @Transactional(readOnly = true)
    public List<PatientDto> searchPatientsExternal(String codePatient, Long structureId, User currentUser) {
        log.info("Recherche externe de patients - utilisateur: {}, code: {}, structureId: {}", 
                currentUser.getEmail(), codePatient, structureId);

        List<Patient> patients = new ArrayList<>();

        // Recherche par code patient
        if (codePatient != null && !codePatient.trim().isEmpty()) {
            Optional<Patient> patientOpt = patientRepository.findByCodePatient(codePatient.trim());
            patientOpt.ifPresent(patients::add);
        }

        // Recherche par structure
        if (structureId != null) {
            List<Patient> structurePatients = patientRepository.findByStructureId(structureId);
            
            // Si on a déjà trouvé un patient par code, filtrer pour ne garder que celui-ci s'il est dans la structure
            if (!patients.isEmpty() && patients.get(0).getStructure().getId().equals(structureId)) {
                // On garde le patient déjà trouvé
            } else if (!patients.isEmpty()) {
                // Le patient trouvé par code n'est pas dans la structure demandée
                patients.clear();
            } else {
                // Ajouter tous les patients de la structure
                patients.addAll(structurePatients);
            }
        }

        // Filtrer pour exclure les patients de la structure de l'utilisateur
        patients = patients.stream()
                .filter(p -> !p.getStructure().getId().equals(currentUser.getStructure().getId()))
                .collect(Collectors.toList());

        // Convertir en DTO avec informations limitées
        return patients.stream()
                .map(this::mapToLimitedDto)
                .collect(Collectors.toList());
    }

    /**
     * Convertit un patient en DTO avec informations limitées
     */
    private PatientDto mapToLimitedDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setCodePatient(patient.getCodePatient());
        dto.setGenre(patient.getGenre());
        dto.setDateNaissance(patient.getDateNaissance());
        
        // Informations sur la structure
        PatientDto.StructureDto structureDto = new PatientDto.StructureDto();
        structureDto.setId(patient.getStructure().getId());
        structureDto.setNom(patient.getStructure().getNom());
        structureDto.setType(patient.getStructure().getType().getLabel());
        dto.setStructure(structureDto);
        
        return dto;
    }

    /**
     * Récupère un patient par son ID
     */
    @Transactional(readOnly = true)
    public PatientDto getPatientById(Long id, User currentUser) {
        log.info("Récupération du patient avec l'ID: {} par l'utilisateur: {}", id, currentUser.getEmail());

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID: " + id));

        // Vérifier les permissions
        validateReadPermissions(patient, currentUser);

        return patientMapper.toDto(patient);
    }

    /**
     * Recherche des patients par nom, prénom ou code
     */
    @Transactional(readOnly = true)
    public List<PatientListDto> searchPatients(String search, User currentUser) {
        log.info("Recherche de patients avec le terme: {} par l'utilisateur: {}", search, currentUser.getEmail());

        List<Patient> patients = patientRepository.searchPatients(search);

        // Filtrer selon les permissions
        if (currentUser.getRole() != UserRole.SUPER_ADMIN) {
            patients = patients.stream()
                    .filter(p -> p.getStructure().getId().equals(currentUser.getStructure().getId()))
                    .toList();
        }

        return patients.stream()
                .map(patientMapper::toListDto)
                .collect(Collectors.toList());
    }

    /**
     * Crée un nouveau patient dans la structure actuelle en référençant un patient d'une autre structure
     */
    @Transactional
    public PatientDto createPatientFromExternal(Long originalPatientId, User currentUser) {
        log.info("Création d'un patient depuis externe - utilisateur: {}, patient original: {}", 
                currentUser.getEmail(), originalPatientId);

        // Vérifier que l'utilisateur a accès au patient original
        Patient originalPatient = patientRepository.findById(originalPatientId)
                .orElseThrow(() -> new BusinessException("Patient original non trouvé"));

        // Vérifier l'accès
        boolean hasAccess = patientAccessRepository.hasAccess(originalPatient, currentUser);
        if (!hasAccess) {
            throw new BusinessException("Vous n'avez pas accès à ce patient");
        }

        // Créer le nouveau patient
        Patient newPatient = createOrGetPatient(
                originalPatient.getNom(),
                originalPatient.getPrenom(),
                originalPatient.getDateNaissance(),
                originalPatient.getGenre(),
                currentUser,
                originalPatientId
        );

        return patientMapper.toDto(newPatient);
    }

    /**
     * Crée ou récupère un patient existant
     */
    @Transactional
    public Patient createOrGetPatient(String nom, String prenom, LocalDate dateNaissance, String genre, User currentUser, Long patientOriginalId) {
        log.info("Création ou récupération d'un patient: {} {} (né le {}) par l'utilisateur: {}",
                prenom, nom, dateNaissance, currentUser.getEmail());

        // Vérifier si le patient existe déjà dans la structure actuelle
        List<Patient> existingPatients = patientRepository.findAll().stream()
                .filter(p -> p.getNom() != null && p.getNom().equals(nom) && 
                           p.getPrenom().equals(prenom) && 
                           p.getDateNaissance().equals(dateNaissance) &&
                           p.getStructure().getId().equals(currentUser.getStructure().getId()))
                .collect(Collectors.toList());

        if (!existingPatients.isEmpty()) {
            log.info("Patient existant trouvé dans la structure actuelle: {} {} (né le {})", prenom, nom, dateNaissance);
            return existingPatients.get(0);
        }

        // Créer un nouveau patient
        Patient patient = new Patient();
        patient.setNom(nom);
        patient.setPrenom(prenom);
        patient.setDateNaissance(dateNaissance);
        patient.setGenre(genre);

        // Générer le code patient
        String codePatient = generatePatientCode(dateNaissance);
        patient.setCodePatient(codePatient);

        // Affecter la structure
        Structure structure = currentUser.getStructure();
        if (structure == null) {
            throw new BusinessException("L'utilisateur n'est pas associé à une structure");
        }
        patient.setStructure(structure);

        // Si un patient original est fourni, définir la structure mère
        if (patientOriginalId != null) {
            Patient originalPatient = patientRepository.findById(patientOriginalId).orElse(null);
            if (originalPatient != null) {
                // La structure mère est soit la structure mère du patient original, soit sa structure actuelle
                patient.setStructureMere(originalPatient.getStructureMere() != null ? 
                    originalPatient.getStructureMere() : originalPatient.getStructure());
                log.info("Patient créé avec référence à la structure mère: {}", 
                    patient.getStructureMere().getNom());
            }
        }

        Patient savedPatient = patientRepository.save(patient);
        log.info("Nouveau patient créé avec l'ID: {} et le code: {}", savedPatient.getId(), savedPatient.getCodePatient());

        return savedPatient;
    }

    /**
     * Génère un code patient unique au format P-YYYY-XXXXX
     */
    private String generatePatientCode(LocalDate dateNaissance) {
        String anneeNaissance = String.valueOf(dateNaissance.getYear());

        // Trouver le dernier numéro de séquence pour cette année
        Integer lastSequence = patientRepository.findMaxSequenceNumberForYear(anneeNaissance).orElse(0);

        // Incrémenter et formater avec des zéros à gauche
        int newSequence = lastSequence + 1;
        String sequenceFormatted = String.format("%05d", newSequence);

        return "P-" + anneeNaissance + "-" + sequenceFormatted;
    }

    /**
     * Valide les permissions de lecture
     */
    private void validateReadPermissions(Patient patient, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return; // SUPER_ADMIN peut tout voir
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // Vérifier si l'admin appartient à la même structure que le patient
            if (patient.getStructure().getId().equals(currentUser.getStructure().getId())) {
                return;
            }
            
            // Vérifier si l'admin a une demande d'accès approuvée
            boolean hasAccess = patientAccessRepository.hasAccess(patient, currentUser);
            if (hasAccess) {
                return;
            }
            
            throw new BusinessException("Vous ne pouvez consulter que les patients de votre structure");
        }
        
        if (currentUser.getRole() == UserRole.UTILISATEUR) {
            // Vérifier si l'utilisateur appartient à la même structure que le patient
            if (patient.getStructure().getId().equals(currentUser.getStructure().getId())) {
                return;
            }
            
            // Vérifier si l'utilisateur a une demande d'accès approuvée
            boolean hasAccess = patientAccessRepository.hasAccess(patient, currentUser);
            if (hasAccess) {
                return;
            }
            
            throw new BusinessException("Vous ne pouvez consulter que les patients de votre structure");
        }

        throw new BusinessException("Vous n'avez pas les permissions pour consulter ce patient");
    }

    /**
     * Méthode publique pour trouver un patient par ID sans vérifier les permissions
     * Utilisée par d'autres services
     */
    @Transactional(readOnly = true)
    public Patient findPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID: " + id));
    }
}