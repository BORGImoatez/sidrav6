package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.dto.user.CreateUserRequest;
import tn.gov.ms.sidra.dto.user.UpdateUserRequest;
import tn.gov.ms.sidra.dto.user.UserDto;
import tn.gov.ms.sidra.dto.user.UserStructureInfoDto;
import tn.gov.ms.sidra.dto.user.UserStatsDto;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.entity.TypeStructure;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.UserMapper;
import tn.gov.ms.sidra.repository.StructureRepository;
import tn.gov.ms.sidra.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final StructureRepository structureRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Récupère tous les utilisateurs ou filtrés par structure
     */
    @Transactional(readOnly = true)
    public List<UserDto> getUsers(Long structureId) {
        log.info("Récupération des utilisateurs - structureId: {}", structureId);

        List<User> users;
        if (structureId != null) {
            users = userRepository.findByStructureId(structureId);
        } else {
            users = userRepository.findAll();
        }

        return users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un utilisateur par son ID
     */
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        log.info("Récupération de l'utilisateur avec l'ID: {}", id);

        User user = userRepository.findByIdWithStructure(id)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé avec l'ID: " + id));

        return userMapper.toDto(user);
    }

    /**
     * Crée un nouvel utilisateur
     */
    @Transactional
    public UserDto createUser(CreateUserRequest request, User currentUser) {
        log.info("Création d'un nouvel utilisateur: {} - Rôle: {}", request.getEmail(), request.getRole());

        // Validation des permissions
        validateUserCreationPermissions(request, currentUser);

        // Vérifier l'unicité de l'email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Cette adresse email est déjà utilisée");
        }

        // Vérifier l'unicité du téléphone
        if (userRepository.existsByTelephone(request.getTelephone())) {
            throw new BusinessException("Ce numéro de téléphone est déjà utilisé");
        }

        // Créer l'utilisateur
        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setRole(request.getRole());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setActif(true);
        user.setTentativesConnexion(0);

        // Affecter la structure si nécessaire
        if (request.getStructureId() != null) {
            Structure structure = structureRepository.findByIdAndActifTrue(request.getStructureId())
                    .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + request.getStructureId()));
            user.setStructure(structure);
        } else if (request.getRole() != UserRole.SUPER_ADMIN) {
            throw new BusinessException("Une structure est obligatoire pour ce rôle");
        }

        User savedUser = userRepository.save(user);
        log.info("Utilisateur créé avec succès avec l'ID: {}", savedUser.getId());

        return userMapper.toDto(savedUser);
    }

    /**
     * Met à jour un utilisateur existant
     */
    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest request, User currentUser) {
        log.info("Mise à jour de l'utilisateur avec l'ID: {}", id);

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé avec l'ID: " + id));

        // Validation des permissions
        validateUserUpdatePermissions(existingUser, request, currentUser);

        // Vérifier l'unicité de l'email (sauf pour cet utilisateur)
        if (userRepository.existsByEmail(request.getEmail()) &&
                !existingUser.getEmail().equals(request.getEmail())) {
            throw new BusinessException("Cette adresse email est déjà utilisée");
        }

        // Vérifier l'unicité du téléphone (sauf pour cet utilisateur)
        if (userRepository.existsByTelephone(request.getTelephone()) &&
                !existingUser.getTelephone().equals(request.getTelephone())) {
            throw new BusinessException("Ce numéro de téléphone est déjà utilisé");
        }

        // Mettre à jour les champs
        existingUser.setNom(request.getNom());
        existingUser.setPrenom(request.getPrenom());
        existingUser.setEmail(request.getEmail());
        existingUser.setTelephone(request.getTelephone());
        existingUser.setRole(request.getRole());

        // Mettre à jour la structure
        if (request.getStructureId() != null) {
            Structure structure = structureRepository.findByIdAndActifTrue(request.getStructureId())
                    .orElseThrow(() -> new BusinessException("Structure non trouvée avec l'ID: " + request.getStructureId()));
            existingUser.setStructure(structure);
        } else if (request.getRole() != UserRole.SUPER_ADMIN) {
            throw new BusinessException("Une structure est obligatoire pour ce rôle");
        } else {
            existingUser.setStructure(null);
        }

        User updatedUser = userRepository.save(existingUser);
        log.info("Utilisateur mis à jour avec succès: {}", updatedUser.getId());

        return userMapper.toDto(updatedUser);
    }

    /**
     * Suppression logique d'un utilisateur
     */
    @Transactional
    public void deleteUser(Long id, User currentUser) {
        log.info("Suppression logique de l'utilisateur avec l'ID: {}", id);

        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé avec l'ID: " + id));

        // Validation des permissions
        validateUserDeletionPermissions(userToDelete, currentUser);

        // Empêcher l'auto-suppression
        if (userToDelete.getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous ne pouvez pas supprimer votre propre compte");
        }

        // Suppression logique
        userToDelete.setActif(false);
        userRepository.save(userToDelete);

        log.info("Utilisateur supprimé logiquement avec succès: {}", id);
    }

    /**
     * Active/désactive un utilisateur
     */
    @Transactional
    public UserDto toggleUserStatus(Long id, User currentUser) {
        log.info("Changement de statut de l'utilisateur avec l'ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé avec l'ID: " + id));

        // Validation des permissions
        validateUserStatusChangePermissions(user, currentUser);

        // Empêcher l'auto-désactivation
        if (user.getId().equals(currentUser.getId())) {
            throw new BusinessException("Vous ne pouvez pas modifier le statut de votre propre compte");
        }

        user.setActif(!user.getActif());
        User updatedUser = userRepository.save(user);

        log.info("Statut de l'utilisateur changé: {} -> {}", id, updatedUser.getActif());
        return userMapper.toDto(updatedUser);
    }

    /**
     * Récupère les statistiques des utilisateurs
     */
    public UserStatsDto getUserStatistics() {
        log.info("Récupération des statistiques des utilisateurs");

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countActiveUsers();
        long totalStructures = structureRepository.count();
        long activeStructures = structureRepository.countActiveStructures();

        // Statistiques par rôle
        UserStatsDto.UserRoleStatsDto roleStats = new UserStatsDto.UserRoleStatsDto();
        roleStats.setSuperAdmin(userRepository.countUsersByRole(UserRole.SUPER_ADMIN));
        roleStats.setAdminStructure(userRepository.countUsersByRole(UserRole.ADMIN_STRUCTURE));
        roleStats.setUtilisateur(userRepository.countUsersByRole(UserRole.UTILISATEUR));
        roleStats.setExterne(userRepository.countUsersByRole(UserRole.EXTERNE));

        // Statistiques par type de structure
        UserStatsDto.StructureTypeStatsDto structureStats = new UserStatsDto.StructureTypeStatsDto();
        structureStats.setPublique(structureRepository.countStructuresByType(TypeStructure.PUBLIQUE));
        structureStats.setPrivee(structureRepository.countStructuresByType(TypeStructure.PRIVEE));
        structureStats.setOng(structureRepository.countStructuresByType(TypeStructure.ONG));

        return new UserStatsDto(totalUsers, activeUsers, totalStructures, activeStructures,
                roleStats, structureStats);
    }

    /**
     * Récupère les informations de structure de l'utilisateur
     */
    @Transactional(readOnly = true)
    public UserStructureInfoDto getUserStructureInfo(User user) {
        log.info("Récupération des informations de structure pour l'utilisateur: {}", user.getEmail());

        // Recharger l'utilisateur avec sa structure pour éviter LazyInitializationException
        User userWithStructure = userRepository.findByIdWithStructure(user.getId())
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé avec l'ID: " + user.getId()));

        UserStructureInfoDto structureInfo = new UserStructureInfoDto();
        structureInfo.setUserId(userWithStructure.getId());
        structureInfo.setHasStructure(userWithStructure.getStructure() != null);

        if (userWithStructure.getStructure() != null) {
            Structure structure = userWithStructure.getStructure();

            structureInfo.setTypeStructure(structure.getType());
            structureInfo.setSecteur(structure.getSecteur());
            structureInfo.setMinistere(structure.getSecteur()); // Utiliser le secteur comme ministère
            structureInfo.setStructureId(structure.getId());
            structureInfo.setStructureNom(structure.getNom());

            if (structure.getGouvernorat() != null) {
                structureInfo.setGouvernoratId(structure.getGouvernorat().getId());
                structureInfo.setGouvernoratNom(structure.getGouvernorat().getNom());
            }
        }

        return structureInfo;
    }

    /**
     * Valide les permissions pour la création d'utilisateur
     */
    private void validateUserCreationPermissions(CreateUserRequest request, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            // SUPER_ADMIN peut créer tous les types d'utilisateurs
            return;
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // ADMIN_STRUCTURE peut créer seulement des UTILISATEUR dans sa structure
            if (request.getRole() != UserRole.UTILISATEUR) {
                throw new BusinessException("Vous ne pouvez créer que des utilisateurs normaux");
            }

            if (!request.getStructureId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez créer des utilisateurs que dans votre structure");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour créer des utilisateurs");
    }

    /**
     * Valide les permissions pour la modification d'utilisateur
     */
    private void validateUserUpdatePermissions(User existingUser, UpdateUserRequest request, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            // SUPER_ADMIN peut modifier tous les utilisateurs
            return;
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            // ADMIN_STRUCTURE peut modifier seulement les utilisateurs de sa structure
            if (!existingUser.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez modifier que les utilisateurs de votre structure");
            }

            // Ne peut pas modifier le rôle vers SUPER_ADMIN ou ADMIN_STRUCTURE
            if (request.getRole() == UserRole.SUPER_ADMIN || request.getRole() == UserRole.ADMIN_STRUCTURE) {
                throw new BusinessException("Vous ne pouvez pas attribuer ce rôle");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour modifier cet utilisateur");
    }

    /**
     * Valide les permissions pour la suppression d'utilisateur
     */
    private void validateUserDeletionPermissions(User userToDelete, User currentUser) {
        if (currentUser.getRole() == UserRole.SUPER_ADMIN) {
            return;
        }

        if (currentUser.getRole() == UserRole.ADMIN_STRUCTURE) {
            if (!userToDelete.getStructure().getId().equals(currentUser.getStructure().getId())) {
                throw new BusinessException("Vous ne pouvez supprimer que les utilisateurs de votre structure");
            }

            if (userToDelete.getRole() == UserRole.SUPER_ADMIN || userToDelete.getRole() == UserRole.ADMIN_STRUCTURE) {
                throw new BusinessException("Vous ne pouvez pas supprimer cet utilisateur");
            }
            return;
        }

        throw new BusinessException("Vous n'avez pas les permissions pour supprimer cet utilisateur");
    }

    /**
     * Valide les permissions pour le changement de statut
     */
    private void validateUserStatusChangePermissions(User user, User currentUser) {
        validateUserDeletionPermissions(user, currentUser); // Mêmes règles que la suppression
    }
}