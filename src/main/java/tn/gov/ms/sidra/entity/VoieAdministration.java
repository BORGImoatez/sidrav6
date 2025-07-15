package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "voies_administration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoieAdministration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "injectee")
    private Boolean injectee;

    @Column(name = "fumee")
    private Boolean fumee;

    @Column(name = "ingeree")
    private Boolean ingeree;

    @Column(name = "sniffee")
    private Boolean sniffee;

    @Column(name = "inhalee")
    private Boolean inhalee;

    @Column(name = "autre")
    private Boolean autre;

    @Column(name = "autre_precision")
    private String autrePrecision;
}