package tn.gov.ms.sidra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import tn.gov.ms.sidra.entity.Formulaire;
import tn.gov.ms.sidra.entity.Patient;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.service.PatientDto;
import tn.gov.ms.sidra.service.PatientListDto;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface PatientMapper {

    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToDto")
    @Mapping(source = "formulaires", target = "formulaires", qualifiedByName = "formulairesToBrefDto")
    PatientDto toDto(Patient patient);

    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToListDto")
    @Mapping(source = "formulaires", target = "nombreFormulaires", qualifiedByName = "countFormulaires")
    @Mapping(source = "formulaires", target = "dernierFormulaire", qualifiedByName = "getLastFormulaireDate")
    PatientListDto toListDto(Patient patient);

    @Named("structureToDto")
    default PatientDto.StructureDto structureToDto(Structure structure) {
        if (structure == null) {
            return null;
        }
        
        PatientDto.StructureDto dto = new PatientDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        return dto;
    }

    @Named("structureToListDto")
    default PatientListDto.StructureDto structureToListDto(Structure structure) {
        if (structure == null) {
            return null;
        }
        
        PatientListDto.StructureDto dto = new PatientListDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        return dto;
    }

    @Named("formulairesToBrefDto")
    default List<PatientDto.FormulaireBrefDto> formulairesToBrefDto(List<Formulaire> formulaires) {
        if (formulaires == null) {
            return null;
        }
        
        return formulaires.stream()
                .map(formulaire -> {
                    PatientDto.FormulaireBrefDto dto = new PatientDto.FormulaireBrefDto();
                    dto.setId(formulaire.getId());
                    dto.setIdentifiantUnique(formulaire.getIdentifiantUnique());
                    dto.setDateConsultation(formulaire.getDateConsultation());
                    dto.setMotifConsultation(formulaire.getMotifConsultationAnterieure());
                    
                    // Extraire la substance principale (à adapter selon votre structure JSON)
                    dto.setSubstancePrincipale("À extraire du JSON");
                    
                    // Conduite à tenir (à adapter selon vos besoins)
                    dto.setConduiteATenir("À déterminer");
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Named("countFormulaires")
    default int countFormulaires(List<Formulaire> formulaires) {
        return formulaires != null ? formulaires.size() : 0;
    }

    @Named("getLastFormulaireDate")
    default LocalDate getLastFormulaireDate(List<Formulaire> formulaires) {
        if (formulaires == null || formulaires.isEmpty()) {
            return null;
        }
        
        return formulaires.stream()
                .map(Formulaire::getDateConsultation)
                .max(Comparator.naturalOrder())
                .orElse(null);
    }
}