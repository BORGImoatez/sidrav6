package tn.gov.ms.sidra.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offre_drogues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OffreDrogues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date de saisie est obligatoire")
    @Column(name = "date_saisie", nullable = false)
    private LocalDate dateSaisie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "structure_id")
    @JsonIgnoreProperties({"utilisateurs", "gouvernorat"})
    private Structure structure;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    @JsonIgnoreProperties({"structure", "authorities", "password", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User utilisateur;

    // Quantités de drogues saisies
    @Column(name = "cannabis")
    private Double cannabis;

    @Column(name = "comprimes_tableau_a")
    private Integer comprimesTableauA;

    @Column(name = "ecstasy_comprime")
    private Integer ecstasyComprime;

    @Column(name = "ecstasy_poudre")
    private Double ecstasyPoudre;

    @Column(name = "subutex")
    private Integer subutex;

    @Column(name = "cocaine")
    private Double cocaine;

    @Column(name = "heroine")
    private Double heroine;

    // Personnes inculpées - Consommateur
    @Column(name = "consommateur_nombre")
    private Integer consommateurNombre;

    @Column(name = "consommateur_pourcentage")
    private Double consommateurPourcentage;

    // Personnes inculpées - Vendeur
    @Column(name = "vendeur_nombre")
    private Integer vendeurNombre;

    @Column(name = "vendeur_pourcentage")
    private Double vendeurPourcentage;

    // Personnes inculpées - Trafiquant
    @Column(name = "trafiquant_nombre")
    private Integer trafiquantNombre;

    @Column(name = "trafiquant_pourcentage")
    private Double trafiquantPourcentage;

    // Caractéristiques sociodémographiques - Genre
    @Column(name = "masculin_nombre")
    private Integer masculinNombre;

    @Column(name = "masculin_pourcentage")
    private Double masculinPourcentage;

    @Column(name = "feminin_nombre")
    private Integer femininNombre;

    @Column(name = "feminin_pourcentage")
    private Double femininPourcentage;

    // Caractéristiques sociodémographiques - Age
    @Column(name = "moins12ans_nombre")
    private Integer moins12ansNombre;

    @Column(name = "moins12ans_pourcentage")
    private Double moins12ansPourcentage;

    @Column(name = "moins18ans_nombre")
    private Integer moins18ansNombre;

    @Column(name = "moins18ans_pourcentage")
    private Double moins18ansPourcentage;

    @Column(name = "entre18et40_nombre")
    private Integer entre18et40Nombre;

    @Column(name = "entre18et40_pourcentage")
    private Double entre18et40Pourcentage;

    @Column(name = "plus40ans_nombre")
    private Integer plus40ansNombre;

    @Column(name = "plus40ans_pourcentage")
    private Double plus40ansPourcentage;

    // Caractéristiques sociodémographiques - Nationalité
    @Column(name = "tunisienne_nombre")
    private Integer tunisienneNombre;

    @Column(name = "tunisienne_pourcentage")
    private Double tunisiennePourcentage;

    @Column(name = "maghrebine_nombre")
    private Integer maghrebineNombre;

    @Column(name = "maghrebine_pourcentage")
    private Double maghrebinePourcentage;

    @Column(name = "autres_nationalite_nombre")
    private Integer autresNationaliteNombre;

    @Column(name = "autres_nationalite_pourcentage")
    private Double autresNationalitePourcentage;

    // Caractéristiques sociodémographiques - État civil
    @Column(name = "celibataire_nombre")
    private Integer celibataireNombre;

    @Column(name = "celibataire_pourcentage")
    private Double celibatairePourcentage;

    @Column(name = "marie_nombre")
    private Integer marieNombre;

    @Column(name = "marie_pourcentage")
    private Double mariePourcentage;

    @Column(name = "divorce_nombre")
    private Integer divorceNombre;

    @Column(name = "divorce_pourcentage")
    private Double divorcePourcentage;

    @Column(name = "veuf_nombre")
    private Integer veufNombre;

    @Column(name = "veuf_pourcentage")
    private Double veufPourcentage;

    // Caractéristiques sociodémographiques - État professionnel
    @Column(name = "eleve_nombre")
    private Integer eleveNombre;

    @Column(name = "eleve_pourcentage")
    private Double elevePourcentage;

    @Column(name = "etudiant_nombre")
    private Integer etudiantNombre;

    @Column(name = "etudiant_pourcentage")
    private Double etudiantPourcentage;

    @Column(name = "ouvrier_nombre")
    private Integer ouvrierNombre;

    @Column(name = "ouvrier_pourcentage")
    private Double ouvrierPourcentage;

    @Column(name = "fonctionnaire_nombre")
    private Integer fonctionnaireNombre;

    @Column(name = "fonctionnaire_pourcentage")
    private Double fonctionnairePourcentage;

    // Caractéristiques sociodémographiques - Niveau socioéconomique
    @Column(name = "carte_indigent_nombre")
    private Integer carteIndigentNombre;

    @Column(name = "carte_indigent_pourcentage")
    private Double carteIndigentPourcentage;

    @Column(name = "carnet_cnam_publique_nombre")
    private Integer carnetCnamPubliqueNombre;

    @Column(name = "carnet_cnam_publique_pourcentage")
    private Double carnetCnamPubliquePourcentage;

    @Column(name = "carnet_cnam_famille_nombre")
    private Integer carnetCnamFamilleNombre;

    @Column(name = "carnet_cnam_famille_pourcentage")
    private Double carnetCnamFamillePourcentage;

    @Column(name = "carnet_cnam_remboursement_nombre")
    private Integer carnetCnamRemboursementNombre;

    @Column(name = "carnet_cnam_remboursement_pourcentage")
    private Double carnetCnamRemboursementPourcentage;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}