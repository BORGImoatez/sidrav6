package tn.gov.ms.sidra.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubstancePsychoactiveDto {
    private Boolean tabac;
    private Boolean alcool;
    private Boolean cannabis;
    private Boolean opium;
    private Boolean morphiniques;
    private String morphiniquesPrecision;
    private Boolean heroine;
    private Boolean cocaine;
    private Boolean hypnotiques;
    private String hypnotiquesPrecision;
    private String hypnotiquesAutrePrecision;
    private Boolean amphetamines;
    private Boolean ecstasy;
    private Boolean produitsInhaler;
    private Boolean pregabaline;
    private Boolean ketamines;
    private Boolean lsd;
    private Boolean autre;
    private String autrePrecision;
}