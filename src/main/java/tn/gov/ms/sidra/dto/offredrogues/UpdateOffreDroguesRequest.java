package tn.gov.ms.sidra.dto.offredrogues;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateOffreDroguesRequest {

    @NotNull(message = "La date de saisie est obligatoire")
    private LocalDate dateSaisie;

    // Quantités de drogues saisies
    private Double cannabis;
    private Integer comprimesTableauA;
    private Integer ecstasyComprime;
    private Double ecstasyPoudre;
    private Integer subutex;
    private Double cocaine;
    private Double heroine;

    // Personnes inculpées - Consommateur
    private Integer consommateurNombre;
    private Double consommateurPourcentage;

    // Personnes inculpées - Vendeur
    private Integer vendeurNombre;
    private Double vendeurPourcentage;

    // Personnes inculpées - Trafiquant
    private Integer trafiquantNombre;
    private Double trafiquantPourcentage;

    // Caractéristiques sociodémographiques - Genre
    private Integer masculinNombre;
    private Double masculinPourcentage;
    private Integer femininNombre;
    private Double femininPourcentage;

    // Caractéristiques sociodémographiques - Age
    private Integer moins12ansNombre;
    private Double moins12ansPourcentage;
    private Integer moins18ansNombre;
    private Double moins18ansPourcentage;
    private Integer entre18et40Nombre;
    private Double entre18et40Pourcentage;
    private Integer plus40ansNombre;
    private Double plus40ansPourcentage;

    // Caractéristiques sociodémographiques - Nationalité
    private Integer tunisienneNombre;
    private Double tunisiennePourcentage;
    private Integer maghrebineNombre;
    private Double maghrebinePourcentage;
    private Integer autresNationaliteNombre;
    private Double autresNationalitePourcentage;

    // Caractéristiques sociodémographiques - État civil
    private Integer celibataireNombre;
    private Double celibatairePourcentage;
    private Integer marieNombre;
    private Double mariePourcentage;
    private Integer divorceNombre;
    private Double divorcePourcentage;
    private Integer veufNombre;
    private Double veufPourcentage;

    // Caractéristiques sociodémographiques - État professionnel
    private Integer eleveNombre;
    private Double elevePourcentage;
    private Integer etudiantNombre;
    private Double etudiantPourcentage;
    private Integer ouvrierNombre;
    private Double ouvrierPourcentage;
    private Integer fonctionnaireNombre;
    private Double fonctionnairePourcentage;

    // Caractéristiques sociodémographiques - Niveau socioéconomique
    private Integer carteIndigentNombre;
    private Double carteIndigentPourcentage;
    private Integer carnetCnamPubliqueNombre;
    private Double carnetCnamPubliquePourcentage;
    private Integer carnetCnamFamilleNombre;
    private Double carnetCnamFamillePourcentage;
    private Integer carnetCnamRemboursementNombre;
    private Double carnetCnamRemboursementPourcentage;
}