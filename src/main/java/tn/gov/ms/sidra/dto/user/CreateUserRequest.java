package tn.gov.ms.sidra.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import tn.gov.ms.sidra.entity.UserRole;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{8}$", message = "Le numéro de téléphone doit comporter exactement 8 chiffres")
    private String telephone;

    @NotNull(message = "Le rôle est obligatoire")
    private UserRole role;

    private Long structureId; // Obligatoire sauf pour SUPER_ADMIN

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;
}