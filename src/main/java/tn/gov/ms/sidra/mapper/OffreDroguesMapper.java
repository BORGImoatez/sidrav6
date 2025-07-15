package tn.gov.ms.sidra.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import tn.gov.ms.sidra.dto.offredrogues.CreateOffreDroguesRequest;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesDto;
import tn.gov.ms.sidra.dto.offredrogues.OffreDroguesListDto;
import tn.gov.ms.sidra.dto.offredrogues.UpdateOffreDroguesRequest;
import tn.gov.ms.sidra.entity.OffreDrogues;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface OffreDroguesMapper {

    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToDto")
    @Mapping(source = "utilisateur", target = "utilisateur", qualifiedByName = "utilisateurToDto")
    @Mapping(target = "quantitesDrogues", expression = "java(mapQuantitesDrogues(offreDrogues))")
    @Mapping(target = "personnesInculpees", expression = "java(mapPersonnesInculpees(offreDrogues))")
    @Mapping(target = "caracteristiquesSociodemographiques", expression = "java(mapCaracteristiquesSociodemographiques(offreDrogues))")
    OffreDroguesDto toDto(OffreDrogues offreDrogues);

    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToListDto")
    @Mapping(source = "utilisateur", target = "utilisateur", qualifiedByName = "utilisateurToListDto")
    OffreDroguesListDto toListDto(OffreDrogues offreDrogues);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "structure", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    OffreDrogues toEntity(CreateOffreDroguesRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "structure", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateModification", ignore = true)
    void updateEntity(UpdateOffreDroguesRequest request, @MappingTarget OffreDrogues offreDrogues);

    @Named("structureToDto")
    default OffreDroguesDto.StructureDto structureToDto(Structure structure) {
        if (structure == null) return null;
        
        OffreDroguesDto.StructureDto dto = new OffreDroguesDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        return dto;
    }

    @Named("utilisateurToDto")
    default OffreDroguesDto.UtilisateurDto utilisateurToDto(User utilisateur) {
        if (utilisateur == null) return null;
        
        OffreDroguesDto.UtilisateurDto dto = new OffreDroguesDto.UtilisateurDto();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        return dto;
    }

    @Named("structureToListDto")
    default OffreDroguesListDto.StructureDto structureToListDto(Structure structure) {
        if (structure == null) return null;
        
        OffreDroguesListDto.StructureDto dto = new OffreDroguesListDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        return dto;
    }

    @Named("utilisateurToListDto")
    default OffreDroguesListDto.UtilisateurDto utilisateurToListDto(User utilisateur) {
        if (utilisateur == null) return null;
        
        OffreDroguesListDto.UtilisateurDto dto = new OffreDroguesListDto.UtilisateurDto();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        return dto;
    }

    // Méthodes de mapping personnalisées
    default OffreDroguesDto.QuantitesDroguesDto mapQuantitesDrogues(OffreDrogues offreDrogues) {
        OffreDroguesDto.QuantitesDroguesDto dto = new OffreDroguesDto.QuantitesDroguesDto();
        dto.setCannabis(offreDrogues.getCannabis());
        dto.setComprimesTableauA(offreDrogues.getComprimesTableauA());
        dto.setEcstasyComprime(offreDrogues.getEcstasyComprime());
        dto.setEcstasyPoudre(offreDrogues.getEcstasyPoudre());
        dto.setSubutex(offreDrogues.getSubutex());
        dto.setCocaine(offreDrogues.getCocaine());
        dto.setHeroine(offreDrogues.getHeroine());
        return dto;
    }

    default OffreDroguesDto.PersonnesInculpeesDto mapPersonnesInculpees(OffreDrogues offreDrogues) {
        OffreDroguesDto.PersonnesInculpeesDto dto = new OffreDroguesDto.PersonnesInculpeesDto();
        
        OffreDroguesDto.PersonneInculpeeDto consommateur = new OffreDroguesDto.PersonneInculpeeDto();
        consommateur.setNombre(offreDrogues.getConsommateurNombre());
        consommateur.setPourcentage(offreDrogues.getConsommateurPourcentage());
        dto.setConsommateur(consommateur);
        
        OffreDroguesDto.PersonneInculpeeDto vendeur = new OffreDroguesDto.PersonneInculpeeDto();
        vendeur.setNombre(offreDrogues.getVendeurNombre());
        vendeur.setPourcentage(offreDrogues.getVendeurPourcentage());
        dto.setVendeur(vendeur);
        
        OffreDroguesDto.PersonneInculpeeDto trafiquant = new OffreDroguesDto.PersonneInculpeeDto();
        trafiquant.setNombre(offreDrogues.getTrafiquantNombre());
        trafiquant.setPourcentage(offreDrogues.getTrafiquantPourcentage());
        dto.setTrafiquant(trafiquant);
        
        return dto;
    }

    default OffreDroguesDto.CaracteristiquesSociodemographiquesDto mapCaracteristiquesSociodemographiques(OffreDrogues offreDrogues) {
        OffreDroguesDto.CaracteristiquesSociodemographiquesDto dto = new OffreDroguesDto.CaracteristiquesSociodemographiquesDto();
        
        // Genre
        OffreDroguesDto.GenreDto genre = new OffreDroguesDto.GenreDto();
        OffreDroguesDto.PersonneInculpeeDto masculin = new OffreDroguesDto.PersonneInculpeeDto();
        masculin.setNombre(offreDrogues.getMasculinNombre());
        masculin.setPourcentage(offreDrogues.getMasculinPourcentage());
        genre.setMasculin(masculin);
        
        OffreDroguesDto.PersonneInculpeeDto feminin = new OffreDroguesDto.PersonneInculpeeDto();
        feminin.setNombre(offreDrogues.getFemininNombre());
        feminin.setPourcentage(offreDrogues.getFemininPourcentage());
        genre.setFeminin(feminin);
        dto.setGenre(genre);
        
        // Age
        OffreDroguesDto.AgeDto age = new OffreDroguesDto.AgeDto();
        OffreDroguesDto.PersonneInculpeeDto moins12ans = new OffreDroguesDto.PersonneInculpeeDto();
        moins12ans.setNombre(offreDrogues.getMoins12ansNombre());
        moins12ans.setPourcentage(offreDrogues.getMoins12ansPourcentage());
        age.setMoins12ans(moins12ans);
        
        OffreDroguesDto.PersonneInculpeeDto moins18ans = new OffreDroguesDto.PersonneInculpeeDto();
        moins18ans.setNombre(offreDrogues.getMoins18ansNombre());
        moins18ans.setPourcentage(offreDrogues.getMoins18ansPourcentage());
        age.setMoins18ans(moins18ans);
        
        OffreDroguesDto.PersonneInculpeeDto entre18et40 = new OffreDroguesDto.PersonneInculpeeDto();
        entre18et40.setNombre(offreDrogues.getEntre18et40Nombre());
        entre18et40.setPourcentage(offreDrogues.getEntre18et40Pourcentage());
        age.setEntre18et40(entre18et40);
        
        OffreDroguesDto.PersonneInculpeeDto plus40ans = new OffreDroguesDto.PersonneInculpeeDto();
        plus40ans.setNombre(offreDrogues.getPlus40ansNombre());
        plus40ans.setPourcentage(offreDrogues.getPlus40ansPourcentage());
        age.setPlus40ans(plus40ans);
        dto.setAge(age);
        
        // Nationalité
        OffreDroguesDto.NationaliteDto nationalite = new OffreDroguesDto.NationaliteDto();
        OffreDroguesDto.PersonneInculpeeDto tunisienne = new OffreDroguesDto.PersonneInculpeeDto();
        tunisienne.setNombre(offreDrogues.getTunisienneNombre());
        tunisienne.setPourcentage(offreDrogues.getTunisiennePourcentage());
        nationalite.setTunisienne(tunisienne);
        
        OffreDroguesDto.PersonneInculpeeDto maghrebine = new OffreDroguesDto.PersonneInculpeeDto();
        maghrebine.setNombre(offreDrogues.getMaghrebineNombre());
        maghrebine.setPourcentage(offreDrogues.getMaghrebinePourcentage());
        nationalite.setMaghrebine(maghrebine);
        
        OffreDroguesDto.PersonneInculpeeDto autres = new OffreDroguesDto.PersonneInculpeeDto();
        autres.setNombre(offreDrogues.getAutresNationaliteNombre());
        autres.setPourcentage(offreDrogues.getAutresNationalitePourcentage());
        nationalite.setAutres(autres);
        dto.setNationalite(nationalite);
        
        // État civil
        OffreDroguesDto.EtatCivilDto etatCivil = new OffreDroguesDto.EtatCivilDto();
        OffreDroguesDto.PersonneInculpeeDto celibataire = new OffreDroguesDto.PersonneInculpeeDto();
        celibataire.setNombre(offreDrogues.getCelibataireNombre());
        celibataire.setPourcentage(offreDrogues.getCelibatairePourcentage());
        etatCivil.setCelibataire(celibataire);
        
        OffreDroguesDto.PersonneInculpeeDto marie = new OffreDroguesDto.PersonneInculpeeDto();
        marie.setNombre(offreDrogues.getMarieNombre());
        marie.setPourcentage(offreDrogues.getMariePourcentage());
        etatCivil.setMarie(marie);
        
        OffreDroguesDto.PersonneInculpeeDto divorce = new OffreDroguesDto.PersonneInculpeeDto();
        divorce.setNombre(offreDrogues.getDivorceNombre());
        divorce.setPourcentage(offreDrogues.getDivorcePourcentage());
        etatCivil.setDivorce(divorce);
        
        OffreDroguesDto.PersonneInculpeeDto veuf = new OffreDroguesDto.PersonneInculpeeDto();
        veuf.setNombre(offreDrogues.getVeufNombre());
        veuf.setPourcentage(offreDrogues.getVeufPourcentage());
        etatCivil.setVeuf(veuf);
        dto.setEtatCivil(etatCivil);
        
        // État professionnel
        OffreDroguesDto.EtatProfessionnelDto etatProfessionnel = new OffreDroguesDto.EtatProfessionnelDto();
        OffreDroguesDto.PersonneInculpeeDto eleve = new OffreDroguesDto.PersonneInculpeeDto();
        eleve.setNombre(offreDrogues.getEleveNombre());
        eleve.setPourcentage(offreDrogues.getElevePourcentage());
        etatProfessionnel.setEleve(eleve);
        
        OffreDroguesDto.PersonneInculpeeDto etudiant = new OffreDroguesDto.PersonneInculpeeDto();
        etudiant.setNombre(offreDrogues.getEtudiantNombre());
        etudiant.setPourcentage(offreDrogues.getEtudiantPourcentage());
        etatProfessionnel.setEtudiant(etudiant);
        
        OffreDroguesDto.PersonneInculpeeDto ouvrier = new OffreDroguesDto.PersonneInculpeeDto();
        ouvrier.setNombre(offreDrogues.getOuvrierNombre());
        ouvrier.setPourcentage(offreDrogues.getOuvrierPourcentage());
        etatProfessionnel.setOuvrier(ouvrier);
        
        OffreDroguesDto.PersonneInculpeeDto fonctionnaire = new OffreDroguesDto.PersonneInculpeeDto();
        fonctionnaire.setNombre(offreDrogues.getFonctionnaireNombre());
        fonctionnaire.setPourcentage(offreDrogues.getFonctionnairePourcentage());
        etatProfessionnel.setFonctionnaire(fonctionnaire);
        dto.setEtatProfessionnel(etatProfessionnel);
        
        // Niveau socioéconomique
        OffreDroguesDto.NiveauSocioeconomiqueDto niveauSocioeconomique = new OffreDroguesDto.NiveauSocioeconomiqueDto();
        OffreDroguesDto.PersonneInculpeeDto carteIndigent = new OffreDroguesDto.PersonneInculpeeDto();
        carteIndigent.setNombre(offreDrogues.getCarteIndigentNombre());
        carteIndigent.setPourcentage(offreDrogues.getCarteIndigentPourcentage());
        niveauSocioeconomique.setCarteIndigent(carteIndigent);
        
        OffreDroguesDto.PersonneInculpeeDto carnetCnamPublique = new OffreDroguesDto.PersonneInculpeeDto();
        carnetCnamPublique.setNombre(offreDrogues.getCarnetCnamPubliqueNombre());
        carnetCnamPublique.setPourcentage(offreDrogues.getCarnetCnamPubliquePourcentage());
        niveauSocioeconomique.setCarnetCnamPublique(carnetCnamPublique);
        
        OffreDroguesDto.PersonneInculpeeDto carnetCnamFamille = new OffreDroguesDto.PersonneInculpeeDto();
        carnetCnamFamille.setNombre(offreDrogues.getCarnetCnamFamilleNombre());
        carnetCnamFamille.setPourcentage(offreDrogues.getCarnetCnamFamillePourcentage());
        niveauSocioeconomique.setCarnetCnamFamille(carnetCnamFamille);
        
        OffreDroguesDto.PersonneInculpeeDto carnetCnamRemboursement = new OffreDroguesDto.PersonneInculpeeDto();
        carnetCnamRemboursement.setNombre(offreDrogues.getCarnetCnamRemboursementNombre());
        carnetCnamRemboursement.setPourcentage(offreDrogues.getCarnetCnamRemboursementPourcentage());
        niveauSocioeconomique.setCarnetCnamRemboursement(carnetCnamRemboursement);
        dto.setNiveauSocioeconomique(niveauSocioeconomique);
        
        return dto;
    }
}