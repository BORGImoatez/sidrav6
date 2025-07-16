package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.dto.offredrogues.CreateOffreDroguesRequest;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesDto;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesListDto;
import tn.gov.ms.sidra.dto.offredrogues.UpdateOffreDroguesRequest;
import tn.gov.ms.sidra.entity.OffreDrogues;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.OffreDroguesMapper;
import tn.gov.ms.sidra.repository.OffreDroguesRepository;
import tn.gov.ms.sidra.repository.StructureRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OffreDroguesService {

    private final OffreDroguesRepository offreDroguesRepository;
    private final StructureRepository structureRepository;
    private final OffreDroguesMapper offreDroguesMapper;

    /**
     * Récupère toutes les données d'offre de drogues selon le rôle de l'utilisateur
     */
    @Transactional(readOnly = true)
    public List<OffreDroguesListDto> getAllOffresDrogues(User currentUser) {
        log.info("Récupération des données d'offre de drogues pour l'utilisateur: {}", currentUser.getEmail());

        List<OffreDrogues> offresDrogues;

        if (currentUser.getRole() == UserRole.SUPER_ADMIN || currentUser.getRole() == UserRole.UTILISATEUR || currentUser.getRole() == UserRole.ADMIN_STRUCTURE ) {
            // SUPER_ADMIN voit toutes les données
            offresDrogues = offreDroguesRepository.findAllByOrderByDateSaisieDesc();
        }
//        else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
//            // ADMIN_STRUCTURE voit les données de sa structure
//            offresDrogues = offreDroguesRepository.findByStructureIdOrderByDateSaisieDesc(
//                    currentUser.getStructure().getId());
//        }
        else if (currentUser.getRole() == UserRole.EXTERNE) {
            // EXTERNE voit seulement ses propres données
            offresDrogues = offreDroguesRepository.findByUtilisateurOrderByDateSaisieDesc(currentUser);
        } else {
            throw new BusinessException("Vous n'avez pas les permissions pour consulter ces données");
        }

        return offresDrogues.stream()
                .map(offreDroguesMapper::toListDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère une donnée d'offre de drogues par son ID
     */
    @Transactional(readOnly = true)
    public OffreDroguesDto getOffreDroguesById(Long id, User currentUser) {
        log.info("Récupération de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        OffreDrogues offreDrogues = offreDroguesRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BusinessException("Données non trouvées avec l'ID: " + id));

        // Vérifier les permissions
        validateReadPermissions(offreDrogues, currentUser);

        return offreDroguesMapper.toDto(offreDrogues);
    }

    /**
     * Crée une nouvelle donnée d'offre de drogues
     */
    @Transactional
    public OffreDroguesDto createOffreDrogues(CreateOffreDroguesRequest request, User currentUser) {
        log.info("Création d'une nouvelle donnée d'offre de drogues pour la date: {} par l'utilisateur: {}",
                request.getDateSaisie(), currentUser.getEmail());

        // Seuls les utilisateurs EXTERNE peuvent créer des données
        if (currentUser.getRole() != UserRole.EXTERNE) {
            throw new BusinessException("Seuls les utilisateurs externes peuvent saisir des données d'offre de drogues");
        }

        // Vérifier qu'il n'existe pas déjà une saisie pour cette date par cet utilisateur
        if (offreDroguesRepository.existsByUtilisateurAndDateSaisie(currentUser, request.getDateSaisie())) {
            throw new BusinessException("Une saisie existe déjà pour cette date");
        }

        // Créer l'entité
        OffreDrogues offreDrogues = offreDroguesMapper.toEntity(request);
        offreDrogues.setUtilisateur(currentUser);

        // Charger explicitement la structure pour éviter LazyInitializationException
        if (currentUser.getStructure() != null) {
            offreDrogues.setStructure(structureRepository.findById(currentUser.getStructure().getId())
                    .orElse(null));
        }

        OffreDrogues savedOffreDrogues = offreDroguesRepository.save(offreDrogues);
        log.info("Données d'offre de drogues créées avec succès avec l'ID: {}", savedOffreDrogues.getId());

        // Recharger l'entité avec toutes les relations pour éviter LazyInitializationException
        return offreDroguesMapper.toDto(offreDroguesRepository.findByIdWithDetails(savedOffreDrogues.getId())
                .orElseThrow(() -> new BusinessException("Erreur lors de la récupération des données créées")));
    }

    /**
     * Met à jour une donnée d'offre de drogues existante
     */
    @Transactional
    public OffreDroguesDto updateOffreDrogues(Long id, UpdateOffreDroguesRequest request, User currentUser) {
        log.info("Mise à jour de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        OffreDrogues existingOffreDrogues = offreDroguesRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BusinessException("Données non trouvées avec l'ID: " + id));

        // Vérifier les permissions de modification
        validateUpdatePermissions(existingOffreDrogues, currentUser);

        // Vérifier qu'il n'existe pas déjà une saisie pour cette date par cet utilisateur (sauf cette saisie)
        if (offreDroguesRepository.existsByUtilisateurAndDateSaisieAndIdNot(
                currentUser, request.getDateSaisie(), id)) {
            throw new BusinessException("Une autre saisie existe déjà pour cette date");
        }

        // Mettre à jour l'entité
        offreDroguesMapper.updateEntity(request, existingOffreDrogues);

        OffreDrogues updatedOffreDrogues = offreDroguesRepository.save(existingOffreDrogues);
        log.info("Données d'offre de drogues mises à jour avec succès: {}", updatedOffreDrogues.getId());

        // Recharger l'entité avec toutes les relations pour éviter LazyInitializationException
        return offreDroguesMapper.toDto(offreDroguesRepository.findByIdWithDetails(updatedOffreDrogues.getId())
                .orElseThrow(() -> new BusinessException("Erreur lors de la récupération des données mises à jour")));
    }

    /**
     * Supprime une donnée d'offre de drogues
     */
    @Transactional
    public void deleteOffreDrogues(Long id, User currentUser) {
        log.info("Suppression de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        OffreDrogues offreDrogues = offreDroguesRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new BusinessException("Données non trouvées avec l'ID: " + id));

        // Vérifier les permissions de suppression
        validateDeletePermissions(offreDrogues, currentUser);

        offreDroguesRepository.delete(offreDrogues);
        log.info("Données d'offre de drogues supprimées avec succès: {}", id);
    }

    /**
     * Récupère les données d'offre de drogues par période
     */
    @Transactional(readOnly = true)
    public List<OffreDroguesListDto> getOffresDroguesByPeriod(LocalDate startDate, LocalDate endDate, User currentUser) {
        log.info("Récupération des données d'offre de drogues pour la période {} - {} par l'utilisateur: {}",
                startDate, endDate, currentUser.getEmail());

        List<OffreDrogues> offresDrogues;

        if (currentUser.getRole() == UserRole.EXTERNE) {
            offresDrogues = offreDroguesRepository.findByUtilisateurAndDateSaisieBetween(
                    currentUser, startDate, endDate);
        } else if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // Filtrer par structure pour les admin structure
            offresDrogues = offreDroguesRepository.findByDateSaisieBetween(startDate, endDate)
                    .stream()
                    .filter(o -> o.getStructure() != null &&
                            o.getStructure().getId().equals(currentUser.getStructure().getId()))
                    .collect(Collectors.toList());
        } else {
            offresDrogues = offreDroguesRepository.findByDateSaisieBetween(startDate, endDate);
        }

        return offresDrogues.stream()
                .map(offreDroguesMapper::toListDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère la dernière donnée d'offre de drogues avant une date spécifique
     */
    @Transactional(readOnly = true)
    public OffreDroguesDto getLastEntryBefore(LocalDate date, Long currentId, User currentUser) {
        log.info("Récupération de la dernière donnée d'offre de drogues avant la date: {} (excluant ID: {})",
                date, currentId);

        List<OffreDrogues> entries = offreDroguesRepository.findLastEntryBefore(date, currentId);

        if (entries.isEmpty()) {
            return null;
        }

        OffreDrogues lastEntry = entries.get(0);

        // Vérifier les permissions
        try {
            validateReadPermissions(lastEntry, currentUser);
        } catch (BusinessException e) {
            log.warn("L'utilisateur n'a pas les permissions pour voir la dernière entrée: {}", e.getMessage());
            return null;
        }

        return offreDroguesMapper.toDto(lastEntry);
    }

    /**
     * Récupère les statistiques pour un utilisateur
     */
    public long getCountByUser(User user) {
        return offreDroguesRepository.countByUtilisateur(user);
    }

    /**
     * Récupère les statistiques pour une structure
     */
    public long getCountByStructure(Long structureId) {
        return offreDroguesRepository.countByStructureId(structureId);
    }

    /**
     * Valide les permissions de lecture
     */
    private void validateReadPermissions(OffreDrogues offreDrogues, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN || currentUser.getRole() == UserRole.UTILISATEUR || currentUser.getRole() == UserRole.ADMIN_STRUCTURE ) {
            return; // SUPER_ADMIN peut tout voir
        }

//        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
//            if (!offreDrogues.getStructure().getId().equals(currentUser.getStructure().getId())) {
//                throw new BusinessException("Vous ne pouvez consulter que les données de votre structure");
//            }
//            return;
//        }

        if (currentUser.getRole() == UserRole.EXTERNE) {
            if (!offreDrogues.getUtilisateur().getId().equals(currentUser.getId())) {
                throw new BusinessException("Vous ne pouvez consulter que vos propres données");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour consulter ces données");
    }

    /**
     * Valide les permissions de modification
     */
    private void validateUpdatePermissions(OffreDrogues offreDrogues, User currentUser) {
        if (currentUser.getRole() != UserRole.EXTERNE) {
            throw new BusinessException("Seuls les utilisateurs externes peuvent modifier des données d'offre de drogues");
        }

        if (!offreDrogues.getUtilisateur().getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous ne pouvez modifier que vos propres données");
        }
    }

    /**
     * Valide les permissions de suppression
     */
    private void validateDeletePermissions(OffreDrogues offreDrogues, User currentUser) {
        if (currentUser.getRole() != UserRole.EXTERNE) {
            throw new BusinessException("Seuls les utilisateurs externes peuvent supprimer des données d'offre de drogues");
        }

        if (!offreDrogues.getUtilisateur().getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous ne pouvez supprimer que vos propres données");
        }
    }
}