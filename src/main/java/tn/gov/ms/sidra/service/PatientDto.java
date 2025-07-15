package tn.gov.ms.sidra.service;


import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PatientDto {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String genre;
    private String codePatient;
    private LocalDateTime dateCreation;
    private StructureDto structure;
    private List<FormulaireBrefDto> formulaires;

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }

    @Data
    public static class FormulaireBrefDto {
        private Long id;
        private String identifiantUnique;
        private LocalDate dateConsultation;
        private String motifConsultation;
        private String substancePrincipale;
        private String conduiteATenir;
    }
}