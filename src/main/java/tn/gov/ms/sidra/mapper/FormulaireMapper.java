package tn.gov.ms.sidra.mapper;

import lombok.extern.slf4j.Slf4j;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import tn.gov.ms.sidra.entity.*;
import tn.gov.ms.sidra.service.CreateFormulaireRequest;
import tn.gov.ms.sidra.service.FormulaireDto;

import java.util.List;

@Mapper(componentModel = "spring")
 public interface FormulaireMapper {

    @Mapping(source = "patient", target = "patient", qualifiedByName = "patientToDto")
    @Mapping(source = "utilisateur", target = "utilisateur", qualifiedByName = "utilisateurToDto")
    @Mapping(source = "structure", target = "structure", qualifiedByName = "structureToDto")
    @Mapping(source = "cadreConsultation", target = "cadreConsultation", qualifiedByName = "cadreConsultationToDto")
    @Mapping(source = "origineDemande", target = "origineDemande", qualifiedByName = "origineDemandeToDto")
    @Mapping(source = "typeAlcool", target = "typeAlcool", qualifiedByName = "typeAlcoolToDto")
    @Mapping(source = "entourageSpa", target = "entourageSpa", qualifiedByName = "entourageSpaDtO")
    @Mapping(target = "typeSpaEntourage", expression = "java(mapTypeSpaEntourage(formulaire))")
    @Mapping(target = "droguesActuelles", expression = "java(mapDroguesActuelles(formulaire))")
    @Mapping(target = "substanceInitiation", expression = "java(mapSubstanceInitiation(formulaire))")
    @Mapping(target = "substancePrincipale", expression = "java(mapSubstancePrincipale(formulaire))")
    @Mapping(source = "voieAdministration", target = "voieAdministration", qualifiedByName = "voieAdministrationToDto")
    @Mapping(target = "testVih", expression = "java(mapTestVih(formulaire))")
    @Mapping(target = "testVhc", expression = "java(mapTestVhc(formulaire))")
    @Mapping(target = "testVhb", expression = "java(mapTestVhb(formulaire))")
    @Mapping(target = "testSyphilis", expression = "java(mapTestSyphilis(formulaire))")
    @Mapping(source = "tentativeSevrageDetails", target = "tentativeSevrageDetails", qualifiedByName = "tentativeSevrageToDto")
    FormulaireDto toDto(Formulaire formulaire);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "identifiantUnique", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "utilisateur", ignore = true)
    @Mapping(target = "structure", ignore = true)
    @Mapping(target = "dateCreation", ignore = true)
    @Mapping(target = "dateConsultation", ignore = true)

    @Mapping(target = "dateModification", ignore = true)
    @Mapping(target = "cadreConsultation", ignore = true)
    @Mapping(target = "origineDemande", ignore = true)
    @Mapping(target = "typeAlcool", ignore = true)
    @Mapping(target = "entourageSpa", ignore = true)
    @Mapping(target = "substancesPsychoactives", ignore = true)
    @Mapping(target = "voieAdministration", ignore = true)
    @Mapping(target = "testsDepistage", ignore = true)
    @Mapping(target = "tentativeSevrageDetails", ignore = true)
    Formulaire toEntity(CreateFormulaireRequest request);

    @Named("patientToDto")
    default FormulaireDto.PatientDto patientToDto(Patient patient) {
        if (patient == null) {
            return null;
        }

        FormulaireDto.PatientDto dto = new FormulaireDto.PatientDto();
        dto.setId(patient.getId());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setGenre(patient.getGenre());
        dto.setCodePatient(patient.getCodePatient());
        return dto;
    }

    @Named("utilisateurToDto")
    default FormulaireDto.UtilisateurDto utilisateurToDto(User utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        FormulaireDto.UtilisateurDto dto = new FormulaireDto.UtilisateurDto();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        return dto;
    }

    @Named("structureToDto")
    default FormulaireDto.StructureDto structureToDto(Structure structure) {
        if (structure == null) {
            return null;
        }

        FormulaireDto.StructureDto dto = new FormulaireDto.StructureDto();
        dto.setId(structure.getId());
        dto.setNom(structure.getNom());
        dto.setType(structure.getType().getLabel());
        return dto;
    }

    @Named("cadreConsultationToDto")
    default FormulaireDto.CadreConsultation cadreConsultationToDto(CadreConsultation cadreConsultation) {
        if (cadreConsultation == null) {
            System.out.println("cadreConsultation is null");
            return null;
        }

        FormulaireDto.CadreConsultation dto = new FormulaireDto.CadreConsultation();
        dto.setAddictologie(cadreConsultation.getAddictologie());
        dto.setAddictologieType(cadreConsultation.getAddictologieType());
        dto.setPsychiatrie(cadreConsultation.getPsychiatrie());
        dto.setPsychologique(cadreConsultation.getPsychologique());
        dto.setMedecineGenerale(cadreConsultation.getMedecineGenerale());
        dto.setNeurologique(cadreConsultation.getNeurologique());
        dto.setInfectieux(cadreConsultation.getInfectieux());
        dto.setEspaceAmisJeunes(cadreConsultation.getEspaceAmisJeunes());
        dto.setEchangeMateriel(cadreConsultation.getEchangeMateriel());
        dto.setRehabilitation(cadreConsultation.getRehabilitation());
        dto.setUrgenceMedicale(cadreConsultation.getUrgenceMedicale());
        dto.setUrgenceChirurgicale(cadreConsultation.getUrgenceChirurgicale());
        dto.setDepistage(cadreConsultation.getDepistage());
        dto.setAutre(cadreConsultation.getAutre());
        dto.setAutrePrecision(cadreConsultation.getAutrePrecision());
        return dto;
    }

    @Named("origineDemandeToDto")
    default FormulaireDto.OrigineDemandeDto origineDemandeToDto(OrigineDemande origineDemande) {
        if (origineDemande == null) {
            return null;
        }

        FormulaireDto.OrigineDemandeDto dto = new FormulaireDto.OrigineDemandeDto();
        dto.setLuiMeme(origineDemande.getLuiMeme());
        dto.setFamille(origineDemande.getFamille());
        dto.setAmis(origineDemande.getAmis());
        dto.setCelluleEcoute(origineDemande.getCelluleEcoute());
        dto.setAutreCentre(origineDemande.getAutreCentre());
        dto.setStructureSociale(origineDemande.getStructureSociale());
        dto.setStructureJudiciaire(origineDemande.getStructureJudiciaire());
        dto.setJugeEnfance(origineDemande.getJugeEnfance());
        dto.setAutre(origineDemande.getAutre());
        dto.setAutrePrecision(origineDemande.getAutrePrecision());
        return dto;
    }

    @Named("typeAlcoolToDto")
    default FormulaireDto.TypeAlcoolDto typeAlcoolToDto(TypeAlcool typeAlcool) {
        if (typeAlcool == null) {
            return null;
        }

        FormulaireDto.TypeAlcoolDto dto = new FormulaireDto.TypeAlcoolDto();
        dto.setBiere(typeAlcool.getBiere());
        dto.setLiqueurs(typeAlcool.getLiqueurs());
        dto.setAlcoolBruler(typeAlcool.getAlcoolBruler());
        dto.setLegmi(typeAlcool.getLegmi());
        dto.setBoukha(typeAlcool.getBoukha());
        return dto;
    }

    @Named("entourageSpaDtO")
    default FormulaireDto.EntourageSpaDtO entourageSpaDtO(EntourageSpa entourageSpa) {
        if (entourageSpa == null) {
            return null;
        }

        FormulaireDto.EntourageSpaDtO dto = new FormulaireDto.EntourageSpaDtO();
        dto.setMembresFamille(entourageSpa.getMembresFamille());
        dto.setAmis(entourageSpa.getAmis());
        dto.setMilieuProfessionnel(entourageSpa.getMilieuProfessionnel());
        dto.setMilieuSportif(entourageSpa.getMilieuSportif());
        dto.setMilieuScolaire(entourageSpa.getMilieuScolaire());
        dto.setAutre(entourageSpa.getAutre());
        dto.setAutrePrecision(entourageSpa.getAutrePrecision());
        return dto;
    }

    default FormulaireDto.SubstancePsychoactiveDto mapTypeSpaEntourage(Formulaire formulaire) {
        return mapSubstancePsychoactive(formulaire.getSubstancesPsychoactives(), SubstancePsychoactive.TypeSubstance.ENTOURAGE);
    }

    default FormulaireDto.SubstancePsychoactiveDto mapDroguesActuelles(Formulaire formulaire) {
        return mapSubstancePsychoactive(formulaire.getSubstancesPsychoactives(), SubstancePsychoactive.TypeSubstance.ACTUELLE);
    }

    default FormulaireDto.SubstancePsychoactiveDto mapSubstanceInitiation(Formulaire formulaire) {
        return mapSubstancePsychoactive(formulaire.getSubstancesPsychoactives(), SubstancePsychoactive.TypeSubstance.INITIATION);
    }

    default FormulaireDto.SubstancePsychoactiveDto mapSubstancePrincipale(Formulaire formulaire) {
        return mapSubstancePsychoactive(formulaire.getSubstancesPsychoactives(), SubstancePsychoactive.TypeSubstance.PRINCIPALE);
    }

    default FormulaireDto.SubstancePsychoactiveDto mapSubstancePsychoactive(List<SubstancePsychoactive> substances, SubstancePsychoactive.TypeSubstance type) {
        if (substances == null || substances.isEmpty()) {
            return null;
        }

        return substances.stream()
                .filter(s -> s.getType() == type)
                .findFirst()
                .map(this::substancePsychoactiveToDto)
                .orElse(null);
    }

    default FormulaireDto.SubstancePsychoactiveDto substancePsychoactiveToDto(SubstancePsychoactive substance) {
        if (substance == null) {
            return null;
        }

        FormulaireDto.SubstancePsychoactiveDto dto = new FormulaireDto.SubstancePsychoactiveDto();
        dto.setTabac(substance.getTabac());
        dto.setAlcool(substance.getAlcool());
        dto.setCannabis(substance.getCannabis());
        dto.setOpium(substance.getOpium());
        dto.setMorphiniques(substance.getMorphiniques());
        dto.setMorphiniquesPrecision(substance.getMorphiniquesPrecision());
        dto.setHeroine(substance.getHeroine());
        dto.setCocaine(substance.getCocaine());
        dto.setHypnotiques(substance.getHypnotiques());
        dto.setHypnotiquesPrecision(substance.getHypnotiquesPrecision());
        dto.setHypnotiquesAutrePrecision(substance.getHypnotiquesAutrePrecision());
        dto.setAmphetamines(substance.getAmphetamines());
        dto.setEcstasy(substance.getEcstasy());
        dto.setProduitsInhaler(substance.getProduitsInhaler());
        dto.setPregabaline(substance.getPregabaline());
        dto.setKetamines(substance.getKetamines());
        dto.setLsd(substance.getLsd());
        dto.setAutre(substance.getAutre());
        dto.setAutrePrecision(substance.getAutrePrecision());
        return dto;
    }

    @Named("voieAdministrationToDto")
    default FormulaireDto.VoieAdministrationDto voieAdministrationToDto(VoieAdministration voieAdministration) {
        if (voieAdministration == null) {
            return null;
        }

        FormulaireDto.VoieAdministrationDto dto = new FormulaireDto.VoieAdministrationDto();
        dto.setInjectee(voieAdministration.getInjectee());
        dto.setFumee(voieAdministration.getFumee());
        dto.setIngeree(voieAdministration.getIngeree());
        dto.setSniffee(voieAdministration.getSniffee());
        dto.setInhalee(voieAdministration.getInhalee());
        dto.setAutre(voieAdministration.getAutre());
        dto.setAutrePrecision(voieAdministration.getAutrePrecision());
        return dto;
    }

    default FormulaireDto.TestDepistageDto mapTestVih(Formulaire formulaire) {
        return mapTestDepistage(formulaire.getTestsDepistage(), TestDepistage.TypeTest.VIH);
    }

    default FormulaireDto.TestDepistageDto mapTestVhc(Formulaire formulaire) {
        return mapTestDepistage(formulaire.getTestsDepistage(), TestDepistage.TypeTest.VHC);
    }

    default FormulaireDto.TestDepistageDto mapTestVhb(Formulaire formulaire) {
        return mapTestDepistage(formulaire.getTestsDepistage(), TestDepistage.TypeTest.VHB);
    }

    default FormulaireDto.TestDepistageDto mapTestSyphilis(Formulaire formulaire) {
        return mapTestDepistage(formulaire.getTestsDepistage(), TestDepistage.TypeTest.SYPHILIS);
    }

    default FormulaireDto.TestDepistageDto mapTestDepistage(List<TestDepistage> tests, TestDepistage.TypeTest type) {
        if (tests == null || tests.isEmpty()) {
            return null;
        }

        return tests.stream()
                .filter(t -> t.getTypeTest() == type)
                .findFirst()
                .map(this::testDepistageToDto)
                .orElse(null);
    }

    default FormulaireDto.TestDepistageDto testDepistageToDto(TestDepistage test) {
        if (test == null) {
            return null;
        }

        FormulaireDto.TestDepistageDto dto = new FormulaireDto.TestDepistageDto();
        dto.setRealise(test.getRealise());
        dto.setPeriode(test.getPeriode());
        return dto;
    }

    @Named("tentativeSevrageToDto")
    default FormulaireDto.TentativeSevrageDto tentativeSevrageToDto(TentativeSevrage tentativeSevrage) {
        if (tentativeSevrage == null) {
            return null;
        }

        FormulaireDto.TentativeSevrageDto dto = new FormulaireDto.TentativeSevrageDto();
        dto.setToutSeul(tentativeSevrage.getToutSeul());
        dto.setSoutienFamille(tentativeSevrage.getSoutienFamille());
        dto.setSoutienAmi(tentativeSevrage.getSoutienAmi());
        dto.setSoutienScolaire(tentativeSevrage.getSoutienScolaire());
        dto.setStructureSante(tentativeSevrage.getStructureSante());
        dto.setStructureSantePrecision(tentativeSevrage.getStructureSantePrecision());
        return dto;
    }
}