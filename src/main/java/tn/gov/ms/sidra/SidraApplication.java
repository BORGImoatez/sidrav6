package tn.gov.ms.sidra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SidraApplication {

    public static void main(String[] args) {
        SpringApplication.run(SidraApplication.class, args);
    }

}
