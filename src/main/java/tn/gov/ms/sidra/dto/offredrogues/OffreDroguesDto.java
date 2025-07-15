package tn.gov.ms.sidra.dto.offredrogues;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class OffreDroguesDto {

    private Long id;
    private LocalDate dateSaisie;
    private StructureDto structure;
    private UtilisateurDto utilisateur;

    // Quantités de drogues saisies
    private QuantitesDroguesDto quantitesDrogues;

    // Personnes inculpées
    private PersonnesInculpeesDto personnesInculpees;

    // Caractéristiques sociodémographiques
    private CaracteristiquesSociodemographiquesDto caracteristiquesSociodemographiques;

    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;

    @Data
    public static class StructureDto {
        private Long id;
        private String nom;
        private String type;
    }

    @Data
    public static class UtilisateurDto {
        private Long id;
        private String nom;
        private String prenom;
    }

    @Data
    public static class QuantitesDroguesDto {
        private Double cannabis;
        private Integer comprimesTableauA;
        private Integer ecstasyComprime;
        private Double ecstasyPoudre;
        private Integer subutex;
        private Double cocaine;
        private Double heroine;
    }

    @Data
    public static class PersonnesInculpeesDto {
        private PersonneInculpeeDto consommateur;
        private PersonneInculpeeDto vendeur;
        private PersonneInculpeeDto trafiquant;
    }

    @Data
    public static class PersonneInculpeeDto {
        private Integer nombre;
        private Double pourcentage;
    }

    @Data
    public static class CaracteristiquesSociodemographiquesDto {
        private GenreDto genre;
        private AgeDto age;
        private NationaliteDto nationalite;
        private EtatCivilDto etatCivil;
        private EtatProfessionnelDto etatProfessionnel;
        private NiveauSocioeconomiqueDto niveauSocioeconomique;
    }

    @Data
    public static class GenreDto {
        private PersonneInculpeeDto masculin;
        private PersonneInculpeeDto feminin;
    }

    @Data
    public static class AgeDto {
        private PersonneInculpeeDto moins12ans;
        private PersonneInculpeeDto moins18ans;
        private PersonneInculpeeDto entre18et40;
        private PersonneInculpeeDto plus40ans;
    }

    @Data
    public static class NationaliteDto {
        private PersonneInculpeeDto tunisienne;
        private PersonneInculpeeDto maghrebine;
        private PersonneInculpeeDto autres;
    }

    @Data
    public static class EtatCivilDto {
        private PersonneInculpeeDto celibataire;
        private PersonneInculpeeDto marie;
        private PersonneInculpeeDto divorce;
        private PersonneInculpeeDto veuf;
    }

    @Data
    public static class EtatProfessionnelDto {
        private PersonneInculpeeDto eleve;
        private PersonneInculpeeDto etudiant;
        private PersonneInculpeeDto ouvrier;
        private PersonneInculpeeDto fonctionnaire;
    }

    @Data
    public static class NiveauSocioeconomiqueDto {
        private PersonneInculpeeDto carteIndigent;
        private PersonneInculpeeDto carnetCnamPublique;
        private PersonneInculpeeDto carnetCnamFamille;
        private PersonneInculpeeDto carnetCnamRemboursement;
    }
}