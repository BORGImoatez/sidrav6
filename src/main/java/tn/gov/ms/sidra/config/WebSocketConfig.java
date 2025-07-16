package tn.gov.ms.sidra.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Principal;
import java.util.Map;
import java.util.List;
import tn.gov.ms.sidra.security.JwtTokenProvider;
import tn.gov.ms.sidra.security.CustomUserDetailsService;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public WebSocketConfig(JwtTokenProvider jwtTokenProvider, CustomUserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setHandshakeHandler(new JwtHandshakeHandler())
                .addInterceptors(new JwtHandshakeInterceptor())
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(128 * 1024); // 128KB
        registration.setSendBufferSizeLimit(512 * 1024); // 512KB
        registration.setSendTimeLimit(2000000000); // 20 seconds
    }

    private class JwtHandshakeInterceptor implements HandshakeInterceptor {
         @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                       WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

            String token = extractTokenFromRequest(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {
                try {
                    String username = jwtTokenProvider.getUsernameFromToken(token);
                    Long userId = jwtTokenProvider.getUserIdFromToken(token);

                    // Load user details to get roles/authorities
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // 🔐 Vérifie si l'utilisateur a le rôle SUPER_ADMINISTRATEUR
                    boolean hasSuperAdminRole = userDetails.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (!hasSuperAdminRole) {
                        System.err.println("User " + username + " attempted WebSocket connection without required role.");
                        return false; // ❌ Rejette la connexion
                    }

                    // ✅ Authentifie si le rôle est correct
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    attributes.put("username", username);
                    attributes.put("userId", userId);
                    attributes.put("authenticated", true);

                    return true;
                } catch (Exception e) {
                    System.err.println("WebSocket authentication failed: " + e.getMessage());
                    return false;
                }
            }

            return false;
        }


        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Exception exception) {
            // Clear security context after handshake
            SecurityContextHolder.clearContext();
        }

        private String extractTokenFromRequest(ServerHttpRequest request) {
            // Try to get token from query parameter first
            String query = request.getURI().getQuery();
            if (query != null && query.contains("token=")) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("token=")) {
                        return param.substring(6); // Remove "token=" prefix
                    }
                }
            }

            // Try to get token from Authorization header
            if (request instanceof ServletServerHttpRequest) {
                HttpServletRequest servletRequest = ((ServletServerHttpRequest) request).getServletRequest();
                String authHeader = servletRequest.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    return authHeader.substring(7);
                }
            }

            return null;
        }
    }

    private class JwtHandshakeHandler extends DefaultHandshakeHandler {
        @Override
        protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
                                          Map<String, Object> attributes) {
            String username = (String) attributes.get("username");
            Boolean authenticated = (Boolean) attributes.get("authenticated");

            if (username != null && Boolean.TRUE.equals(authenticated)) {
                try {
                    // Load user details to get proper authorities
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                } catch (Exception e) {
                    System.err.println("Error loading user details in handshake: " + e.getMessage());
                }
            }
            return null;
        }
    }
}