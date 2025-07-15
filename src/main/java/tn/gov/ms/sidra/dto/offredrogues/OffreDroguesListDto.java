package tn.gov.ms.sidra.dto.offredrogues;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OffreDroguesListDto {

    private Long id;
    private LocalDate dateSaisie;
    private StructureDto structure;
    private UtilisateurDto utilisateur;
    private LocalDateTime dateCreation;

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }

    @Data
    public static class UtilisateurDto {
        private Long id;
        private String nom;
        private String prenom;
    }
}