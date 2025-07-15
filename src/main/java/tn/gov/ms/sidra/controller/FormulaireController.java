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
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.service.CreateFormulaireRequest;
import tn.gov.ms.sidra.service.FormulaireDto;
import tn.gov.ms.sidra.service.FormulaireService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/formulaires")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class FormulaireController {

    private final FormulaireService formulaireService;

    /**
     * Récupère tous les formulaires selon les permissions
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<tn.gov.ms.sidra.service.FormulaireDto>> getAllFormulaires(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {

        log.info("Récupération des formulaires - utilisateur: {}, période: {} - {}",
                currentUser.getEmail(), debut, fin);

        List<tn.gov.ms.sidra.service.FormulaireDto> formulaires;

        if (debut != null && fin != null) {
            formulaires = formulaireService.getFormulairesByPeriod(debut, fin, currentUser);
        } else {
            formulaires = formulaireService.getAllFormulaires(currentUser);
        }

        return ResponseEntity.ok(formulaires);
    }

    /**
     * Récupère un formulaire par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<tn.gov.ms.sidra.service.FormulaireDto> getFormulaireById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        log.info("Récupération du formulaire avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        tn.gov.ms.sidra.service.FormulaireDto formulaire = formulaireService.getFormulaireById(id, currentUser);
        return ResponseEntity.ok(formulaire);
    }

    /**
     * Récupère les formulaires d'un patient
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<tn.gov.ms.sidra.service.FormulaireDto>> getFormulairesByPatientId(
            @PathVariable Long patientId,
            @AuthenticationPrincipal User currentUser) {

        log.info("Récupération des formulaires pour le patient ID: {} par l'utilisateur: {}",
                patientId, currentUser.getEmail());

        List<tn.gov.ms.sidra.service.FormulaireDto> formulaires = formulaireService.getFormulairesByPatientId(patientId, currentUser);
        return ResponseEntity.ok(formulaires);
    }

    /**
     * Crée un nouveau formulaire
     */
    @PostMapping
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<tn.gov.ms.sidra.service.FormulaireDto> createFormulaire(
            @RequestBody CreateFormulaireRequest request,
            @AuthenticationPrincipal User currentUser) {

        log.info("Création d'un nouveau formulaire pour la date: {} par l'utilisateur: {}",
                request.getDateConsultation(), currentUser.getEmail());

        log.info(request.toString());

        tn.gov.ms.sidra.service.FormulaireDto createdFormulaire = formulaireService.createFormulaire(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFormulaire);
    }

    /**
     * Met à jour un formulaire existant
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<tn.gov.ms.sidra.service.FormulaireDto> updateFormulaire(
            @PathVariable Long id,
            @RequestBody CreateFormulaireRequest request,
            @AuthenticationPrincipal User currentUser) {

        log.info("Mise à jour du formulaire avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        tn.gov.ms.sidra.service.FormulaireDto updatedFormulaire = formulaireService.updateFormulaire(id, request, currentUser);
        return ResponseEntity.ok(updatedFormulaire);
    }

    /**
     * Supprime un formulaire
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<Void> deleteFormulaire(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        log.info("Suppression du formulaire avec l'ID: {} par l'utilisateur: {}",
                id, currentUser.getEmail());

        formulaireService.deleteFormulaire(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}