package tn.gov.ms.sidra.dto.patientaccess;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PatientAccessRequestDto {
    @NotNull(message = "L'ID du patient est obligatoire")
    private Long patientId;
}