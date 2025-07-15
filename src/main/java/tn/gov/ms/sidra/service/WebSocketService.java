package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Envoie une notification aux administrateurs
     */
    public void notifyAdmins(String type, Object data) {
        log.info("Envoi d'une notification WebSocket de type {} aux administrateurs", type);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", type);
        notification.put("data", data);
        notification.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend("/topic/admin/notifications", notification);
    }

    /**
     * Envoie une notification à un utilisateur spécifique
     */
    public void notifyUser(Long userId, String type, Object data) {
        log.info("Envoi d'une notification WebSocket de type {} à l'utilisateur {}", type, userId);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", type);
        notification.put("data", data);
        notification.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                notification
        );
    }
}