package tn.gov.ms.sidra.dto.structure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.gov.ms.sidra.entity.TypeStructure;

@Data
public class CreateStructureRequest {

    @NotBlank(message = "Le nom de la structure est obligatoire")
    private String nom;

    @NotNull(message = "Le type de structure est obligatoire")
    private TypeStructure type;

    @NotNull(message = "Le gouvernorat est obligatoire")
    private Long gouvernoratId;

    @NotBlank(message = "Le secteur est obligatoire")
    private String secteur;

    private Long ministereId;

    private String adresse;

    private String telephone;
}