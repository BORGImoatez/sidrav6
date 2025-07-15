package tn.gov.ms.sidra.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.dto.structure.CreateStructureRequest;
import tn.gov.ms.sidra.dto.structure.StructureDto;
import tn.gov.ms.sidra.dto.structure.UpdateStructureRequest;
import tn.gov.ms.sidra.service.StructureService;

import java.util.List;

@RestController
@RequestMapping("/structures")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class StructureController {

    private final StructureService structureService;

    /**
     * Récupère toutes les structures
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<StructureDto>> getAllStructures(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long gouvernoratId) {
        
        log.info("Récupération des structures - search: {}, type: {}, gouvernoratId: {}", 
                search, type, gouvernoratId);

        List<StructureDto> structures;

        if (search != null && !search.trim().isEmpty()) {
            structures = structureService.searchStructuresByName(search.trim());
        } else if (type != null && !type.trim().isEmpty()) {
            structures = structureService.getStructuresByType(type.trim());
        } else if (gouvernoratId != null) {
            structures = structureService.getStructuresByGouvernorat(gouvernoratId);
        } else {
            structures = structureService.getAllStructures();
        }

        return ResponseEntity.ok(structures);
    }

    /**
     * Récupère les structures avec pagination
     */
    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<Page<StructureDto>> getStructuresWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Récupération des structures avec pagination - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<StructureDto> structures = structureService.getStructuresWithPagination(pageable);
        
        return ResponseEntity.ok(structures);
    }

    /**
     * Récupère une structure par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<StructureDto> getStructureById(@PathVariable Long id) {
        log.info("Récupération de la structure avec l'ID: {}", id);
        
        StructureDto structure = structureService.getStructureById(id);
        return ResponseEntity.ok(structure);
    }

    /**
     * Crée une nouvelle structure
     */
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<StructureDto> createStructure(@Valid @RequestBody CreateStructureRequest request) {
        log.info("Création d'une nouvelle structure: {}", request.getNom());
        
        StructureDto createdStructure = structureService.createStructure(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStructure);
    }

    /**
     * Met à jour une structure existante
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<StructureDto> updateStructure(@PathVariable Long id, 
                                                       @Valid @RequestBody UpdateStructureRequest request) {
        log.info("Mise à jour de la structure avec l'ID: {}", id);
        
        StructureDto updatedStructure = structureService.updateStructure(id, request);
        return ResponseEntity.ok(updatedStructure);
    }

    /**
     * Suppression logique d'une structure
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteStructure(@PathVariable Long id) {
        log.info("Suppression de la structure avec l'ID: {}", id);
        
        structureService.deleteStructure(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Active/désactive une structure
     */
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<StructureDto> toggleStructureStatus(@PathVariable Long id) {
        log.info("Changement de statut de la structure avec l'ID: {}", id);
        
        StructureDto structure = structureService.toggleStructureStatus(id);
        return ResponseEntity.ok(structure);
    }
}