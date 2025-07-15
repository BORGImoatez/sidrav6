package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @SendToUser("/queue/pong")
    public Map<String, Object> ping(Principal principal) {
        log.info("Ping reçu de l'utilisateur: {}", principal.getName());
        
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
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Map<String, Object> adminBroadcast(Map<String, Object> message, @AuthenticationPrincipal User user) {
        log.info("Message broadcast admin reçu de: {}", user.getEmail());
        
        Map<String, Object> response = new HashMap<>(message);
        response.put("sender", user.getEmail());
        response.put("timestamp", System.currentTimeMillis());
        
        return response;
    }
}