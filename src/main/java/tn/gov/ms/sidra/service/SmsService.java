package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    private final RestTemplate restTemplate = new RestTemplate();

     private String smsApiUrl;

     private String smsApiKey;

     private String smsSender;

    /**
     * Envoie un SMS via l'API SMS
     * 
     * TODO: REMPLACER CETTE MÉTHODE PAR VOTRE IMPLÉMENTATION D'API SMS
     * 
     * Cette méthode doit être adaptée selon votre fournisseur SMS :
     * - Twilio
     * - AWS SNS
     * - Vonage (Nexmo)
     * - Infobip
     * - Ou tout autre fournisseur SMS tunisien/local
     */
    public void sendSms(String phoneNumber, String message) {
        try {
            log.info("Envoi SMS vers le numéro: {}", phoneNumber);

            // ========================================
            // TODO: IMPLÉMENTATION DE VOTRE API SMS
            // ========================================
            
            // Exemple générique - À ADAPTER selon votre fournisseur
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(smsApiKey); // ou headers.set("Authorization", "Bearer " + smsApiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("to", phoneNumber);
            requestBody.put("from", smsSender);
            requestBody.put("text", message);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(smsApiUrl, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("SMS envoyé avec succès vers: {}", phoneNumber);
            } else {
                log.error("Erreur lors de l'envoi SMS. Code de réponse: {}", response.getStatusCode());
                throw new RuntimeException("Erreur lors de l'envoi du SMS");
            }

            // ========================================
            // EXEMPLES D'IMPLÉMENTATIONS SPÉCIFIQUES
            // ========================================

            /*
            // EXEMPLE TWILIO:
            Twilio.init(accountSid, authToken);
            Message message = Message.creator(
                new PhoneNumber(phoneNumber),
                new PhoneNumber(smsSender),
                message)
                .create();
            */

            /*
            // EXEMPLE AWS SNS:
            AmazonSNS snsClient = AmazonSNSClientBuilder.standard()
                .withRegion(Regions.EU_WEST_1)
                .build();
            
            PublishRequest request = new PublishRequest()
                .withPhoneNumber(phoneNumber)
                .withMessage(message);
            
            snsClient.publish(request);
            */

            /*
            // EXEMPLE INFOBIP:
            ApiClient client = ApiClient.forApiKey(ApiKey.from(smsApiKey))
                .withBaseUrl(BaseUrl.from(smsApiUrl))
                .build();
            
            SmsApi smsApi = new SmsApi(client);
            
            SmsDestination destination = new SmsDestination()
                .to(phoneNumber);
            
            SmsTextualMessage smsMessage = new SmsTextualMessage()
                .from(smsSender)
                .text(message)
                .destinations(List.of(destination));
            
            SmsAdvancedTextualRequest request = new SmsAdvancedTextualRequest()
                .messages(List.of(smsMessage));
            
            smsApi.sendSmsMessage(request);
            */

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi du SMS vers {}: {}", phoneNumber, e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi du SMS", e);
        }
    }

    /**
     * Valide le format du numéro de téléphone
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        // Validation basique pour les numéros tunisiens
        // Format attendu: +216XXXXXXXX ou 216XXXXXXXX ou 0XXXXXXXX
        return phoneNumber != null && 
               (phoneNumber.matches("^\\+216[0-9]{8}$") || 
                phoneNumber.matches("^216[0-9]{8}$") || 
                phoneNumber.matches("^0[0-9]{8}$"));
    }

    /**
     * Normalise le numéro de téléphone au format international
     */
    public String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }

        // Supprimer tous les espaces et caractères spéciaux
        phoneNumber = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");

        // Convertir au format international tunisien
        if (phoneNumber.startsWith("0")) {
            return "+216" + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith("216")) {
            return "+" + phoneNumber;
        } else if (!phoneNumber.startsWith("+")) {
            return "+216" + phoneNumber;
        }

        return phoneNumber;
    }
}