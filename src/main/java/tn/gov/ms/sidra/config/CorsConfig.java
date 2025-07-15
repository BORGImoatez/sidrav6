package tn.gov.ms.sidra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Autoriser toutes les routes
                .allowedOrigins("localhost:4200") // Autoriser localhost:4200
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes autorisées
                .allowedHeaders("x-user-id", "Content-Type", "Authorization")  // Allow specific headers
                .allowCredentials(true); // Autoriser les cookies et credentials
    }
}