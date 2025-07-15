package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Patient;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByCodePatient(String codePatient);

    @Query("SELECT p FROM Patient p WHERE p.nom LIKE %:search% OR p.prenom LIKE %:search% OR p.codePatient LIKE %:search%")
    List<Patient> searchPatients(@Param("search") String search);

    @Query("SELECT p FROM Patient p WHERE p.structure.id = :structureId")
    List<Patient> findByStructureId(@Param("structureId") Long structureId);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.structure.id = :structureId")
    long countByStructureId(@Param("structureId") Long structureId);

    @Query("SELECT MAX(CAST(SUBSTRING(p.codePatient, LOCATE('-', p.codePatient) + 5) AS int)) FROM Patient p WHERE p.codePatient LIKE CONCAT('P-', :anneeNaissance, '%')")
    Optional<Integer> findMaxSequenceNumberForYear(@Param("anneeNaissance") String anneeNaissance);

    boolean existsByNomAndPrenomAndDateNaissance(String nom, String prenom, java.time.LocalDate dateNaissance);
}