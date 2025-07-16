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
                // Autoriser la connexion initiale
                .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.DISCONNECT, SimpMessageType.HEARTBEAT).permitAll()

                // Autoriser les souscriptions aux topics publics
                .simpDestMatchers("/topic/**", "/queue/**").permitAll()

                // Protéger les destinations d'application (envoyées à @MessageMapping)
                .simpDestMatchers("/app/**").authenticated()

                // Protéger les destinations utilisateur
                .simpDestMatchers("/user/**", "/user/queue/**").authenticated()

                // Par défaut : tout le reste nécessite une authentification
                .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Disable CSRF for WebSockets
        return true;
    }

}