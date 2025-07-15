package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.entity.Ministere;
import tn.gov.ms.sidra.repository.MinistereRepository;

import java.util.List;

@RestController
@RequestMapping("/ministeres")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class MinistereController {

    private final MinistereRepository ministereRepository;

    /**
     * Récupère tous les ministères actifs
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<Ministere>> getAllMinisteres() {
        log.info("Récupération de tous les ministères actifs");

        List<Ministere> ministeres = ministereRepository.findByActifTrueOrderByNomAsc();
        return ResponseEntity.ok(ministeres);
    }

    /**
     * Récupère un ministère par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<Ministere> getMinistereById(@PathVariable Long id) {
        log.info("Récupération du ministère avec l'ID: {}", id);

        return ministereRepository.findByIdAndActifTrue(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}