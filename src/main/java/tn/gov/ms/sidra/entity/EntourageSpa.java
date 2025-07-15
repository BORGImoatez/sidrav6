package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entourage_spas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntourageSpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "membres_famille")
    private Boolean membresFamille;

    @Column(name = "amis")
    private Boolean amis;

    @Column(name = "milieu_professionnel")
    private Boolean milieuProfessionnel;

    @Column(name = "milieu_sportif")
    private Boolean milieuSportif;

    @Column(name = "milieu_scolaire")
    private Boolean milieuScolaire;

    @Column(name = "autre")
    private Boolean autre;

    @Column(name = "autre_precision")
    private String autrePrecision;
}