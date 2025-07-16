package tn.gov.ms.sidra.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.dto.offredrogues.CreateOffreDroguesRequest;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesDto;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesListDto;
import tn.gov.ms.sidra.dto.offredrogues.UpdateOffreDroguesRequest;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.service.OffreDroguesService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/offre-drogues")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class OffreDroguesController {

    private final OffreDroguesService offreDroguesService;

    /**
     * Récupère toutes les données d'offre de drogues selon les permissions
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR', 'EXTERNE')")
    public ResponseEntity<List<OffreDroguesListDto>> getAllOffresDrogues(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Récupération des données d'offre de drogues - utilisateur: {}, période: {} - {}",
                currentUser.getEmail(), startDate, endDate);

        List<OffreDroguesListDto> offresDrogues;

        if (startDate != null && endDate != null) {
            offresDrogues = offreDroguesService.getOffresDroguesByPeriod(startDate, endDate, currentUser);
        } else {
            offresDrogues = offreDroguesService.getAllOffresDrogues(currentUser);
        }

        return ResponseEntity.ok(offresDrogues);
    }

    /**
     * Récupère la dernière donnée d'offre de drogues avant une date spécifique
     */
    @GetMapping("/last-before")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR', 'EXTERNE')")
    public ResponseEntity<OffreDroguesDto> getLastEntryBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Long currentId,
            @AuthenticationPrincipal User currentUser) {

        log.info("Récupération de la dernière donnée d'offre de drogues avant la date: {} (excluant ID: {})",
                date, currentId);

        OffreDroguesDto lastEntry = offreDroguesService.getLastEntryBefore(date, currentId, currentUser);
        return ResponseEntity.ok(lastEntry);
    }

    /**
     * Récupère une donnée d'offre de drogues par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR', 'EXTERNE')")
    public ResponseEntity<OffreDroguesDto> getOffreDroguesById(@PathVariable Long id,
                                                               @AuthenticationPrincipal User currentUser) {
        log.info("Récupération de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        OffreDroguesDto offreDrogues = offreDroguesService.getOffreDroguesById(id, currentUser);
        return ResponseEntity.ok(offreDrogues);
    }

    /**
     * Crée une nouvelle donnée d'offre de drogues
     */
    @PostMapping
    @PreAuthorize("hasRole('EXTERNE')")
    public ResponseEntity<OffreDroguesDto> createOffreDrogues(@Valid @RequestBody CreateOffreDroguesRequest request,
                                                              @AuthenticationPrincipal User currentUser) {
        log.info("Création d'une nouvelle donnée d'offre de drogues pour la date: {} par l'utilisateur: {}",
                request.getDateSaisie(), currentUser.getEmail());

        OffreDroguesDto createdOffreDrogues = offreDroguesService.createOffreDrogues(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffreDrogues);
    }

    /**
     * Met à jour une donnée d'offre de drogues existante
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EXTERNE')")
    public ResponseEntity<OffreDroguesDto> updateOffreDrogues(@PathVariable Long id,
                                                              @Valid @RequestBody UpdateOffreDroguesRequest request,
                                                              @AuthenticationPrincipal User currentUser) {
        log.info("Mise à jour de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        OffreDroguesDto updatedOffreDrogues = offreDroguesService.updateOffreDrogues(id, request, currentUser);
        return ResponseEntity.ok(updatedOffreDrogues);
    }

    /**
     * Supprime une donnée d'offre de drogues
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EXTERNE')")
    public ResponseEntity<Void> deleteOffreDrogues(@PathVariable Long id,
                                                   @AuthenticationPrincipal User currentUser) {
        log.info("Suppression de la donnée d'offre de drogues avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        offreDroguesService.deleteOffreDrogues(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère les statistiques pour l'utilisateur connecté
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('EXTERNE')")
    public ResponseEntity<Long> getUserStatistics(@AuthenticationPrincipal User currentUser) {
        log.info("Récupération des statistiques pour l'utilisateur: {}", currentUser.getEmail());

        long count = offreDroguesService.getCountByUser(currentUser);
        return ResponseEntity.ok(count);
    }
}