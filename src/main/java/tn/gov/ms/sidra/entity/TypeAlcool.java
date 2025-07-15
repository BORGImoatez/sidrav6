package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "type_alcools")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypeAlcool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "formulaire_id")
    private Formulaire formulaire;

    @Column(name = "biere")
    private Boolean biere;

    @Column(name = "liqueurs")
    private Boolean liqueurs;

    @Column(name = "alcool_bruler")
    private Boolean alcoolBruler;

    @Column(name = "legmi")
    private Boolean legmi;

    @Column(name = "boukha")
    private Boolean boukha;
}