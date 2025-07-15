package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.entity.Gouvernorat;
import tn.gov.ms.sidra.repository.GouvernoratRepository;

import java.util.List;

@RestController
@RequestMapping("/gouvernorats")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class GouvernoratController {

    private final GouvernoratRepository gouvernoratRepository;

    /**
     * Récupère tous les gouvernorats
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<Gouvernorat>> getAllGouvernorats() {
        log.info("Récupération de tous les gouvernorats");
        
        List<Gouvernorat> gouvernorats = gouvernoratRepository.findAllByOrderByNomAsc();
        return ResponseEntity.ok(gouvernorats);
    }

    /**
     * Récupère un gouvernorat par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<Gouvernorat> getGouvernoratById(@PathVariable Long id) {
        log.info("Récupération du gouvernorat avec l'ID: {}", id);
        
        return gouvernoratRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}