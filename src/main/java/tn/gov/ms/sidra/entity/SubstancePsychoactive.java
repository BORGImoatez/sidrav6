package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "substances_psychoactives")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubstancePsychoactive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private TypeSubstance type;

    @ManyToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "tabac")
    private Boolean tabac;

    @Column(name = "alcool")
    private Boolean alcool;

    @Column(name = "cannabis")
    private Boolean cannabis;

    @Column(name = "opium")
    private Boolean opium;

    @Column(name = "morphiniques")
    private Boolean morphiniques;

    @Column(name = "morphiniques_precision")
    private String morphiniquesPrecision;

    @Column(name = "heroine")
    private Boolean heroine;

    @Column(name = "cocaine")
    private Boolean cocaine;

    @Column(name = "hypnotiques")
    private Boolean hypnotiques;

    @Column(name = "hypnotiques_precision")
    private String hypnotiquesPrecision;

    @Column(name = "hypnotiques_autre_precision")
    private String hypnotiquesAutrePrecision;

    @Column(name = "amphetamines")
    private Boolean amphetamines;

    @Column(name = "ecstasy")
    private Boolean ecstasy;

    @Column(name = "produits_inhaler")
    private Boolean produitsInhaler;

    @Column(name = "pregabaline")
    private Boolean pregabaline;

    @Column(name = "ketamines")
    private Boolean ketamines;

    @Column(name = "lsd")
    private Boolean lsd;

    @Column(name = "autre")
    private Boolean autre;

    @Column(name = "autre_precision")
    private String autrePrecision;

    @Column(name = "age_initiation")
    private Integer ageInitiation;

    public enum TypeSubstance {
        ENTOURAGE,
        ACTUELLE,
        INITIATION,
        PRINCIPALE
    }
}