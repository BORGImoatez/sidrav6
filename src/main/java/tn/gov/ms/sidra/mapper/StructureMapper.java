package tn.gov.ms.sidra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import tn.gov.ms.sidra.dto.structure.CreateStructureRequest;
import tn.gov.ms.sidra.dto.structure.StructureDto;
import tn.gov.ms.sidra.dto.structure.UpdateStructureRequest;
import tn.gov.ms.sidra.entity.Gouvernorat;
import tn.gov.ms.sidra.entity.Ministere;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.dto.structure.CreateStructureRequest;
import tn.gov.ms.sidra.dto.structure.StructureDto;
import tn.gov.ms.sidra.dto.structure.UpdateStructureRequest;
import tn.gov.ms.sidra.entity.Gouvernorat;
import tn.gov.ms.sidra.entity.Structure;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface StructureMapper {

    @Mapping(source = "gouvernorat.id", target = "gouvernoratId")
    @Mapping(source = "gouvernorat", target = "gouvernorat", qualifiedByName = "gouvernoratToDto")
    @Mapping(source = "ministere.id", target = "ministereId")
    @Mapping(source = "ministere", target = "ministere", qualifiedByName = "ministereToDto")
    StructureDto toDto(Structure structure);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "gouvernorat", ignore = true)
    @Mapping(target = "ministere", ignore = true)
    @Mapping(target = "utilisateurs", ignore = true)
    @Mapping(target = "actif", constant = "true")
    @Mapping(target = "dateCreation", ignore = true)
    Structure toEntity(CreateStructureRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "gouvernorat", ignore = true)
    @Mapping(target = "ministere", ignore = true)
    @Mapping(target = "utilisateurs", ignore = true)
    @Mapping(target = "actif", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    void updateEntity(UpdateStructureRequest request, @MappingTarget Structure structure);

    @Named("gouvernoratToDto")
    default StructureDto.GouvernoratDto gouvernoratToDto(Gouvernorat gouvernorat) {
        if (gouvernorat == null) {
            return null;
        }

        StructureDto.GouvernoratDto dto = new StructureDto.GouvernoratDto();
        dto.setId(gouvernorat.getId());
        dto.setNom(gouvernorat.getNom());
        dto.setCodeIso3(gouvernorat.getCodeIso3());
        return dto;
    }

    @Named("ministereToDto")
    default StructureDto.MinistereDto ministereToDto(Ministere ministere) {
        if (ministere == null) {
            return null;
        }

        StructureDto.MinistereDto dto = new StructureDto.MinistereDto();
        dto.setId(ministere.getId());
        dto.setNom(ministere.getNom());
        dto.setCode(ministere.getCode());
        return dto;
    }
}