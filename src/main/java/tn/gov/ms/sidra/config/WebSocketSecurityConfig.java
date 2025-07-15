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
                // Allow CONNECT messages to pass through for authentication
                .simpTypeMatchers(SimpMessageType.CONNECT).permitAll()
                // Allow DISCONNECT and HEARTBEAT for connection management
                .simpTypeMatchers(SimpMessageType.DISCONNECT, SimpMessageType.HEARTBEAT).permitAll()
                // Require authentication for all other message types
                .simpTypeMatchers(SimpMessageType.MESSAGE, SimpMessageType.SUBSCRIBE, SimpMessageType.UNSUBSCRIBE)
                .authenticated()
                // Any other message requires authentication
                .anyMessage().authenticated();
    }

    @Override
    protected boolean sameOriginDisabled() {
        // Disable CSRF for WebSockets
        return true;
    }
}