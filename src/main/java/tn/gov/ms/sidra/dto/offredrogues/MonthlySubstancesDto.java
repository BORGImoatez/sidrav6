package tn.gov.ms.sidra.dto.offredrogues;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySubstancesDto {
    private int day;
    private Double cannabis;
    private Integer comprimesTableauA;
    private Integer ecstasyComprime;
    private Double ecstasyPoudre;
    private Integer subutex;
    private Double cocaine;
    private Double heroine;
}