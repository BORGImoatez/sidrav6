package tn.gov.ms.sidra.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private boolean success;
    private String message;
    private boolean requiresOtp;
    private Long userId;
    private LocalDateTime blockedUntil;
    private Integer remainingAttempts;
}