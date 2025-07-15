package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.entity.OtpCode;
import tn.gov.ms.sidra.entity.OtpEtat;
import tn.gov.ms.sidra.entity.User;
import tn.gov.ms.sidra.exception.BusinessException;
import tn.gov.ms.sidra.repository.OtpCodeRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;
    private final SmsService smsService;

    @Value("${otp.expiration:300000}") // 5 minutes par défaut
    private long otpExpiration;

    @Value("${otp.max-attempts:3}")
    private int maxAttempts;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Génère et stocke un nouveau code OTP pour un utilisateur
     */
    @Transactional
    public OtpCode generateAndStoreOtp(User user, String ipAddress) {
        log.info("Génération d'un nouveau code OTP pour l'utilisateur: {}", user.getEmail());

        // Invalider tous les codes OTP existants pour cet utilisateur
        invalidateExistingOtpCodes(user);

        // Générer un nouveau code OTP
        String otpCode = generateOtpCode();
        
        // Calculer la date d'expiration
        LocalDateTime expirationDate = LocalDateTime.now().plusSeconds(otpExpiration / 1000);

        // Créer et sauvegarder le nouveau code OTP
        OtpCode otpEntity = new OtpCode();
        otpEntity.setUser(user);
        otpEntity.setCode(otpCode);
        otpEntity.setDateExpiration(expirationDate);
        otpEntity.setEtat(OtpEtat.VALIDE);
        otpEntity.setNombreTentatives(0);
        otpEntity.setAdresseIp(ipAddress);

        OtpCode savedOtp = otpCodeRepository.save(otpEntity);

        // Envoyer le code OTP par SMS de manière asynchrone
        sendOtpBySms(user, otpCode);

        log.info("Code OTP généré et stocké avec succès pour l'utilisateur: {}", user.getEmail());
        return savedOtp;
    }

    /**
     * Vérifie un code OTP
     */
    @Transactional
    public boolean verifyOtp(User user, String code) {
        log.info("Vérification du code OTP pour l'utilisateur: {}", user.getEmail());

        // Nettoyer les codes expirés
        cleanupExpiredCodes();

        // Rechercher le code OTP valide
        Optional<OtpCode> otpOptional = otpCodeRepository
                .findFirstByUserAndEtatOrderByDateCreationDesc(user, OtpEtat.VALIDE);

        if (otpOptional.isEmpty()) {
            log.warn("Aucun code OTP valide trouvé pour l'utilisateur: {}", user.getEmail());
            return false;
        }

        OtpCode otpCode = otpOptional.get();

        // Vérifier si le code est expiré
        if (otpCode.isExpired()) {
            otpCode.setEtat(OtpEtat.EXPIRE);
            otpCodeRepository.save(otpCode);
            log.warn("Code OTP expiré pour l'utilisateur: {}", user.getEmail());
            return false;
        }

        // Vérifier le nombre de tentatives
        if (otpCode.getNombreTentatives() >= maxAttempts) {
            otpCode.setEtat(OtpEtat.BLOQUE);
            otpCodeRepository.save(otpCode);
            log.warn("Code OTP bloqué après {} tentatives pour l'utilisateur: {}", 
                    maxAttempts, user.getEmail());
            throw new BusinessException("Code OTP bloqué après trop de tentatives");
        }

        // Incrémenter le nombre de tentatives
        otpCode.setNombreTentatives(otpCode.getNombreTentatives() + 1);

        // Vérifier le code
        if (!otpCode.getCode().equals(code)) {
            otpCodeRepository.save(otpCode);
            log.warn("Code OTP invalide pour l'utilisateur: {} (tentative {}/{})", 
                    user.getEmail(), otpCode.getNombreTentatives(), maxAttempts);
            return false;
        }

        // Code valide - marquer comme utilisé
        otpCode.setEtat(OtpEtat.UTILISE);
        otpCodeRepository.save(otpCode);

        log.info("Code OTP vérifié avec succès pour l'utilisateur: {}", user.getEmail());
        return true;
    }

    /**
     * Renvoie un nouveau code OTP
     */
    @Transactional
    public OtpCode resendOtp(User user, String ipAddress) {
        log.info("Renvoi d'un nouveau code OTP pour l'utilisateur: {}", user.getEmail());

        // Vérifier la limite de génération de codes (par exemple, max 3 codes par heure)
        long recentCodesCount = otpCodeRepository.countByUserAndDateCreationAfter(
                user, LocalDateTime.now().minusHours(1));

        if (recentCodesCount >= 5) {
            throw new BusinessException("Trop de demandes de codes OTP. Veuillez patienter.");
        }

        return generateAndStoreOtp(user, ipAddress);
    }

    /**
     * Invalide tous les codes OTP existants pour un utilisateur
     */
    @Transactional
    public void invalidateExistingOtpCodes(User user) {
        otpCodeRepository.updateEtatByUserAndEtat(user, OtpEtat.VALIDE, OtpEtat.EXPIRE);
        log.debug("Codes OTP existants invalidés pour l'utilisateur: {}", user.getEmail());
    }

    /**
     * Nettoie les codes OTP expirés
     */
    @Transactional
    public void cleanupExpiredCodes() {
        otpCodeRepository.expireOldCodes(LocalDateTime.now());
        log.debug("Nettoyage des codes OTP expirés effectué");
    }

    /**
     * Obtient le nombre de tentatives restantes pour un utilisateur
     */
    public int getRemainingAttempts(User user) {
        Optional<OtpCode> otpOptional = otpCodeRepository
                .findFirstByUserAndEtatOrderByDateCreationDesc(user, OtpEtat.VALIDE);

        if (otpOptional.isEmpty()) {
            return maxAttempts;
        }

        OtpCode otpCode = otpOptional.get();
        return Math.max(0, maxAttempts - otpCode.getNombreTentatives());
    }

    /**
     * Génère un code OTP à 6 chiffres
     */
    private String generateOtpCode() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Envoie le code OTP par SMS de manière asynchrone
     */
    @Async
    private void sendOtpBySms(User user, String otpCode) {
        try {
            String message = String.format(
                    "SIDRA: Votre code de vérification est %s. Ce code expire dans 5 minutes. Ne le partagez avec personne.",
                    otpCode
            );

            // TODO: Remplacer par votre implémentation d'envoi SMS
            // Exemple d'appel à votre API SMS
            smsService.sendSms(user.getTelephone(), message);

            log.info("Code OTP envoyé par SMS à l'utilisateur: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi du SMS OTP pour l'utilisateur: {}", user.getEmail(), e);
            // Ne pas faire échouer la transaction principale en cas d'erreur SMS
        }
    }
}