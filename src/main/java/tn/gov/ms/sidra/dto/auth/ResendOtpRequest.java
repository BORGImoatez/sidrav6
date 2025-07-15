package tn.gov.ms.sidra.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResendOtpRequest {

    @NotNull(message = "L'ID utilisateur est obligatoire")
    private Long userId;
}