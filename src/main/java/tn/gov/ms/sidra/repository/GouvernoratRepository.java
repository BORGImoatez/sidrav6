package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Gouvernorat;

import java.util.List;
import java.util.Optional;

@Repository
public interface GouvernoratRepository extends JpaRepository<Gouvernorat, Long> {

    Optional<Gouvernorat> findByNom(String nom);

    Optional<Gouvernorat> findByCodeIso3(String codeIso3);

    boolean existsByNom(String nom);

    boolean existsByCodeIso3(String codeIso3);

    List<Gouvernorat> findAllByOrderByNomAsc();
}