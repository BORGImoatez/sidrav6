package tn.gov.ms.sidra.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotNull(message = "L'ID utilisateur est obligatoire")
    private Long userId;

    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
            message = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial")
    private String newPassword;
}