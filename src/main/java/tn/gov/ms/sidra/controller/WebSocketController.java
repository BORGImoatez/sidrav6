package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import tn.gov.ms.sidra.entity.User;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    /**
     * Endpoint pour tester la connexion WebSocket
     */
    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public Map<String, Object> ping() {
        log.info("Ping reçu d'un utilisateur");

        Map<String, Object> response = new HashMap<>();
        response.put("type", "PONG");
        response.put("message", "Connexion WebSocket fonctionnelle");
        response.put("timestamp", System.currentTimeMillis());

        return response;
    }

    /**
     * Endpoint pour envoyer un message à tous les administrateurs
     */
    @MessageMapping("/admin/broadcast")
    @SendTo("/topic/admin/notifications")
    public Map<String, Object> adminBroadcast(Map<String, Object> message) {
        log.info("Message broadcast admin reçu");

        Map<String, Object> response = new HashMap<>(message);
        response.put("sender", "system");
        response.put("timestamp", System.currentTimeMillis());

        return response;
    }
    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public String handleException(Exception e) {
        return "Erreur : " + e.getMessage();
    }
}