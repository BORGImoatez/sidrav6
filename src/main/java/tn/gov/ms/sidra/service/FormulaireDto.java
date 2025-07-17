package tn.gov.ms.sidra.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormulaireDto {
    private Long id;
    private String identifiantUnique;
    private String dateConsultation;
    private PatientDto patient;
    private UtilisateurDto utilisateur;
    private StructureDto structure;

    // Données du formulaire (partie 1)
    private String secteur;
    private String ongPrecision;
    private String ministere;
    private String gouvernoratStructure;
    private String nationalite;
    private String residence;
    private String gouvernoratResidence;
    private String delegationResidence;
    private String paysResidence;

    // Cadre de consultation (stocké en JSON)
    private CadreConsultation cadreConsultation;

    // Origine de la demande (stocké en JSON)
    private OrigineDemandeDto origineDemande;

    private String causeCirconstance;
    private Boolean consultationAnterieure;
    private String dateConsultationAnterieure;
    private String motifConsultationAnterieure;
    private String motifConsultationAnterieurePrecision;


    private String causeRecidive;
    private String causeEchecSevrage;
    private String situationFamiliale;
    private String situationFamilialeAutre;
    private String logement30Jours;
    private String logement30JoursAutre;
    private String natureLogement;
    private String profession;
    private String niveauScolaire;
    private Boolean activiteSportive;
    private String activiteSportiveFrequence;
    private String activiteSportiveType;
    private Boolean espacesLoisirs;
    private Boolean dopage;

    // Partie 2: Consommation tabac & alcool
    private String consommationTabac;
    private Integer agePremiereConsommationTabac;
    private Boolean consommationTabac30Jours;
    private String frequenceTabac30Jours;
    private Integer nombreCigarettesJour;
    private Double nombrePaquetsAnnee;
    private Integer ageArretTabac;
    private String soinsSevrageTabac;
    private Boolean sevrageAssiste;
    private Boolean consommationAlcool;
    private Integer agePremiereConsommationAlcool;
    private Boolean consommationAlcool30Jours;
    private String frequenceAlcool30Jours;
    private Integer quantiteAlcoolPrise;

    // Type d'alcool (stocké en JSON)
    private TypeAlcoolDto typeAlcool;

    // Partie 3: Consommation de substances psychoactives
    private Boolean consommationSpaEntourage;

    // Entourage SPA (stocké en JSON)
    private EntourageSpaDtO entourageSpa;

    // Types de SPA dans l'entourage (stocké en JSON)
    private SubstancePsychoactiveDto typeSpaEntourage;

    private Boolean consommationSpaPersonnelle;

    // Drogues actuelles (stocké en JSON)
    private SubstancePsychoactiveDto droguesActuelles;

    // Substance d'initiation (stocké en JSON)
    private SubstancePsychoactiveDto substanceInitiation;

    private Integer ageInitiationPremiere;

    // Substance principale (stocké en JSON)
    private SubstancePsychoactiveDto substancePrincipale;

    private Integer ageInitiationPrincipale;
    private Boolean troublesAlimentaires;
    private Boolean addictionJeux;
    private Boolean addictionEcrans;
    private Boolean comportementsSexuels;

    // Partie 4: Comportements liés à la consommation et tests de dépistage
    // Voie d'administration (stocké en JSON)
    private VoieAdministrationDto voieAdministration;

    private String frequenceSubstancePrincipale;
    private String partageSeringues;

    // Tests de dépistage (stockés en JSON)
    private TestDepistageDto testVih;
    private TestDepistageDto testVhc;
    private TestDepistageDto testVhb;
    private TestDepistageDto testSyphilis;

    private Boolean accompagnementSevrage;
    private String accompagnementSevrageNonRaison;
    private Boolean tentativeSevrage;

    // Détails tentative sevrage (stocké en JSON)
    private TentativeSevrageDto tentativeSevrageDetails;

    // Partie 5: Comorbidités
    private Boolean comorbiditePsychiatriquePersonnelle;
    private String comorbiditePsychiatriquePersonnellePrecision;
    private Boolean comorbiditeSomatiquePersonnelle;
    private String comorbiditeSomatiquePersonnellePrecision;
    private Boolean comorbiditePsychiatriquePartenaire;
    private String comorbiditePsychiatriquePartenairePrecision;
    private Boolean comorbiditeSomatiquePartenaire;
    private String comorbiditeSomatiquePartenairePrecision;
    private Integer nombreCondamnations;
    private Integer dureeDetentionJours;
    private Integer dureeDetentionMois;
    private Integer dureeDetentionAnnees;

    // Partie 6: Décès induit par les SPA dans l'entourage
    private Integer nombreDecesSpaDansEntourage;
    private String causesDecesSpaDansEntourage;

    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    @Data
    public static class PatientDto {
        private Long id;
        private String nom;
        private String prenom;
        private LocalDate dateNaissance;
        private String genre;
        private String codePatient;
    }

    @Data
    public static class UtilisateurDto {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
    }

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }

    // DTOs pour les entités liées
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CadreConsultation {
        private Boolean addictologie;
        private Boolean addictologieType;
        private Boolean psychiatrie;
        private Boolean psychologique;
        private Boolean medecineGenerale;
        private Boolean neurologique;
        private Boolean infectieux;
        private Boolean espaceAmisJeunes;
        private Boolean echangeMateriel;
        private Boolean rehabilitation;
        private Boolean urgenceMedicale;
        private Boolean urgenceChirurgicale;
        private Boolean depistage;
        private Boolean autre;
        private String autrePrecision;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrigineDemandeDto {
        private Boolean luiMeme;
        private Boolean famille;
        private Boolean amis;
        private Boolean celluleEcoute;
        private Boolean autreCentre;
        private Boolean structureSociale;
        private Boolean structureJudiciaire;
        private Boolean jugeEnfance;
        private Boolean autre;
        private String autrePrecision;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeAlcoolDto {
        private Boolean biere;
        private Boolean liqueurs;
        private Boolean alcoolBruler;
        private Boolean legmi;
        private Boolean boukha;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EntourageSpaDtO {
        private Boolean membresFamille;
        private Boolean amis;
        private Boolean milieuProfessionnel;
        private Boolean milieuSportif;
        private Boolean milieuScolaire;
        private Boolean autre;
        private String autrePrecision;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubstancePsychoactiveDto {
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoieAdministrationDto {
        private Boolean injectee;
        private Boolean fumee;
        private Boolean ingeree;
        private Boolean sniffee;
        private Boolean inhalee;
        private Boolean autre;
        private String autrePrecision;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestDepistageDto {
        private Boolean realise;
        private String periode;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TentativeSevrageDto {
        private Boolean toutSeul;
        private Boolean soutienFamille;
        private Boolean soutienAmi;
        private Boolean soutienScolaire;
        private Boolean structureSante;
        private String structureSantePrecision;
    }
}