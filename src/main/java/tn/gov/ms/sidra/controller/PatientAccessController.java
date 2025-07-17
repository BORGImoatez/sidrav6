package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.dto.patientaccess.AccessRequestDto;
import tn.gov.ms.sidra.dto.patientaccess.PatientAccessRequestDto;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.service.PatientAccessService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patient-access")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class PatientAccessController {

    private final PatientAccessService patientAccessService;

    /**
     * Demande l'accès à un patient
     */
    @PostMapping("/request")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<AccessRequestDto> requestAccess(
            @RequestBody PatientAccessRequestDto request,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Demande d'accès au patient ID: {} par l'utilisateur: {}", 
                request.getPatientId(), currentUser.getEmail());
        
        AccessRequestDto result = patientAccessService.requestAccess(request.getPatientId(), currentUser);
        return ResponseEntity.ok(result);
    }

    /**
     * Récupère les demandes d'accès envoyées par l'utilisateur courant
     */
    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<List<AccessRequestDto>> getMyRequests(@AuthenticationPrincipal User currentUser) {
        log.info("Récupération des demandes d'accès envoyées par l'utilisateur: {}", currentUser.getEmail());
        
        List<AccessRequestDto> requests = patientAccessService.getRequestsByUser(currentUser);
        return ResponseEntity.ok(requests);
    }

    /**
     * Récupère les demandes d'accès reçues par l'utilisateur courant
     */
    @GetMapping("/received-requests")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<List<AccessRequestDto>> getReceivedRequests(@AuthenticationPrincipal User currentUser) {
        log.info("Récupération des demandes d'accès reçues par l'utilisateur: {}", currentUser.getEmail());
        
        List<AccessRequestDto> requests = patientAccessService.getReceivedRequests(currentUser);
        return ResponseEntity.ok(requests);
    }

    /**
     * Approuve une demande d'accès
     */
    @PostMapping("/{requestId}/approve")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<AccessRequestDto> approveRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Approbation de la demande d'accès ID: {} par l'utilisateur: {}", 
                requestId, currentUser.getEmail());
        
        AccessRequestDto result = patientAccessService.approveRequest(requestId, currentUser);
        return ResponseEntity.ok(result);
    }

    /**
     * Rejette une demande d'accès
     */
    @PostMapping("/{requestId}/reject")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<AccessRequestDto> rejectRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Rejet de la demande d'accès ID: {} par l'utilisateur: {}", 
                requestId, currentUser.getEmail());
        
        AccessRequestDto result = patientAccessService.rejectRequest(requestId, currentUser);
        return ResponseEntity.ok(result);
    }

    /**
     * Annule une demande d'accès
     */
    @PostMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<AccessRequestDto> cancelRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Annulation de la demande d'accès ID: {} par l'utilisateur: {}", 
                requestId, currentUser.getEmail());
        
        AccessRequestDto result = patientAccessService.cancelRequest(requestId, currentUser);
        return ResponseEntity.ok(result);
    }

    /**
     * Vérifie si l'utilisateur a accès à un patient
     */
    @GetMapping("/check/{patientId}")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<Map<String, Object>> checkAccess(
            @PathVariable Long patientId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Vérification d'accès au patient ID: {} par l'utilisateur: {}", 
                patientId, currentUser.getEmail());
        
        Map<String, Object> result = patientAccessService.checkAccess(patientId, currentUser);
        return ResponseEntity.ok(result);
    }
}