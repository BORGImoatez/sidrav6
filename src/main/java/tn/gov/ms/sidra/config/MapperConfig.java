package tn.gov.ms.sidra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import tn.gov.ms.sidra.mapper.PatientMapper;

@Configuration
@ComponentScan(basePackages = "tn.gov.ms.sidra.mapper")
public class MapperConfig {
    // Nous utilisons l'implémentation manuelle UserMapperImpl qui est annotée avec @Component

}