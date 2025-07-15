package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.dto.structure.CreateStructureRequest;
import tn.gov.ms.sidra.dto.structure.StructureDto;
import tn.gov.ms.sidra.dto.structure.UpdateStructureRequest;
import tn.gov.ms.sidra.entity.Gouvernorat;
import tn.gov.ms.sidra.entity.Ministere;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.TypeStructure;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.StructureMapper;
import tn.gov.ms.sidra.repository.GouvernoratRepository;
import tn.gov.ms.sidra.repository.MinistereRepository;
import tn.gov.ms.sidra.repository.StructureRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StructureService {

    private final StructureRepository structureRepository;
    private final GouvernoratRepository gouvernoratRepository;
    private final MinistereRepository ministereRepository;
    private final StructureMapper structureMapper;

    /**
     * Récupère toutes les structures actives
     */
    @Transactional(readOnly = true)
    public List<StructureDto> getAllStructures() {
        log.info("Récupération de toutes les structures actives");

        List<Structure> structures = structureRepository.findByActifTrueOrderByNomAsc();
        return structures.stream()
                .map(structureMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les structures avec pagination
     */
    public Page<StructureDto> getStructuresWithPagination(Pageable pageable) {
        log.info("Récupération des structures avec pagination: {}", pageable);

        Page<Structure> structures = structureRepository.findByActifTrueOrderByNomAsc(pageable);
        return structures.map(structureMapper::toDto);
    }

    /**
     * Récupère une structure par son ID
     */
    @Transactional(readOnly = true)
    public StructureDto getStructureById(Long id) {
        log.info("Récupération de la structure avec l'ID: {}", id);

        Structure structure = structureRepository.findByIdWithGouvernorat(id)
                .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + id));

        return structureMapper.toDto(structure);
    }

    /**
     * Crée une nouvelle structure
     */
    @Transactional
    public StructureDto createStructure(CreateStructureRequest request) {
        log.info("Création d'une nouvelle structure: {}", request.getNom());

        // Vérifier si le nom existe déjà
        if (structureRepository.existsByNomAndActifTrue(request.getNom())) {
            throw new BusinessException("Une structure avec ce nom existe déjà");
        }

        // Vérifier que le gouvernorat existe
        Gouvernorat gouvernorat = gouvernoratRepository.findById(request.getGouvernoratId())
                .orElseThrow(() -> new BusinessException("Gouvernorat non trouvé avec l'ID: " + request.getGouvernoratId()));

        // Vérifier si un ministère est requis (pour les structures publiques)
        if (request.getType() == TypeStructure.PUBLIQUE && request.getMinistereId() == null) {
            throw new BusinessException("Un ministère est obligatoire pour les structures publiques");
        }

        // Créer la structure
        Structure structure = structureMapper.toEntity(request);
        structure.setGouvernorat(gouvernorat);

        // Affecter le ministère si nécessaire
        if (request.getMinistereId() != null) {
            Ministere ministere = ministereRepository.findById(request.getMinistereId())
                    .orElseThrow(() -> new BusinessException("Ministère non trouvé avec l'ID: " + request.getMinistereId()));
            structure.setMinistere(ministere);
        }

        Structure savedStructure = structureRepository.save(structure);
        log.info("Structure créée avec succès avec l'ID: {}", savedStructure.getId());

        return structureMapper.toDto(savedStructure);
    }

    /**
     * Met à jour une structure existante
     */
    @Transactional
    public StructureDto updateStructure(Long id, UpdateStructureRequest request) {
        log.info("Mise à jour de la structure avec l'ID: {}", id);

        Structure existingStructure = structureRepository.findByIdAndActifTrue(id)
                .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + id));

        // Vérifier si le nom existe déjà (sauf pour cette structure)
        if (structureRepository.existsByNomAndActifTrueAndIdNot(request.getNom(), id)) {
            throw new BusinessException("Une autre structure avec ce nom existe déjà");
        }

        // Vérifier que le gouvernorat existe
        Gouvernorat gouvernorat = gouvernoratRepository.findById(request.getGouvernoratId())
                .orElseThrow(() -> new BusinessException("Gouvernorat non trouvé avec l'ID: " + request.getGouvernoratId()));

        // Vérifier si un ministère est requis (pour les structures publiques)
        if (request.getType() == TypeStructure.PUBLIQUE && request.getMinistereId() == null) {
            throw new BusinessException("Un ministère est obligatoire pour les structures publiques");
        }

        // Mettre à jour la structure
        structureMapper.updateEntity(request, existingStructure);
        existingStructure.setGouvernorat(gouvernorat);

        // Mettre à jour le ministère
        if (request.getMinistereId() != null) {
            Ministere ministere = ministereRepository.findById(request.getMinistereId())
                    .orElseThrow(() -> new BusinessException("Ministère non trouvé avec l'ID: " + request.getMinistereId()));
            existingStructure.setMinistere(ministere);
        } else {
            existingStructure.setMinistere(null);
        }

        Structure updatedStructure = structureRepository.save(existingStructure);
        log.info("Structure mise à jour avec succès: {}", updatedStructure.getId());

        return structureMapper.toDto(updatedStructure);
    }

    /**
     * Suppression logique d'une structure
     */
    @Transactional
    public void deleteStructure(Long id) {
        log.info("Suppression logique de la structure avec l'ID: {}", id);

        Structure structure = structureRepository.findByIdAndActifTrue(id)
                .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + id));

        // Vérifier s'il y a des utilisateurs actifs liés à cette structure
        long activeUsersCount = structure.getUtilisateurs().stream()
                .filter(user -> user.getActif())
                .count();

        if (activeUsersCount > 0) {
            throw new BusinessException("Impossible de supprimer la structure car elle contient " +
                    activeUsersCount + " utilisateur(s) actif(s)");
        }

        // Suppression logique
        structure.setActif(false);
        structureRepository.save(structure);

        log.info("Structure supprimée logiquement avec succès: {}", id);
    }

    /**
     * Active/désactive une structure
     */
    @Transactional
    public StructureDto toggleStructureStatus(Long id) {
        log.info("Changement de statut de la structure avec l'ID: {}", id);

        Structure structure = structureRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + id));

        structure.setActif(!structure.getActif());
        Structure updatedStructure = structureRepository.save(structure);

        log.info("Statut de la structure changé: {} -> {}", id, updatedStructure.getActif());
        return structureMapper.toDto(updatedStructure);
    }

    /**
     * Recherche des structures par nom
     */
    public List<StructureDto> searchStructuresByName(String name) {
        log.info("Recherche de structures par nom: {}", name);

        List<Structure> structures = structureRepository.findByNomContainingIgnoreCaseAndActifTrueOrderByNomAsc(name);
        return structures.stream()
                .map(structureMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère les structures par type
     */
    public List<StructureDto> getStructuresByType(String type) {
        log.info("Récupération des structures par type: {}", type);

        try {
            tn.gov.ms.sidra.entity.TypeStructure typeStructure =
                    tn.gov.ms.sidra.entity.TypeStructure.valueOf(type.toUpperCase());

            List<Structure> structures = structureRepository.findByTypeAndActifTrueOrderByNomAsc(typeStructure);
            return structures.stream()
                    .map(structureMapper::toDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Type de structure invalide: " + type);
        }
    }

    /**
     * Récupère les structures par gouvernorat
     */
    public List<StructureDto> getStructuresByGouvernorat(Long gouvernoratId) {
        log.info("Récupération des structures par gouvernorat: {}", gouvernoratId);

        List<Structure> structures = structureRepository.findByGouvernoratIdAndActifTrueOrderByNomAsc(gouvernoratId);
        return structures.stream()
                .map(structureMapper::toDto)
                .collect(Collectors.toList());
    }
}