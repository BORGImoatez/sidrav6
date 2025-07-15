package tn.gov.ms.sidra.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.gov.ms.sidra.dto.user.UserDto;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDto user;
    private LocalDateTime blockedUntil;
    private Integer remainingAttempts;
}