package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.entity.Delegation;
import tn.gov.ms.sidra.repository.DelegationRepository;

import java.util.List;

@RestController
@RequestMapping("/delegations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class DelegationController {

    private final DelegationRepository delegationRepository;

    /**
     * Récupère toutes les délégations d'un gouvernorat
     */
    @GetMapping("/gouvernorat/{gouvernoratId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<Delegation>> getDelegationsByGouvernorat(@PathVariable Long gouvernoratId) {
        log.info("Récupération des délégations pour le gouvernorat ID: {}", gouvernoratId);

        List<Delegation> delegations = delegationRepository.findByGouvernoratIdOrderByNomAsc(gouvernoratId);
        return ResponseEntity.ok(delegations);
    }

    /**
     * Récupère une délégation par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<Delegation> getDelegationById(@PathVariable Long id) {
        log.info("Récupération de la délégation avec l'ID: {}", id);

        return delegationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}