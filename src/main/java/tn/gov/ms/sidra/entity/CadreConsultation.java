package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cadre_consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CadreConsultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "addictologie")
    private Boolean addictologie;

    @Column(name = "addictologie_type")
    private Boolean addictologieType;

    @Column(name = "psychiatrie")
    private Boolean psychiatrie;

    @Column(name = "psychologique")
    private Boolean psychologique;

    @Column(name = "medecine_generale")
    private Boolean medecineGenerale;

    @Column(name = "neurologique")
    private Boolean neurologique;

    @Column(name = "infectieux")
    private Boolean infectieux;

    @Column(name = "espace_amis_jeunes")
    private Boolean espaceAmisJeunes;

    @Column(name = "echange_materiel")
    private Boolean echangeMateriel;

    @Column(name = "rehabilitation")
    private Boolean rehabilitation;

    @Column(name = "urgence_medicale")
    private Boolean urgenceMedicale;

    @Column(name = "urgence_chirurgicale")
    private Boolean urgenceChirurgicale;

    @Column(name = "depistage")
    private Boolean depistage;

    @Column(name = "autre")
    private Boolean autre;

    @Column(name = "autre_precision")
    private String autrePrecision;
}