package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Ministere;

import java.util.List;
import java.util.Optional;

@Repository
public interface MinistereRepository extends JpaRepository<Ministere, Long> {

    List<Ministere> findByActifTrueOrderByNomAsc();

    Optional<Ministere> findByIdAndActifTrue(Long id);

    Optional<Ministere> findByNomAndActifTrue(String nom);

    boolean existsByNomAndActifTrue(String nom);

    boolean existsByNomAndActifTrueAndIdNot(String nom, Long id);
}