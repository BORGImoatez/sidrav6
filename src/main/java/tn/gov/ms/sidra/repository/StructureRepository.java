package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Structure;
import tn.gov.ms.sidra.entity.TypeStructure;

import java.util.List;
import java.util.Optional;

@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {

    List<Structure> findByActifTrueOrderByNomAsc();

    Page<Structure> findByActifTrueOrderByNomAsc(Pageable pageable);

    Optional<Structure> findByIdAndActifTrue(Long id);

    List<Structure> findByNomContainingIgnoreCaseAndActifTrueOrderByNomAsc(String nom);

    List<Structure> findByTypeAndActifTrueOrderByNomAsc(TypeStructure type);

    List<Structure> findByGouvernoratIdAndActifTrueOrderByNomAsc(Long gouvernoratId);

    boolean existsByNomAndActifTrue(String nom);

    boolean existsByNomAndActifTrueAndIdNot(String nom, Long id);

    List<Structure> findByType(TypeStructure type);

    List<Structure> findByNomContainingIgnoreCase(String nom);

    @Query("SELECT COUNT(s) FROM Structure s WHERE s.actif = true")
    long countActiveStructures();

    @Query("SELECT COUNT(s) FROM Structure s WHERE s.type = :type")
    long countStructuresByType(@Param("type") TypeStructure type);

    @Query("SELECT s FROM Structure s LEFT JOIN FETCH s.gouvernorat WHERE s.id = :id")
    Optional<Structure> findByIdWithGouvernorat(@Param("id") Long id);
}