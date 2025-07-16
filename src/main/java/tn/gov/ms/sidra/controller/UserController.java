package tn.gov.ms.sidra.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.dto.user.CreateUserRequest;
import tn.gov.ms.sidra.dto.user.UpdateUserRequest;
import tn.gov.ms.sidra.dto.user.UserDto;
import tn.gov.ms.sidra.dto.user.UserStructureInfoDto;
import tn.gov.ms.sidra.dto.user.UserStatsDto;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class UserController {

    private final UserService userService;

    /**
     * Récupère tous les utilisateurs ou filtrés par structure
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<List<UserDto>> getUsers(@RequestParam(required = false) Long structureId) {
        log.info("Récupération des utilisateurs - structureId: {}", structureId);
        
        List<UserDto> users = userService.getUsers(structureId);
        return ResponseEntity.ok(users);
    }
    
    /**
     * Récupère tous les utilisateurs en attente d'activation
     */
    @GetMapping(params = "role=PENDING")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserDto>> getPendingUsers() {
        log.info("Récupération des utilisateurs en attente d'activation");

        List<UserDto> users = userService.getPendingUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Récupère un utilisateur par son ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        log.info("Récupération de l'utilisateur avec l'ID: {}", id);

        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Crée un nouvel utilisateur
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request,
                                              @AuthenticationPrincipal User currentUser) {
        log.info("Création d'un nouvel utilisateur: {} - Rôle: {}", request.getEmail(), request.getRole());

        UserDto createdUser = userService.createUser(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Met à jour un utilisateur existant
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                              @Valid @RequestBody UpdateUserRequest request,
                                              @AuthenticationPrincipal User currentUser) {
        log.info("Mise à jour de l'utilisateur avec l'ID: {}", id);

        UserDto updatedUser = userService.updateUser(id, request, currentUser);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Suppression logique d'un utilisateur
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                           @AuthenticationPrincipal User currentUser) {
        log.info("Suppression de l'utilisateur avec l'ID: {}", id);

        userService.deleteUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * Active/désactive un utilisateur
     */
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<UserDto> toggleUserStatus(@PathVariable Long id,
                                                    @AuthenticationPrincipal User currentUser) {
        log.info("Changement de statut de l'utilisateur avec l'ID: {}", id);

        UserDto user = userService.toggleUserStatus(id, currentUser);
        return ResponseEntity.ok(user);
    }

    /**
     * Récupère les statistiques des utilisateurs
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE')")
    public ResponseEntity<UserStatsDto> getUserStatistics() {
        log.info("Récupération des statistiques des utilisateurs");

        UserStatsDto stats = userService.getUserStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Récupère les informations de structure de l'utilisateur connecté
     */
    @GetMapping("/structure-info")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_STRUCTURE','UTILISATEUR','EXTERNE')")
    public ResponseEntity<UserStructureInfoDto> getUserStructureInfo(@AuthenticationPrincipal User currentUser) {
        log.info("Récupération des informations de structure pour l'utilisateur: {}", currentUser.getEmail());

        UserStructureInfoDto structureInfo = userService.getUserStructureInfo(currentUser);
        return ResponseEntity.ok(structureInfo);
    }
    
    /**
     * Approuve un utilisateur en attente
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long id) {
        log.info("Approbation de l'utilisateur avec l'ID: {}", id);
        
        UserDto approvedUser = userService.approveUser(id);
        return ResponseEntity.ok(approvedUser);
    }
    
    /**
     * Rejette un utilisateur en attente
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> rejectUser(@PathVariable Long id) {
        log.info("Rejet de l'utilisateur avec l'ID: {}", id);
        
        userService.rejectUser(id);
        return ResponseEntity.noContent().build();
    }
}