package tn.gov.ms.sidra.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.gov.ms.sidra.entity.TypeStructure;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStructureInfoDto {
    private Long userId;
    private String secteur;
    private TypeStructure typeStructure;
    private String ministere;
    private Long structureId;
    private String structureNom;
    private Long gouvernoratId;
    private String gouvernoratNom;
    private boolean hasStructure;
}