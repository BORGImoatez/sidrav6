package tn.gov.ms.sidra.dto.structure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.gov.ms.sidra.entity.TypeStructure;

import java.time.LocalDateTime;

@Data
public class StructureDto {

    private Long id;

    @NotBlank(message = "Le nom de la structure est obligatoire")
    private String nom;

    @NotNull(message = "Le type de structure est obligatoire")
    private TypeStructure type;

    @NotNull(message = "Le gouvernorat est obligatoire")
    private Long gouvernoratId;

    private GouvernoratDto gouvernorat;

    @NotBlank(message = "Le secteur est obligatoire")
    private String secteur;

    private Long ministereId;

    private MinistereDto ministere;

    private String adresse;

    private String telephone;

    private Boolean actif;

    private LocalDateTime dateCreation;

    @Data
    public static class GouvernoratDto {
        private Long id;
        private String nom;
        private String codeIso3;
    }

    @Data
    public static class MinistereDto {
        private Long id;
        private String nom;
        private String code;
    }
}