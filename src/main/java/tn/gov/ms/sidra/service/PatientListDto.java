package tn.gov.ms.sidra.service;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientListDto {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String genre;
    private String codePatient;
    private int nombreFormulaires;
    private LocalDate dernierFormulaire;
    private StructureDto structure;

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }
}