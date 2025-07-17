package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.dto.patientaccess.AccessRequestDto;
import tn.gov.ms.sidra.entity.Patient;
import tn.gov.ms.sidra.entity.PatientAccess;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.repository.PatientAccessRepository;
import tn.gov.ms.sidra.repository.PatientRepository;
import tn.gov.ms.sidra.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientAccessService {

    private final PatientAccessRepository patientAccessRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    /**
     * Demande l'accès à un patient
     */
    @Transactional
    public AccessRequestDto requestAccess(Long patientId, User requestor) {
        log.info("Demande d'accès au patient ID: {} par l'utilisateur: {}", patientId, requestor.getEmail());

        // Vérifier si le patient existe
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID: " + patientId));

        // Vérifier si l'utilisateur a déjà accès à ce patient
        if (patient.getStructure().getId().equals(requestor.getStructure().getId())) {
            throw new BusinessException("Vous avez déjà accès à ce patient car il appartient à votre structure");
        }

        // Vérifier si une demande est déjà en cours
        patientAccessRepository.findByPatientAndRequestor(patientId, requestor.getId())
                .ifPresent(existingRequest -> {
                    if (existingRequest.getStatus() == PatientAccess.PatientAccessStatus.PENDING) {
                        throw new BusinessException("Une demande d'accès est déjà en cours pour ce patient");
                    }
                    if (existingRequest.getStatus() == PatientAccess.PatientAccessStatus.APPROVED) {
                        throw new BusinessException("Vous avez déjà accès à ce patient");
                    }
                });

        // Trouver le propriétaire du patient (créateur du patient)
        User owner = userRepository.findById(patient.getStructure().getUtilisateurs().get(0).getId())
                .orElseThrow(() -> new BusinessException("Propriétaire du patient non trouvé"));

        // Créer la demande d'accès
        PatientAccess accessRequest = new PatientAccess();
        accessRequest.setPatient(patient);
        accessRequest.setRequestor(requestor);
        accessRequest.setOwner(owner);
        accessRequest.setStatus(PatientAccess.PatientAccessStatus.PENDING);
        accessRequest.setDateCreation(LocalDateTime.now());

        PatientAccess savedRequest = patientAccessRepository.save(accessRequest);
        log.info("Demande d'accès créée avec l'ID: {}", savedRequest.getId());

        // Notifier le propriétaire du patient
        webSocketService.notifyUser(owner.getId(), "NEW_ACCESS_REQUEST", Map.of(
                "requestId", savedRequest.getId(),
                "patientId", patient.getId(),
                "patientCode", patient.getCodePatient(),
                "requestorName", requestor.getPrenom() + " " + requestor.getNom(),
                "requestorStructure", requestor.getStructure().getNom()
        ));

        return mapToDto(savedRequest);
    }

    /**
     * Récupère les demandes d'accès envoyées par un utilisateur
     */
    @Transactional(readOnly = true)
    public List<AccessRequestDto> getRequestsByUser(User user) {
        log.info("Récupération des demandes d'accès envoyées par l'utilisateur: {}", user.getEmail());

        List<PatientAccess> requests = patientAccessRepository.findByRequestorOrderByDateCreationDesc(user);
        return requests.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les demandes d'accès reçues par un utilisateur
     */
    @Transactional(readOnly = true)
    public List<AccessRequestDto> getReceivedRequests(User user) {
        log.info("Récupération des demandes d'accès reçues par l'utilisateur: {}", user.getEmail());

        List<PatientAccess> requests = patientAccessRepository.findByOwnerOrderByDateCreationDesc(user);
        return requests.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Approuve une demande d'accès
     */
    @Transactional
    public AccessRequestDto approveRequest(Long requestId, User currentUser) {
        log.info("Approbation de la demande d'accès ID: {} par l'utilisateur: {}", requestId, currentUser.getEmail());

        PatientAccess request = patientAccessRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Demande d'accès non trouvée avec l'ID: " + requestId));

        // Vérifier que l'utilisateur est bien le propriétaire
        if (!request.getOwner().getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à approuver cette demande");
        }

        // Vérifier que la demande est en attente
        if (request.getStatus() != PatientAccess.PatientAccessStatus.PENDING) {
            throw new BusinessException("Cette demande n'est pas en attente d'approbation");
        }

        // Approuver la demande
        request.setStatus(PatientAccess.PatientAccessStatus.APPROVED);
        request.setDateModification(LocalDateTime.now());
        // Définir une date d'expiration (par exemple, 30 jours)
        request.setDateExpiration(LocalDateTime.now().plusDays(30));

        PatientAccess updatedRequest = patientAccessRepository.save(request);
        log.info("Demande d'accès approuvée: {}", updatedRequest.getId());

        // Notifier le demandeur
        webSocketService.notifyUser(request.getRequestor().getId(), "ACCESS_REQUEST_APPROVED", Map.of(
                "requestId", updatedRequest.getId(),
                "patientId", request.getPatient().getId(),
                "patientCode", request.getPatient().getCodePatient()
        ));

        return mapToDto(updatedRequest);
    }

    /**
     * Rejette une demande d'accès
     */
    @Transactional
    public AccessRequestDto rejectRequest(Long requestId, User currentUser) {
        log.info("Rejet de la demande d'accès ID: {} par l'utilisateur: {}", requestId, currentUser.getEmail());

        PatientAccess request = patientAccessRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Demande d'accès non trouvée avec l'ID: " + requestId));

        // Vérifier que l'utilisateur est bien le propriétaire
        if (!request.getOwner().getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à rejeter cette demande");
        }

        // Vérifier que la demande est en attente
        if (request.getStatus() != PatientAccess.PatientAccessStatus.PENDING) {
            throw new BusinessException("Cette demande n'est pas en attente d'approbation");
        }

        // Rejeter la demande
        request.setStatus(PatientAccess.PatientAccessStatus.REJECTED);
        request.setDateModification(LocalDateTime.now());

        PatientAccess updatedRequest = patientAccessRepository.save(request);
        log.info("Demande d'accès rejetée: {}", updatedRequest.getId());

        // Notifier le demandeur
        webSocketService.notifyUser(request.getRequestor().getId(), "ACCESS_REQUEST_REJECTED", Map.of(
                "requestId", updatedRequest.getId(),
                "patientId", request.getPatient().getId(),
                "patientCode", request.getPatient().getCodePatient()
        ));

        return mapToDto(updatedRequest);
    }

    /**
     * Annule une demande d'accès
     */
    @Transactional
    public AccessRequestDto cancelRequest(Long requestId, User currentUser) {
        log.info("Annulation de la demande d'accès ID: {} par l'utilisateur: {}", requestId, currentUser.getEmail());

        PatientAccess request = patientAccessRepository.findById(requestId)
                .orElseThrow(() -> new BusinessException("Demande d'accès non trouvée avec l'ID: " + requestId));

        // Vérifier que l'utilisateur est bien le demandeur
        if (!request.getRequestor().getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à annuler cette demande");
        }

        // Vérifier que la demande est en attente
        if (request.getStatus() != PatientAccess.PatientAccessStatus.PENDING) {
            throw new BusinessException("Cette demande ne peut plus être annulée");
        }

        // Annuler la demande
        request.setStatus(PatientAccess.PatientAccessStatus.CANCELLED);
        request.setDateModification(LocalDateTime.now());

        PatientAccess updatedRequest = patientAccessRepository.save(request);
        log.info("Demande d'accès annulée: {}", updatedRequest.getId());

        // Notifier le propriétaire
        webSocketService.notifyUser(request.getOwner().getId(), "ACCESS_REQUEST_CANCELLED", Map.of(
                "requestId", updatedRequest.getId(),
                "patientId", request.getPatient().getId(),
                "patientCode", request.getPatient().getCodePatient(),
                "requestorName", request.getRequestor().getPrenom() + " " + request.getRequestor().getNom()
        ));

        return mapToDto(updatedRequest);
    }

    /**
     * Vérifie si l'utilisateur a accès à un patient
     */
    @Transactional(readOnly = true)
    public Map<String, Object> checkAccess(Long patientId, User currentUser) {
        log.info("Vérification d'accès au patient ID: {} par l'utilisateur: {}", patientId, currentUser.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("patientId", patientId);
        result.put("userId", currentUser.getId());

        // Vérifier si le patient existe
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID: " + patientId));

        // Vérifier si l'utilisateur appartient à la même structure que le patient
        if (patient.getStructure().getId().equals(currentUser.getStructure().getId())) {
            result.put("hasAccess", true);
            result.put("accessType", "STRUCTURE");
            return result;
        }

        // Vérifier si l'utilisateur a une demande d'accès approuvée
        boolean hasAccess = patientAccessRepository.hasAccess(patient, currentUser);
        result.put("hasAccess", hasAccess);
        
        if (hasAccess) {
            result.put("accessType", "GRANTED");
        } else {
            result.put("accessType", "NONE");
            
            // Vérifier s'il y a une demande en attente
            patientAccessRepository.findPendingAccess(patientId, currentUser.getId())
                    .ifPresent(request -> {
                        result.put("accessType", "PENDING");
                        result.put("requestId", request.getId());
                    });
        }

        return result;
    }

    /**
     * Convertit une entité PatientAccess en DTO
     */
    private AccessRequestDto mapToDto(PatientAccess access) {
        AccessRequestDto dto = new AccessRequestDto();
        dto.setId(access.getId());
        dto.setStatus(access.getStatus().name());
        dto.setDateCreation(access.getDateCreation());
        dto.setDateModification(access.getDateModification());
        dto.setDateExpiration(access.getDateExpiration());

        // Mapper le patient
        AccessRequestDto.PatientDto patientDto = new AccessRequestDto.PatientDto();
        patientDto.setId(access.getPatient().getId());
        patientDto.setCodePatient(access.getPatient().getCodePatient());
        patientDto.setGenre(access.getPatient().getGenre());
        patientDto.setDateNaissance(access.getPatient().getDateNaissance().toString());

        // Mapper la structure du patient
        AccessRequestDto.StructureDto patientStructureDto = new AccessRequestDto.StructureDto();
        patientStructureDto.setId(access.getPatient().getStructure().getId());
        patientStructureDto.setNom(access.getPatient().getStructure().getNom());
        patientStructureDto.setType(access.getPatient().getStructure().getType().getLabel());
        patientDto.setStructure(patientStructureDto);

        dto.setPatient(patientDto);

        // Mapper le demandeur
        AccessRequestDto.UserDto requestorDto = new AccessRequestDto.UserDto();
        requestorDto.setId(access.getRequestor().getId());
        requestorDto.setNom(access.getRequestor().getNom());
        requestorDto.setPrenom(access.getRequestor().getPrenom());
        requestorDto.setEmail(access.getRequestor().getEmail());

        // Mapper la structure du demandeur
        AccessRequestDto.StructureDto requestorStructureDto = new AccessRequestDto.StructureDto();
        requestorStructureDto.setId(access.getRequestor().getStructure().getId());
        requestorStructureDto.setNom(access.getRequestor().getStructure().getNom());
        requestorStructureDto.setType(access.getRequestor().getStructure().getType().getLabel());
        requestorDto.setStructure(requestorStructureDto);

        dto.setRequestor(requestorDto);

        // Mapper le propriétaire
        AccessRequestDto.UserDto ownerDto = new AccessRequestDto.UserDto();
        ownerDto.setId(access.getOwner().getId());
        ownerDto.setNom(access.getOwner().getNom());
        ownerDto.setPrenom(access.getOwner().getPrenom());
        ownerDto.setEmail(access.getOwner().getEmail());

        // Mapper la structure du propriétaire
        AccessRequestDto.StructureDto ownerStructureDto = new AccessRequestDto.StructureDto();
        ownerStructureDto.setId(access.getOwner().getStructure().getId());
        ownerStructureDto.setNom(access.getOwner().getStructure().getNom());
        ownerStructureDto.setType(access.getOwner().getStructure().getType().getLabel());
        ownerDto.setStructure(ownerStructureDto);

        dto.setOwner(ownerDto);

        return dto;
    }
}