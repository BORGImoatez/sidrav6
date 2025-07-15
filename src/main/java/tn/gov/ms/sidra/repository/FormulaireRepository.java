package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Formulaire;
import tn.gov.ms.sidra.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FormulaireRepository extends JpaRepository<Formulaire, Long> {

    Optional<Formulaire> findByIdentifiantUnique(String identifiantUnique);

    @Query("SELECT f FROM Formulaire f WHERE f.utilisateur = :utilisateur ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByUtilisateur(@Param("utilisateur") User utilisateur);

    @Query("SELECT f FROM Formulaire f WHERE f.structure.id = :structureId ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByStructureId(@Param("structureId") Long structureId);

    @Query("SELECT f FROM Formulaire f WHERE f.patient.id = :patientId ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT f FROM Formulaire f WHERE f.dateConsultation BETWEEN :debut AND :fin ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByDateConsultationBetween(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);

    @Query("SELECT f FROM Formulaire f WHERE f.structure.id = :structureId AND f.dateConsultation BETWEEN :debut AND :fin ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByStructureIdAndDateConsultationBetween(
            @Param("structureId") Long structureId,
            @Param("debut") LocalDate debut,
            @Param("fin") LocalDate fin);

    @Query("SELECT f FROM Formulaire f WHERE f.utilisateur = :utilisateur AND f.dateConsultation BETWEEN :debut AND :fin ORDER BY f.dateConsultation DESC")
    List<Formulaire> findByUtilisateurAndDateConsultationBetween(
            @Param("utilisateur") User utilisateur,
            @Param("debut") LocalDate debut,
            @Param("fin") LocalDate fin);

    @Query("SELECT MAX(CAST(SUBSTRING(f.identifiantUnique, LOCATE('-', f.identifiantUnique) + 5) AS int)) FROM Formulaire f WHERE f.identifiantUnique LIKE CONCAT('F-', :annee, '%')")
    Optional<Integer> findMaxSequenceNumberForYear(@Param("annee") String annee);
}