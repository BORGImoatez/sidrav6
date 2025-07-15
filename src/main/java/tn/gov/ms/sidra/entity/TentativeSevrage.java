package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tentatives_sevrage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TentativeSevrage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "tout_seul")
    private Boolean toutSeul;

    @Column(name = "soutien_famille")
    private Boolean soutienFamille;

    @Column(name = "soutien_ami")
    private Boolean soutienAmi;

    @Column(name = "soutien_scolaire")
    private Boolean soutienScolaire;

    @Column(name = "structure_sante")
    private Boolean structureSante;

    @Column(name = "structure_sante_precision")
    private String structureSantePrecision;
}