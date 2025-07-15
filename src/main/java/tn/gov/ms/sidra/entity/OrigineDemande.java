package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "origine_demandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrigineDemande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "lui_meme")
    private Boolean luiMeme;

    @Column(name = "famille")
    private Boolean famille;

    @Column(name = "amis")
    private Boolean amis;

    @Column(name = "cellule_ecoute")
    private Boolean celluleEcoute;

    @Column(name = "autre_centre")
    private Boolean autreCentre;

    @Column(name = "structure_sociale")
    private Boolean structureSociale;

    @Column(name = "structure_judiciaire")
    private Boolean structureJudiciaire;

    @Column(name = "juge_enfance")
    private Boolean jugeEnfance;

    @Column(name = "autre")
    private Boolean autre;

    @Column(name = "autre_precision")
    private String autrePrecision;
}