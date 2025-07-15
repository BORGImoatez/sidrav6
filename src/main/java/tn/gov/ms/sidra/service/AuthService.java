package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.dto.auth.*;
import tn.gov.ms.sidra.dto.user.UserDto;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.UserRole;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.mapper.UserMapper;
import tn.gov.ms.sidra.repository.UserRepository;
import tn.gov.ms.sidra.repository.StructureRepository;
import tn.gov.ms.sidra.service.WebSocketService;
import tn.gov.ms.sidra.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    private final StructureRepository structureRepository;
    private final PasswordEncoder passwordEncoder;
    private final WebSocketService webSocketService;

    private static final int MAX_LOGIN_ATTEMPTS = 3;
    private static final int BLOCK_DURATION_MINUTES = 15;

    /**
     * Demande de réinitialisation de mot de passe
     */
    @Transactional
    public LoginResponse requestPasswordReset(String telephone, String ipAddress) {
        log.info("Demande de réinitialisation de mot de passe pour le téléphone: {}", telephone);

        try {
            // Rechercher l'utilisateur par téléphone
            User user = userRepository.findByTelephone(telephone)
                    .orElseThrow(() -> new BusinessException("Aucun compte associé à ce numéro de téléphone"));

            // Vérifier si le compte est actif
            if (!user.getActif()) {
                log.warn("Tentative de réinitialisation sur un compte inactif: {}", telephone);
                return new LoginResponse(false, "Compte désactivé", false, null, null, null);
            }

            // Vérifier si le compte est bloqué
            if (user.getBloqueJusqu() != null && user.getBloqueJusqu().isAfter(LocalDateTime.now())) {
                log.warn("Tentative de réinitialisation sur un compte bloqué: {}", telephone);
                return new LoginResponse(false, "Compte temporairement bloqué", false, null,
                        user.getBloqueJusqu(), null);
            }

            // Générer et envoyer le code OTP
            otpService.generateAndStoreOtp(user, ipAddress);

            log.info("Code OTP généré pour réinitialisation de mot de passe: {}", telephone);
            return new LoginResponse(true, "Code OTP envoyé par SMS", true, user.getId(), null, null);

        } catch (BusinessException e) {
            log.error("Erreur lors de la demande de réinitialisation: {}", e.getMessage());
            return new LoginResponse(false, e.getMessage(), false, null, null, null);
        }
    }

    /**
     * Vérification du code OTP pour réinitialisation de mot de passe
     */
    @Transactional
    public OtpResponse verifyPasswordResetOtp(OtpRequest request) {
        log.info("Vérification du code OTP pour réinitialisation de mot de passe, utilisateur ID: {}", request.getUserId());

        try {
            // Rechercher l'utilisateur
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

            // Vérifier le code OTP
            boolean isValidOtp = otpService.verifyOtp(user, request.getCode());

            if (!isValidOtp) {
                int remainingAttempts = otpService.getRemainingAttempts(user);
                log.warn("Code OTP invalide pour l'utilisateur: {}. Tentatives restantes: {}",
                        user.getEmail(), remainingAttempts);

                return new OtpResponse(false, "Code OTP invalide", null, null, null, remainingAttempts);
            }

            log.info("Code OTP vérifié avec succès pour réinitialisation de mot de passe: {}", user.getEmail());
            return new OtpResponse(true, "Code OTP vérifié avec succès", null, null, null, null);

        } catch (BusinessException e) {
            log.error("Erreur lors de la vérification OTP: {}", e.getMessage());
            return new OtpResponse(false, e.getMessage(), null, null, null, null);
        }
    }

    /**
     * Renvoie un nouveau code OTP pour réinitialisation de mot de passe
     */
    @Transactional
    public LoginResponse resendPasswordResetOtp(Long userId, String ipAddress) {
        log.info("Demande de renvoi de code OTP pour réinitialisation de mot de passe, utilisateur ID: {}", userId);

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

            // Générer et envoyer un nouveau code OTP
            otpService.resendOtp(user, ipAddress);

            log.info("Nouveau code OTP généré et envoyé pour réinitialisation de mot de passe: {}", user.getEmail());
            return new LoginResponse(true, "Nouveau code OTP envoyé", true, userId, null, null);

        } catch (BusinessException e) {
            log.error("Erreur lors du renvoi OTP: {}", e.getMessage());
            return new LoginResponse(false, e.getMessage(), false, null, null, null);
        }
    }

    /**
     * Réinitialisation du mot de passe
     */
    @Transactional
    public ResetPasswordResponse resetPassword(Long userId, String newPassword) {
        log.info("Réinitialisation du mot de passe pour l'utilisateur ID: {}", userId);

        try {
            // Rechercher l'utilisateur
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

            // Vérifier que le mot de passe respecte les critères de sécurité
            if (!isPasswordValid(newPassword)) {
                throw new BusinessException("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial");
            }

            // Mettre à jour le mot de passe
            user.setMotDePasse(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            log.info("Mot de passe réinitialisé avec succès pour l'utilisateur: {}", user.getEmail());
            return new ResetPasswordResponse(true, "Mot de passe réinitialisé avec succès");

        } catch (BusinessException e) {
            log.error("Erreur lors de la réinitialisation du mot de passe: {}", e.getMessage());
            return new ResetPasswordResponse(false, e.getMessage());
        }
    }

    /**
     * Vérifie que le mot de passe respecte les critères de sécurité
     */
    private boolean isPasswordValid(String password) {
        // Au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
        String pattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";
        return password.matches(pattern);
    }

    /**
     * Authentification par email/mot de passe
     */
    @Transactional
    public LoginResponse login(LoginRequest request, String ipAddress) {
        log.info("Tentative de connexion pour l'email: {}", request.getEmail());

        try {
            // Rechercher l'utilisateur
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

            // Vérifier si le compte est actif
            if (!user.getActif()) {
                log.warn("Tentative de connexion sur un compte inactif: {}", request.getEmail());
                return new LoginResponse(false, "Compte désactivé", false, null, null, null);
            }

            // Vérifier si le compte est bloqué
            if (user.getBloqueJusqu() != null && user.getBloqueJusqu().isAfter(LocalDateTime.now())) {
                log.warn("Tentative de connexion sur un compte bloqué: {}", request.getEmail());
                return new LoginResponse(false, "Compte temporairement bloqué", false, null,
                        user.getBloqueJusqu(), null);
            }

            // Tenter l'authentification
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
            );

            // Authentification réussie - réinitialiser les tentatives
            user.setTentativesConnexion(0);
            user.setBloqueJusqu(null);
            userRepository.save(user);

            // Générer et envoyer le code OTP
            otpService.generateAndStoreOtp(user, ipAddress);

            log.info("Authentification réussie pour l'utilisateur: {}. Code OTP généré.", request.getEmail());
            return new LoginResponse(true, "Code OTP envoyé par SMS", true, user.getId(), null, null);

        } catch (AuthenticationException e) {
            // Authentification échouée - gérer les tentatives
            return handleFailedLogin(request.getEmail());
        }
    }

    /**
     * Vérification du code OTP et génération du token JWT
     */
    @Transactional
    public OtpResponse verifyOtp(OtpRequest request) {
        log.info("Vérification du code OTP pour l'utilisateur ID: {}", request.getUserId());

        try {
            // Rechercher l'utilisateur
            User user = userRepository.findByIdWithStructure(request.getUserId())
                    .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

            // Vérifier le code OTP
            boolean isValidOtp = otpService.verifyOtp(user, request.getCode());

            if (!isValidOtp) {
                int remainingAttempts = otpService.getRemainingAttempts(user);
                log.warn("Code OTP invalide pour l'utilisateur: {}. Tentatives restantes: {}",
                        user.getEmail(), remainingAttempts);

                return new OtpResponse(false, "Code OTP invalide", null, null, null, remainingAttempts);
            }

            // Code OTP valide - générer le token JWT
            String token = jwtTokenProvider.generateToken(user);

            // Mettre à jour la dernière connexion
            user.setDerniereConnexion(LocalDateTime.now());
            userRepository.save(user);

            // Mapper l'utilisateur vers DTO
            UserDto userDto = userMapper.toDto(user);

            log.info("Code OTP vérifié avec succès pour l'utilisateur: {}. Token JWT généré.", user.getEmail());
            return new OtpResponse(true, "Connexion réussie", token, userDto, null, null);

        } catch (BusinessException e) {
            log.error("Erreur lors de la vérification OTP: {}", e.getMessage());
            return new OtpResponse(false, e.getMessage(), null, null, null, null);
        }
    }

    /**
     * Renvoie un nouveau code OTP
     */
    @Transactional
    public LoginResponse resendOtp(Long userId, String ipAddress) {
        log.info("Demande de renvoi de code OTP pour l'utilisateur ID: {}", userId);

        try {
            User user = userRepository.findByIdWithStructure(userId)
                    .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

            // Générer et envoyer un nouveau code OTP
            otpService.resendOtp(user, ipAddress);

            log.info("Nouveau code OTP généré et envoyé pour l'utilisateur: {}", user.getEmail());
            return new LoginResponse(true, "Nouveau code OTP envoyé", true, userId, null, null);

        } catch (BusinessException e) {
            log.error("Erreur lors du renvoi OTP: {}", e.getMessage());
            return new LoginResponse(false, e.getMessage(), false, null, null, null);
        }
    }

    /**
     * Gère les échecs de connexion
     */
    private LoginResponse handleFailedLogin(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            int attempts = user.getTentativesConnexion() + 1;
            user.setTentativesConnexion(attempts);

            if (attempts >= MAX_LOGIN_ATTEMPTS) {
                // Bloquer le compte
                LocalDateTime blockUntil = LocalDateTime.now().plusMinutes(BLOCK_DURATION_MINUTES);
                user.setBloqueJusqu(blockUntil);
                userRepository.save(user);

                log.warn("Compte bloqué pour l'utilisateur: {} après {} tentatives", email, attempts);
                return new LoginResponse(false, "Compte bloqué après trop de tentatives", false, null,
                        blockUntil, 0);
            } else {
                userRepository.save(user);
                int remaining = MAX_LOGIN_ATTEMPTS - attempts;
                log.warn("Échec de connexion pour l'utilisateur: {}. Tentatives restantes: {}", email, remaining);
                return new LoginResponse(false, "Identifiants invalides", false, null, null, remaining);
            }
        }

        return new LoginResponse(false, "Identifiants invalides", false, null, null, null);
    }

    /**
     * Déconnexion (invalidation du token côté client)
     */
    public void logout(String token) {
        // Dans une implémentation complète, vous pourriez maintenir une liste noire des tokens
        // ou utiliser Redis pour stocker les tokens invalidés
        log.info("Déconnexion effectuée");
    }

    /**
     * Inscription d'un nouvel utilisateur (compte inactif)
     */
    @Transactional
    public SignupResponse signup(SignupRequest request) {
        log.info("Traitement de la demande d'inscription pour: {}", request.getEmail());

        // Vérifier l'unicité de l'email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Cette adresse email est déjà utilisée");
        }

        // Vérifier l'unicité du téléphone
        if (userRepository.existsByTelephone(request.getTelephone())) {
            throw new BusinessException("Ce numéro de téléphone est déjà utilisé");
        }

        // Vérifier que la structure existe
        Structure structure = structureRepository.findByIdAndActifTrue(request.getStructureId())
                .orElseThrow(() -> new BusinessException("Structure non trouvée"));

        // Créer l'utilisateur avec le statut PENDING
        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(UserRole.PENDING); // Toujours PENDING pour les inscriptions
        user.setStructure(structure);
        user.setActif(false); // Inactif par défaut
        user.setDateCreation(LocalDateTime.now());
        user.setTentativesConnexion(0);

        User savedUser = userRepository.save(user);
        log.info("Utilisateur créé avec succès en attente d'activation: {}", savedUser.getId());

        // Envoyer une notification aux administrateurs via WebSocket
        webSocketService.notifyAdmins("NEW_USER_SIGNUP", savedUser.getId());

        return new SignupResponse(true, "Votre demande d'inscription a été envoyée avec succès. Un administrateur l'examinera prochainement.", savedUser.getId());
    }
}