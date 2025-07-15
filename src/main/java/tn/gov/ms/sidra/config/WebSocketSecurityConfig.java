package tn.gov.ms.sidra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            // Permettre à tous les utilisateurs de se connecter
            .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.HEARTBEAT, SimpMessageType.UNSUBSCRIBE, SimpMessageType.DISCONNECT).permitAll()
            // Permettre aux utilisateurs authentifiés d'envoyer des messages
            .simpDestMatchers("/app/**").authenticated()
            // Permettre aux utilisateurs authentifiés de s'abonner à leurs propres files d'attente
            .simpSubscribeDestMatchers("/user/queue/**").authenticated()
            // Permettre aux administrateurs de s'abonner aux notifications admin
            .simpSubscribeDestMatchers("/topic/admin/**").hasAnyRole("SUPER_ADMIN", "ADMIN_STRUCTURE")
            // Permettre à tous les utilisateurs authentifiés de s'abonner aux notifications générales
            .simpSubscribeDestMatchers("/topic/public/**").authenticated()
            // Refuser tout le reste
            .anyMessage().denyAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Désactiver la vérification CSRF pour les WebSockets
        return true;
    }
}