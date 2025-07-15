package tn.gov.ms.sidra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import tn.gov.ms.sidra.dto.user.UserDto;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "structure.id", target = "structureId")
    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToDto")
    UserDto toDto(User user);

    @Named("structureToDto")
    default UserDto.StructureDto structureToDto(Structure structure) {
        if (structure == null) {
            return null;
        }

        UserDto.StructureDto dto = new UserDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        dto.setSecteur(structure.getSecteur());
        dto.setGouvernorat(structure.getGouvernorat() != null ? structure.getGouvernorat().getNom() : null);
        return dto;
    }
}