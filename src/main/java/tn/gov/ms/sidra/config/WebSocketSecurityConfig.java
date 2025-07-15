package tn.gov.ms.sidra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

import org.springframework.messaging.simp.SimpMessageType;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
            // Permettre toutes les connexions et messages pour simplifier
            .nullDestMatcher().permitAll()
            .simpTypeMatchers(SimpMessageType.CONNECT, 
                             SimpMessageType.HEARTBEAT,
                             SimpMessageType.UNSUBSCRIBE,
                             SimpMessageType.DISCONNECT,
                             SimpMessageType.MESSAGE,
                             SimpMessageType.SUBSCRIBE).permitAll()
            .anyMessage().permitAll();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Désactiver la vérification CSRF pour les WebSockets
        return true;
    }
}