package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tn.gov.ms.sidra.entity.*;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.FormulaireMapper;
import tn.gov.ms.sidra.repository.FormulaireRepository;
import tn.gov.ms.sidra.repository.PatientRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FormulaireService {

    private final FormulaireRepository formulaireRepository;
    private final PatientService patientService;
    private final FormulaireMapper formulaireMapper;
    private final PatientRepository patientRepository;

    /**
     * Récupère tous les formulaires selon le rôle de l'utilisateur
     */
    @Transactional(readOnly = true)
    public List<FormulaireDto> getAllFormulaires(User currentUser) {
        log.info("Récupération des formulaires pour l'utilisateur: {}", currentUser.getEmail());

        List<Formulaire> formulaires;

        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            // SUPER_ADMIN voit tous les formulaires
            formulaires = formulaireRepository.findAll();
        } else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // ADMIN_STRUCTURE voit les formulaires de sa structure
            formulaires = formulaireRepository.findByStructureId(currentUser.getStructure().getId());
        } else if (currentUser.getRole() == UserRole.UTILISATEUR) {
            // UTILISATEUR voit ses propres formulaires
            formulaires = formulaireRepository.findByUtilisateur(currentUser);
        } else {
            throw new BusinessException("Vous n'avez pas les permissions pour consulter les formulaires");
        }

        return formulaires.stream()
                .map(formulaireMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un formulaire par son ID
     */
    @Transactional(readOnly = true)
    public FormulaireDto getFormulaireById(Long id, User currentUser) {
        log.info("Récupération du formulaire avec l'ID: {} par l'utilisateur: {}", id, currentUser.getEmail());

        Formulaire formulaire = formulaireRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Formulaire non trouvé avec l'ID: " + id));

        // Vérifier les permissions
        validateReadPermissions(formulaire, currentUser);

        return formulaireMapper.toDto(formulaire);
    }

    /**
     * Récupère les formulaires d'un patient
     */
    @Transactional(readOnly = true)
    public List<FormulaireDto> getFormulairesByPatientId(Long patientId, User currentUser) {
        log.info("Récupération des formulaires pour le patient ID: {} par l'utilisateur: {}",
                patientId, currentUser.getEmail());

        // Vérifier si le patient existe et si l'utilisateur a les permissions
        patientService.getPatientById(patientId, currentUser); // Vérifie juste les permissions

        Patient patient = patientService.findPatientById(patientId);

        List<Formulaire> formulaires = formulaireRepository.findByPatientId(patientId);

        // Filtrer selon les permissions
        if (currentUser.getRole() == UserRole.UTILISATEUR) {
            formulaires = formulaires.stream()
                    .filter(f -> f.getUtilisateur().getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        } else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            formulaires = formulaires.stream()
                    .filter(f -> f.getStructure().getId().equals(currentUser.getStructure().getId()))
                    .collect(Collectors.toList());
        }

        return formulaires.stream()
                .map(formulaireMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les formulaires par période
     */
    @Transactional(readOnly = true)
    public List<FormulaireDto> getFormulairesByPeriod(LocalDate debut, LocalDate fin, User currentUser) {
        log.info("Récupération des formulaires pour la période {} - {} par l'utilisateur: {}",
                debut, fin, currentUser.getEmail());

        List<Formulaire> formulaires;

        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            formulaires = formulaireRepository.findByDateConsultationBetween(debut, fin);
        } else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            formulaires = formulaireRepository.findByStructureIdAndDateConsultationBetween(
                    currentUser.getStructure().getId(), debut, fin);
        } else if (currentUser.getRole() == UserRole.UTILISATEUR) {
            formulaires = formulaireRepository.findByUtilisateurAndDateConsultationBetween(
                    currentUser, debut, fin);
        } else {
            throw new BusinessException("Vous n'avez pas les permissions pour consulter les formulaires");
        }

        return formulaires.stream()
                .map(formulaireMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Crée un nouveau formulaire
     */
    @Transactional
    public FormulaireDto createFormulaire(CreateFormulaireRequest request, User currentUser) {
        log.info("Création d'un nouveau formulaire pour la date: {} par l'utilisateur: {}",
                request.getDateConsultation(), currentUser.getEmail());

        // Log de la requête pour le débogage
        log.debug("Requête de création de formulaire: {}", request);

        // Vérifier les permissions
        if (currentUser.getRole() != UserRole.UTILISATEUR) {
            throw new BusinessException("Seuls les utilisateurs peuvent créer des formulaires");
        }

        // Récupérer le patient existant ou en créer un nouveau si nécessaire
        Patient patient;
        if (request.getPatientId() != null) {
            // Utiliser un patient existant
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID: " + request.getPatientId()));

            // Vérifier que l'utilisateur a accès à ce patient
            if (currentUser.getRole() != UserRole.SUPER_ADMIN &&
                    !patient.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous n'avez pas accès à ce patient");
            }
        } else {
            // Créer un nouveau patient
            patient = patientService.createOrGetPatient(
                    request.getNom(),
                    request.getPrenom(),
                    request.getDateNaissance(),
                    request.getGenre(),
                    currentUser
            );
        }

        // Créer le formulaire
        Formulaire formulaire = formulaireMapper.toEntity(request);

        // Créer et associer les entités liées
        createAndAssociateRelatedEntities(formulaire, request);

        // Générer l'identifiant unique
        String identifiantUnique = generateFormulaireId();
        formulaire.setIdentifiantUnique(identifiantUnique);

        // Affecter le patient, l'utilisateur et la structure
        formulaire.setPatient(patient);
        formulaire.setUtilisateur(currentUser);
        formulaire.setStructure(currentUser.getStructure());

        Formulaire savedFormulaire = formulaireRepository.save(formulaire);
        log.info("Formulaire créé avec succès avec l'ID: {} et l'identifiant unique: {}",
                savedFormulaire.getId(), savedFormulaire.getIdentifiantUnique());

        return formulaireMapper.toDto(savedFormulaire);
    }

    /**
     * Met à jour un formulaire existant
     */
    @Transactional
    public FormulaireDto updateFormulaire(Long id, CreateFormulaireRequest request, User currentUser) {
        log.info("Mise à jour du formulaire avec l'ID: {} par l'utilisateur: {}", id, currentUser.getEmail());

        // Log de la requête pour le débogage
        log.debug("Requête de mise à jour de formulaire: {}", request);

        // Récupérer le formulaire existant
        Formulaire existingFormulaire = formulaireRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Formulaire non trouvé avec l'ID: " + id));

        // Vérifier les permissions de modification
        validateUpdatePermissions(existingFormulaire, currentUser);

        // Conserver le patient existant
        Patient patient = existingFormulaire.getPatient();

        // Créer un nouveau formulaire à partir de la requête
        Formulaire updatedFormulaire = formulaireMapper.toEntity(request);

        // Créer et associer les entités liées
        createAndAssociateRelatedEntities(updatedFormulaire, request);

        // Conserver l'identifiant unique et les métadonnées
        updatedFormulaire.setId(existingFormulaire.getId());
        updatedFormulaire.setIdentifiantUnique(existingFormulaire.getIdentifiantUnique());
        updatedFormulaire.setDateCreation(existingFormulaire.getDateCreation());

        // Affecter le patient, l'utilisateur et la structure
        updatedFormulaire.setPatient(patient);
        updatedFormulaire.setUtilisateur(currentUser);
        updatedFormulaire.setStructure(currentUser.getStructure());

        Formulaire savedFormulaire = formulaireRepository.save(updatedFormulaire);
        log.info("Formulaire mis à jour avec succès: {}", savedFormulaire.getId());

        return formulaireMapper.toDto(savedFormulaire);
    }

    /**
     * Supprime un formulaire
     */
    @Transactional
    public void deleteFormulaire(Long id, User currentUser) {
        log.info("Suppression du formulaire avec l'ID: {} par l'utilisateur: {}", id, currentUser.getEmail());

        Formulaire formulaire = formulaireRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Formulaire non trouvé avec l'ID: " + id));

        // Vérifier les permissions de suppression
        validateDeletePermissions(formulaire, currentUser);

        formulaireRepository.delete(formulaire);
        log.info("Formulaire supprimé avec succès: {}", id);
    }

    /**
     * Génère un identifiant unique pour le formulaire au format F-YYYY-XXXXX
     */
    private String generateFormulaireId() {
        String annee = String.valueOf(LocalDate.now().getYear());

        // Trouver le dernier numéro de séquence pour cette année
        Integer lastSequence = formulaireRepository.findMaxSequenceNumberForYear(annee).orElse(0);

        // Incrémenter et formater avec des zéros à gauche
        int newSequence = lastSequence + 1;
        String sequenceFormatted = String.format("%05d", newSequence);

        return "F-" + annee + "-" + sequenceFormatted;
    }

    /**
     * Valide les permissions de lecture
     */
    private void validateReadPermissions(Formulaire formulaire, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return; // SUPER_ADMIN peut tout voir
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            if (!formulaire.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez consulter que les formulaires de votre structure");
            }
            return;
        }

        if (currentUser.getRole() == UserRole.UTILISATEUR) {
            if (!formulaire.getUtilisateur().getId().equals(currentUser.getId())) {
                throw new BusinessException("Vous ne pouvez consulter que vos propres formulaires");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour consulter ce formulaire");
    }

    /**
     * Valide les permissions de modification
     */
    private void validateUpdatePermissions(Formulaire formulaire, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return; // SUPER_ADMIN peut tout modifier
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            if (!formulaire.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez modifier que les formulaires de votre structure");
            }
            return;
        }

        if (currentUser.getRole() == UserRole.UTILISATEUR) {
            if (!formulaire.getUtilisateur().getId().equals(currentUser.getId())) {
                throw new BusinessException("Vous ne pouvez modifier que vos propres formulaires");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour modifier ce formulaire");
    }

    /**
     * Valide les permissions de suppression
     */
    private void validateDeletePermissions(Formulaire formulaire, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return; // SUPER_ADMIN peut tout supprimer
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            if (!formulaire.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez supprimer que les formulaires de votre structure");
            }
            return;
        }

        if (currentUser.getRole() == UserRole.UTILISATEUR) {
            if (!formulaire.getUtilisateur().getId().equals(currentUser.getId())) {
                throw new BusinessException("Vous ne pouvez supprimer que vos propres formulaires");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour supprimer ce formulaire");
    }

    /**
     * Crée et associe les entités liées au formulaire
     */
    private void createAndAssociateRelatedEntities(Formulaire formulaire, CreateFormulaireRequest request) {
        try {
            // Créer et associer le cadre de consultation
            if (request.getCadreConsultation() != null) {
                CadreConsultation cadreConsultation = new CadreConsultation();
                cadreConsultation.setFormulaire(formulaire);
                cadreConsultation.setAddictologie(request.getCadreConsultation().getAddictologie());
                cadreConsultation.setAddictologieType(request.getCadreConsultation().getAddictologieType());
                cadreConsultation.setPsychiatrie(request.getCadreConsultation().getPsychiatrie());
                cadreConsultation.setPsychologique(request.getCadreConsultation().getPsychologique());
                cadreConsultation.setMedecineGenerale(request.getCadreConsultation().getMedecineGenerale());
                cadreConsultation.setNeurologique(request.getCadreConsultation().getNeurologique());
                cadreConsultation.setInfectieux(request.getCadreConsultation().getInfectieux());
                cadreConsultation.setEspaceAmisJeunes(request.getCadreConsultation().getEspaceAmisJeunes());
                cadreConsultation.setEchangeMateriel(request.getCadreConsultation().getEchangeMateriel());
                cadreConsultation.setRehabilitation(request.getCadreConsultation().getRehabilitation());
                cadreConsultation.setUrgenceMedicale(request.getCadreConsultation().getUrgenceMedicale());
                cadreConsultation.setUrgenceChirurgicale(request.getCadreConsultation().getUrgenceChirurgicale());
                cadreConsultation.setDepistage(request.getCadreConsultation().getDepistage());
                cadreConsultation.setAutre(request.getCadreConsultation().getAutre());
                cadreConsultation.setAutrePrecision(request.getCadreConsultation().getAutrePrecision());
                formulaire.setCadreConsultation(cadreConsultation);
            }

            // Créer et associer l'origine de la demande
            if (request.getOrigineDemande() != null) {
                OrigineDemande origineDemande = new OrigineDemande();
                origineDemande.setFormulaire(formulaire);
                origineDemande.setLuiMeme(request.getOrigineDemande().getLuiMeme());
                origineDemande.setFamille(request.getOrigineDemande().getFamille());
                origineDemande.setAmis(request.getOrigineDemande().getAmis());
                origineDemande.setCelluleEcoute(request.getOrigineDemande().getCelluleEcoute());
                origineDemande.setAutreCentre(request.getOrigineDemande().getAutreCentre());
                origineDemande.setStructureSociale(request.getOrigineDemande().getStructureSociale());
                origineDemande.setStructureJudiciaire(request.getOrigineDemande().getStructureJudiciaire());
                origineDemande.setJugeEnfance(request.getOrigineDemande().getJugeEnfance());
                origineDemande.setAutre(request.getOrigineDemande().getAutre());
                origineDemande.setAutrePrecision(request.getOrigineDemande().getAutrePrecision());
                formulaire.setOrigineDemande(origineDemande);
            }

            // Créer et associer le type d'alcool
            if (request.getTypeAlcoolDto() != null) {
                TypeAlcool typeAlcool = new TypeAlcool();
                typeAlcool.setFormulaire(formulaire);
                typeAlcool.setBiere(request.getTypeAlcoolDto().getBiere());
                typeAlcool.setLiqueurs(request.getTypeAlcoolDto().getLiqueurs());
                typeAlcool.setAlcoolBruler(request.getTypeAlcoolDto().getAlcoolBruler());
                typeAlcool.setLegmi(request.getTypeAlcoolDto().getLegmi());
                typeAlcool.setBoukha(request.getTypeAlcoolDto().getBoukha());
                formulaire.setTypeAlcool(typeAlcool);
            }

            // Créer et associer l'entourage SPA
            if (request.getEntourageSpaDtO() != null) {
                EntourageSpa entourageSpa = new EntourageSpa();
                entourageSpa.setFormulaire(formulaire);
                entourageSpa.setMembresFamille(request.getEntourageSpaDtO().getMembresFamille());
                entourageSpa.setAmis(request.getEntourageSpaDtO().getAmis());
                entourageSpa.setMilieuProfessionnel(request.getEntourageSpaDtO().getMilieuProfessionnel());
                entourageSpa.setMilieuSportif(request.getEntourageSpaDtO().getMilieuSportif());
                entourageSpa.setMilieuScolaire(request.getEntourageSpaDtO().getMilieuScolaire());
                entourageSpa.setAutre(request.getEntourageSpaDtO().getAutre());
                entourageSpa.setAutrePrecision(request.getEntourageSpaDtO().getAutrePrecision());
                formulaire.setEntourageSpa(entourageSpa);
            }

            // Créer et associer les substances psychoactives
            if (request.getTypeSpaEntourageDto() != null) {
                SubstancePsychoactive typeSpaEntourage = new SubstancePsychoactive();
                typeSpaEntourage.setFormulaire(formulaire);
                typeSpaEntourage.setType(SubstancePsychoactive.TypeSubstance.ENTOURAGE);
                // Mapper les propriétés depuis le DTO
                mapSubstanceProperties(typeSpaEntourage, request.getTypeSpaEntourageDto());
                formulaire.addSubstancePsychoactive(typeSpaEntourage);
            }

            if (request.getDroguesActuellesDto() != null) {
                SubstancePsychoactive droguesActuelles = new SubstancePsychoactive();
                droguesActuelles.setFormulaire(formulaire);
                droguesActuelles.setType(SubstancePsychoactive.TypeSubstance.ACTUELLE);
                // Mapper les propriétés depuis le DTO
                mapSubstanceProperties(droguesActuelles, request.getDroguesActuellesDto());
                formulaire.addSubstancePsychoactive(droguesActuelles);
            }

            if (request.getSubstanceInitiationDto() != null) {
                SubstancePsychoactive substanceInitiation = new SubstancePsychoactive();
                substanceInitiation.setFormulaire(formulaire);
                substanceInitiation.setType(SubstancePsychoactive.TypeSubstance.INITIATION);
                substanceInitiation.setAgeInitiation(request.getAgeInitiationPremiere());
                // Mapper les propriétés depuis le DTO
                mapSubstanceProperties(substanceInitiation, request.getSubstanceInitiationDto());
                formulaire.addSubstancePsychoactive(substanceInitiation);
            }

            if (request.getSubstancePrincipaleDto() != null) {
                SubstancePsychoactive substancePrincipale = new SubstancePsychoactive();
                substancePrincipale.setFormulaire(formulaire);
                substancePrincipale.setType(SubstancePsychoactive.TypeSubstance.PRINCIPALE);
                substancePrincipale.setAgeInitiation(request.getAgeInitiationPrincipale());
                // Mapper les propriétés depuis le DTO
                mapSubstanceProperties(substancePrincipale, request.getSubstancePrincipaleDto());
                formulaire.addSubstancePsychoactive(substancePrincipale);
            }

            // Créer et associer la voie d'administration
            if (request.getVoieAdministrationDto() != null) {
                VoieAdministration voieAdministration = new VoieAdministration();
                voieAdministration.setFormulaire(formulaire);
                voieAdministration.setInjectee(request.getVoieAdministrationDto().getInjectee());
                voieAdministration.setFumee(request.getVoieAdministrationDto().getFumee());
                voieAdministration.setIngeree(request.getVoieAdministrationDto().getIngeree());
                voieAdministration.setSniffee(request.getVoieAdministrationDto().getSniffee());
                voieAdministration.setInhalee(request.getVoieAdministrationDto().getInhalee());
                voieAdministration.setAutre(request.getVoieAdministrationDto().getAutre());
                voieAdministration.setAutrePrecision(request.getVoieAdministrationDto().getAutrePrecision());
                formulaire.setVoieAdministration(voieAdministration);
            }

            // Créer et associer les tests de dépistage
            if (request.getTestVihDto() != null) {
                TestDepistage testVih = new TestDepistage();
                testVih.setFormulaire(formulaire);
                testVih.setTypeTest(TestDepistage.TypeTest.VIH);
                testVih.setRealise(request.getTestVihDto().getRealise());
                testVih.setPeriode(request.getTestVihDto().getPeriode());
                formulaire.addTestDepistage(testVih);
            }

            if (request.getTestVhcDto() != null) {
                TestDepistage testVhc = new TestDepistage();
                testVhc.setFormulaire(formulaire);
                testVhc.setTypeTest(TestDepistage.TypeTest.VHC);
                testVhc.setRealise(request.getTestVhcDto().getRealise());
                testVhc.setPeriode(request.getTestVhcDto().getPeriode());
                formulaire.addTestDepistage(testVhc);
            }

            if (request.getTestVhbDto() != null) {
                TestDepistage testVhb = new TestDepistage();
                testVhb.setFormulaire(formulaire);
                testVhb.setTypeTest(TestDepistage.TypeTest.VHB);
                testVhb.setRealise(request.getTestVhbDto().getRealise());
                testVhb.setPeriode(request.getTestVhbDto().getPeriode());
                formulaire.addTestDepistage(testVhb);
            }

            if (request.getTestSyphilisDto() != null) {
                TestDepistage testSyphilis = new TestDepistage();
                testSyphilis.setFormulaire(formulaire);
                testSyphilis.setTypeTest(TestDepistage.TypeTest.SYPHILIS);
                testSyphilis.setRealise(request.getTestSyphilisDto().getRealise());
                testSyphilis.setPeriode(request.getTestSyphilisDto().getPeriode());
                formulaire.addTestDepistage(testSyphilis);
            }

            // Créer et associer les détails de tentative de sevrage
            if (request.getTentativeSevrageDetailsDto() != null) {
                TentativeSevrage tentativeSevrage = new TentativeSevrage();
                tentativeSevrage.setFormulaire(formulaire);
                tentativeSevrage.setToutSeul(request.getTentativeSevrageDetailsDto().getToutSeul());
                tentativeSevrage.setSoutienFamille(request.getTentativeSevrageDetailsDto().getSoutienFamille());
                tentativeSevrage.setSoutienAmi(request.getTentativeSevrageDetailsDto().getSoutienAmi());
                tentativeSevrage.setSoutienScolaire(request.getTentativeSevrageDetailsDto().getSoutienScolaire());
                tentativeSevrage.setStructureSante(request.getTentativeSevrageDetailsDto().getStructureSante());
                tentativeSevrage.setStructureSantePrecision(request.getTentativeSevrageDetailsDto().getStructureSantePrecision());
                formulaire.setTentativeSevrageDetails(tentativeSevrage);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la création des entités liées", e);
            log.error("Détails de la requête: {}", request);
            throw new BusinessException("Erreur lors de la création des entités liées: " + e.getMessage());
        }
    }

    /**
     * Mappe les propriétés d'une substance psychoactive depuis un DTO
     */
    private void mapSubstanceProperties(SubstancePsychoactive substance, SubstancePsychoactiveDto dto) {
        substance.setTabac(dto.getTabac());
        substance.setAlcool(dto.getAlcool());
        substance.setCannabis(dto.getCannabis());
        substance.setOpium(dto.getOpium());
        substance.setMorphiniques(dto.getMorphiniques());
        substance.setMorphiniquesPrecision(dto.getMorphiniquesPrecision());
        substance.setHeroine(dto.getHeroine());
        substance.setCocaine(dto.getCocaine());
        substance.setHypnotiques(dto.getHypnotiques());
        substance.setHypnotiquesPrecision(dto.getHypnotiquesPrecision());
        substance.setHypnotiquesAutrePrecision(dto.getHypnotiquesAutrePrecision());
        substance.setAmphetamines(dto.getAmphetamines());
        substance.setEcstasy(dto.getEcstasy());
        substance.setProduitsInhaler(dto.getProduitsInhaler());
        substance.setPregabaline(dto.getPregabaline());
        substance.setKetamines(dto.getKetamines());
        substance.setLsd(dto.getLsd());
        substance.setAutre(dto.getAutre());
        substance.setAutrePrecision(dto.getAutrePrecision());
    }
}