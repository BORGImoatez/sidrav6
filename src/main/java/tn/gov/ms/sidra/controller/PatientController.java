package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
  import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.service.PatientDto;
import tn.gov.ms.sidra.service.PatientService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class PatientController {

    private final PatientService patientService;

    /**
     * Récupère tous les patients selon les permissions
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<List<tn.gov.ms.sidra.service.PatientListDto>> getAllPatients(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) String search) {
        
        log.info("Récupération des patients - utilisateur: {}, search: {}", 
                currentUser.getEmail(), search);

        List<tn.gov.ms.sidra.service.PatientListDto> patients;

        if (search != null && !search.trim().isEmpty()) {
            patients = patientService.searchPatients(search.trim(), currentUser);
        } else {
            patients = patientService.getAllPatients(currentUser);
        }

        return ResponseEntity.ok(patients);
    }

    /**
     * Recherche des patients dans d'autres structures (accès limité)
     */
    @GetMapping("/external-search")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<List<PatientDto>> searchPatientsExternal(
            @RequestParam(required = false) String codePatient,
            @RequestParam(required = false) Long structureId,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Recherche externe de patients - utilisateur: {}, code: {}, structureId: {}", 
                currentUser.getEmail(), codePatient, structureId);

        List<PatientDto> patients = patientService.searchPatientsExternal(codePatient, structureId, currentUser);
        return ResponseEntity.ok(patients);
    }

    /**
     * Crée un nouveau patient dans la structure actuelle en référençant un patient d'une autre structure
     */
    @PostMapping("/create-from-external")
    @PreAuthorize("hasRole('UTILISATEUR')")
    public ResponseEntity<PatientDto> createPatientFromExternal(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal User currentUser) {
        
        Long originalPatientId = Long.valueOf(request.get("originalPatientId").toString());
        log.info("Création d'un patient depuis externe - utilisateur: {}, patient original: {}", 
                currentUser.getEmail(), originalPatientId);
        
        PatientDto patient = patientService.createPatientFromExternal(originalPatientId, currentUser);
        return ResponseEntity.ok(patient);
    }

    /**
     * Récupère un patient par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE', 'UTILISATEUR')")
    public ResponseEntity<PatientDto> getPatientById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        
        log.info("Récupération du patient avec l'ID: {} par l'utilisateur: {}", 
                id, currentUser.getEmail());
        
        PatientDto patient = patientService.getPatientById(id, currentUser);
        return ResponseEntity.ok(patient);
    }
}