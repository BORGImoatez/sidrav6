package tn.gov.ms.sidra.entity;

 import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "formulaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Formulaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "L'identifiant unique est obligatoire")
    @Column(name = "identifiant_unique", nullable = false, unique = true)
    private String identifiantUnique;

   // @NotNull(message = "La date de consultation est obligatoire")
    @Column(name = "date_consultation", nullable = true)
    private String dateConsultation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"formulaires"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    @JsonIgnoreProperties({"structure", "authorities", "password", "username", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "structure_id", nullable = false)
    @JsonIgnoreProperties({"utilisateurs"})
    private Structure structure;

    // Données du formulaire (partie 1)
    @Column(name = "secteur", nullable = false)
    private String secteur;

    @Column(name = "ong_precision")
    private String ongPrecision;

    @Column(name = "ministere")
    private String ministere;

    @Column(name = "gouvernorat_structure", nullable = false)
    private String gouvernoratStructure;

    @Column(name = "nationalite", nullable = false)
    private String nationalite;

    @Column(name = "residence", nullable = false)
    private String residence;

    @Column(name = "gouvernorat_residence")
    private String gouvernoratResidence;

    @Column(name = "delegation_residence")
    private String delegationResidence;

    @Column(name = "pays_residence")
    private String paysResidence;

    // Relations avec les entités dédiées
    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private CadreConsultation cadreConsultation;

    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private OrigineDemande origineDemande;

    @Column(name = "cause_circonstance")
    private String causeCirconstance;

    @Column(name = "consultation_anterieure")
    private Boolean consultationAnterieure;

    @Column(name = "date_consultation_anterieure")
    private String dateConsultationAnterieure;

    @Column(name = "motif_consultation_anterieure")
    private String motifConsultationAnterieure;
    @Column(name = "motifConsultationAnterieurePrecision")
    private  String motifConsultationAnterieurePrecision;


    @Column(name = "cause_recidive")
    private String causeRecidive;

    @Column(name = "cause_echec_sevrage")
    private String causeEchecSevrage;

    @Column(name = "situation_familiale")
    private String situationFamiliale;

    @Column(name = "situation_familiale_autre")
    private String situationFamilialeAutre;

    @Column(name = "logement_30_jours")
    private String logement30Jours;

    @Column(name = "logement_30_jours_autre")
    private String logement30JoursAutre;

    @Column(name = "nature_logement")
    private String natureLogement;

    @Column(name = "profession")
    private String profession;

    @Column(name = "niveau_scolaire")
    private String niveauScolaire;

    @Column(name = "activite_sportive")
    private Boolean activiteSportive;

    @Column(name = "activite_sportive_frequence")
    private String activiteSportiveFrequence;

    @Column(name = "activite_sportive_type")
    private String activiteSportiveType;

    @Column(name = "espaces_loisirs")
    private Boolean espacesLoisirs;

    @Column(name = "dopage")
    private Boolean dopage;

    // Partie 2: Consommation tabac & alcool
    @Column(name = "consommation_tabac")
    private String consommationTabac;

    @Column(name = "age_premiere_consommation_tabac")
    private Integer agePremiereConsommationTabac;

    @Column(name = "consommation_tabac_30_jours")
    private Boolean consommationTabac30Jours;

    @Column(name = "frequence_tabac_30_jours")
    private String frequenceTabac30Jours;

    @Column(name = "nombre_cigarettes_jour")
    private Integer nombreCigarettesJour;

    @Column(name = "nombre_paquets_annee")
    private Double nombrePaquetsAnnee;

    @Column(name = "age_arret_tabac")
    private Integer ageArretTabac;

    @Column(name = "soins_sevrage_tabac")
    private String soinsSevrageTabac;

    @Column(name = "sevrage_assiste")
    private Boolean sevrageAssiste;

    @Column(name = "consommation_alcool")
    private Boolean consommationAlcool;

    @Column(name = "age_premiere_consommation_alcool")
    private Integer agePremiereConsommationAlcool;

    @Column(name = "consommation_alcool_30_jours")
    private Boolean consommationAlcool30Jours;

    @Column(name = "frequence_alcool_30_jours")
    private String frequenceAlcool30Jours;

    @Column(name = "quantite_alcool_prise")
    private Integer quantiteAlcoolPrise;

    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private TypeAlcool typeAlcool;

    // Partie 3: Consommation de substances psychoactives
    @Column(name = "consommation_spa_entourage")
    private Boolean consommationSpaEntourage;

    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private EntourageSpa entourageSpa;

    @OneToMany(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubstancePsychoactive> substancesPsychoactives = new ArrayList<>();

    @Column(name = "consommation_spa_personnelle")
    private Boolean consommationSpaPersonnelle;

    @Column(name = "age_initiation_premiere")
    private Integer ageInitiationPremiere;

    @Column(name = "age_initiation_principale")
    private Integer ageInitiationPrincipale;

    @Column(name = "troubles_alimentaires")
    private Boolean troublesAlimentaires;

    @Column(name = "addiction_jeux")
    private Boolean addictionJeux;

    @Column(name = "addiction_ecrans")
    private Boolean addictionEcrans;

    @Column(name = "comportements_sexuels")
    private Boolean comportementsSexuels;

    // Partie 4: Comportements liés à la consommation et tests de dépistage
    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private VoieAdministration voieAdministration;

    @Column(name = "frequence_substance_principale")
    private String frequenceSubstancePrincipale;

    @Column(name = "partage_seringues")
    private String partageSeringues;

    @OneToMany(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestDepistage> testsDepistage = new ArrayList<>();

    @Column(name = "accompagnement_sevrage")
    private Boolean accompagnementSevrage;

    @Column(name = "accompagnement_sevrage_non_raison")
    private String accompagnementSevrageNonRaison;

    @Column(name = "tentative_sevrage")
    private Boolean tentativeSevrage;

    @OneToOne(mappedBy = "formulaire", cascade = CascadeType.ALL, orphanRemoval = true)
    private TentativeSevrage tentativeSevrageDetails;

    // Partie 5: Comorbidités
    @Column(name = "comorbidite_psychiatrique_personnelle")
    private Boolean comorbiditePsychiatriquePersonnelle;

    @Column(name = "comorbidite_psychiatrique_personnelle_precision")
    private String comorbiditePsychiatriquePersonnellePrecision;

    @Column(name = "comorbidite_somatique_personnelle")
    private Boolean comorbiditeSomatiquePersonnelle;

    @Column(name = "comorbidite_somatique_personnelle_precision")
    private String comorbiditeSomatiquePersonnellePrecision;

    @Column(name = "comorbidite_psychiatrique_partenaire")
    private Boolean comorbiditePsychiatriquePartenaire;

    @Column(name = "comorbidite_psychiatrique_partenaire_precision")
    private String comorbiditePsychiatriquePartenairePrecision;

    @Column(name = "comorbidite_somatique_partenaire")
    private Boolean comorbiditeSomatiquePartenaire;

    @Column(name = "comorbidite_somatique_partenaire_precision")
    private String comorbiditeSomatiquePartenairePrecision;

    @Column(name = "nombre_condamnations")
    private Integer nombreCondamnations;

    @Column(name = "duree_detention_jours")
    private Integer dureeDetentionJours;

    @Column(name = "duree_detention_mois")
    private Integer dureeDetentionMois;

    @Column(name = "duree_detention_annees")
    private Integer dureeDetentionAnnees;

    // Partie 6: Décès induit par les SPA dans l'entourage
    @Column(name = "nombre_deces_spa_entourage")
    private Integer nombreDecesSpaDansEntourage;

    @Column(name = "causes_deces_spa_entourage")
    private String causesDecesSpaDansEntourage;

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

    // Méthodes utilitaires pour gérer les relations
    public void addSubstancePsychoactive(SubstancePsychoactive substance) {
        substancesPsychoactives.add(substance);
        substance.setFormulaire(this);
    }

    public void removeSubstancePsychoactive(SubstancePsychoactive substance) {
        substancesPsychoactives.remove(substance);
        substance.setFormulaire(null);
    }

    public void addTestDepistage(TestDepistage test) {
        testsDepistage.add(test);
        test.setFormulaire(this);
    }

    public void removeTestDepistage(TestDepistage test) {
        testsDepistage.remove(test);
        test.setFormulaire(null);
    }

    // Méthodes pour récupérer des substances spécifiques
    public SubstancePsychoactive getTypeSpaEntourage() {
        return substancesPsychoactives.stream()
                .filter(s -> s.getType() == SubstancePsychoactive.TypeSubstance.ENTOURAGE)
                .findFirst()
                .orElse(null);
    }

    public SubstancePsychoactive getDroguesActuelles() {
        return substancesPsychoactives.stream()
                .filter(s -> s.getType() == SubstancePsychoactive.TypeSubstance.ACTUELLE)
                .findFirst()
                .orElse(null);
    }

    public SubstancePsychoactive getSubstanceInitiation() {
        return substancesPsychoactives.stream()
                .filter(s -> s.getType() == SubstancePsychoactive.TypeSubstance.INITIATION)
                .findFirst()
                .orElse(null);
    }

    public SubstancePsychoactive getSubstancePrincipale() {
        return substancesPsychoactives.stream()
                .filter(s -> s.getType() == SubstancePsychoactive.TypeSubstance.PRINCIPALE)
                .findFirst()
                .orElse(null);
    }

    // Méthodes pour récupérer des tests spécifiques
    public TestDepistage getTestVih() {
        return testsDepistage.stream()
                .filter(t -> t.getTypeTest() == TestDepistage.TypeTest.VIH)
                .findFirst()
                .orElse(null);
    }

    public TestDepistage getTestVhc() {
        return testsDepistage.stream()
                .filter(t -> t.getTypeTest() == TestDepistage.TypeTest.VHC)
                .findFirst()
                .orElse(null);
    }

    public TestDepistage getTestVhb() {
        return testsDepistage.stream()
                .filter(t -> t.getTypeTest() == TestDepistage.TypeTest.VHB)
                .findFirst()
                .orElse(null);
    }

    public TestDepistage getTestSyphilis() {
        return testsDepistage.stream()
                .filter(t -> t.getTypeTest() == TestDepistage.TypeTest.SYPHILIS)
                .findFirst()
                .orElse(null);
    }
}