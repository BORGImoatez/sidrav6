package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.dto.offredrogues.MonthlySubstancesDto;
import tn.gov.ms.sidra.entity.OffreDrogues;
import tn.gov.ms.sidra.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OffreDroguesRepository extends JpaRepository<OffreDrogues, Long> {

    @Query("SELECT o FROM OffreDrogues o LEFT JOIN FETCH o.structure s LEFT JOIN FETCH s.gouvernorat LEFT JOIN FETCH o.utilisateur WHERE o.id = :id")
    Optional<OffreDrogues> findByIdWithDetails(@Param("id") Long id);

    List<OffreDrogues> findByUtilisateurOrderByDateSaisieDesc(User utilisateur);

    List<OffreDrogues> findByStructureIdOrderByDateSaisieDesc(Long structureId);

    @Query("SELECT o FROM OffreDrogues o WHERE o.dateSaisie < :date AND o.id != :currentId ORDER BY o.dateSaisie DESC")
    List<OffreDrogues> findLastEntryBefore(@Param("date") LocalDate date, @Param("currentId") Long currentId);

    /**
     * Trouve toutes les saisies pour un mois et une année spécifiques
     */
    @Query("SELECT o FROM OffreDrogues o WHERE YEAR(o.dateSaisie) = :year AND MONTH(o.dateSaisie) = :month ORDER BY o.dateSaisie")
    List<OffreDrogues> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT o FROM OffreDrogues o LEFT JOIN FETCH o.structure s LEFT JOIN FETCH s.gouvernorat LEFT JOIN FETCH o.utilisateur ORDER BY o.dateSaisie DESC")
    List<OffreDrogues> findAllByOrderByDateSaisieDesc();

    Optional<OffreDrogues> findByIdAndUtilisateur(Long id, User utilisateur);

    @Query("SELECT o FROM OffreDrogues o WHERE o.dateSaisie BETWEEN :startDate AND :endDate ORDER BY o.dateSaisie DESC")
    List<OffreDrogues> findByDateSaisieBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT o FROM OffreDrogues o WHERE o.utilisateur = :utilisateur AND o.dateSaisie BETWEEN :startDate AND :endDate ORDER BY o.dateSaisie DESC")
    List<OffreDrogues> findByUtilisateurAndDateSaisieBetween(@Param("utilisateur") User utilisateur,
                                                             @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(o) FROM OffreDrogues o WHERE o.utilisateur = :utilisateur")
    long countByUtilisateur(@Param("utilisateur") User utilisateur);

    @Query("SELECT COUNT(o) FROM OffreDrogues o WHERE o.structure.id = :structureId")
    long countByStructureId(@Param("structureId") Long structureId);

    boolean existsByUtilisateurAndDateSaisie(User utilisateur, LocalDate dateSaisie);

    boolean existsByUtilisateurAndDateSaisieAndIdNot(User utilisateur, LocalDate dateSaisie, Long id);
}