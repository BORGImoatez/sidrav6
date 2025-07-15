package tn.gov.ms.sidra.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.dto.auth.*;
import tn.gov.ms.sidra.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class AuthController {

    private final AuthService authService;

    /**
     * Connexion par email/mot de passe
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                             HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        LoginResponse response = authService.login(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    /**
     * Vérification du code OTP
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        OtpResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Renvoyer un nouveau code OTP
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<LoginResponse> resendOtp(@RequestParam Long userId,
                                                 HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        LoginResponse response = authService.resendOtp(userId, ipAddress);
        return ResponseEntity.ok(response);
    }

    /**
     * Déconnexion
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        authService.logout(token);
        return ResponseEntity.ok("Déconnexion réussie");
    }

    /**
     * Demande de réinitialisation de mot de passe
     */
    @PostMapping("/forgot-password/request")
    public ResponseEntity<LoginResponse> requestPasswordReset(@RequestBody ForgotPasswordRequest request,
                                                            HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        LoginResponse response = authService.requestPasswordReset(request.getTelephone(), ipAddress);
        return ResponseEntity.ok(response);
    }

    /**
     * Vérification du code OTP pour réinitialisation de mot de passe
     */
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<OtpResponse> verifyPasswordResetOtp(@RequestBody OtpRequest request) {
        OtpResponse response = authService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Renvoyer un code OTP pour réinitialisation de mot de passe
     */
    @PostMapping("/forgot-password/resend-otp")
    public ResponseEntity<LoginResponse> resendPasswordResetOtp(@RequestBody ResendOtpRequest request,
                                                              HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        LoginResponse response = authService.resendPasswordResetOtp(request.getUserId(), ipAddress);
        return ResponseEntity.ok(response);
    }

    /**
     * Réinitialisation du mot de passe
     */
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        ResetPasswordResponse response = authService.resetPassword(request.getUserId(), request.getNewPassword());
        return ResponseEntity.ok(response);
    }

    /**
     * Vérification du statut d'authentification
     */
    @GetMapping("/status")
    public ResponseEntity<String> checkAuthStatus() {
        return ResponseEntity.ok("Authentifié");
    }
    
    /**
     * Inscription d'un nouvel utilisateur (compte inactif)
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Demande d'inscription pour l'email: {}", request.getEmail());
        
        SignupResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Extrait l'adresse IP du client
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * Extrait le token JWT de la requête
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}