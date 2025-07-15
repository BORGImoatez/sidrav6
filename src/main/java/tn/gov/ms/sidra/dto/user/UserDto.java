package tn.gov.ms.sidra.dto.user;

import lombok.Data;
import tn.gov.ms.sidra.entity.UserRole;

import java.time.LocalDateTime;

@Data
public class UserDto {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private UserRole role;
    private Long structureId;
    private StructureDto structure;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime derniereConnexion;

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
        private String secteur;
        private String gouvernorat;
    }
}