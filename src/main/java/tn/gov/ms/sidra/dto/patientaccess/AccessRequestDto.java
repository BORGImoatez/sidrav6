package tn.gov.ms.sidra.dto.patientaccess;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccessRequestDto {
    private Long id;
    private PatientDto patient;
    private UserDto requestor;
    private UserDto owner;
    private String status;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
    private LocalDateTime dateExpiration;

    @Data
    public static class PatientDto {
        private Long id;
        private String codePatient;
        private String genre;
        private String dateNaissance;
        private StructureDto structure;
    }

    @Data
    public static class UserDto {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private StructureDto structure;
    }

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }
}