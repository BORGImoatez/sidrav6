package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Delegation;

import java.util.List;
import java.util.Optional;

@Repository
public interface DelegationRepository extends JpaRepository<Delegation, Long> {

    List<Delegation> findByGouvernoratIdOrderByNomAsc(Long gouvernoratId);

    Optional<Delegation> findByNomAndGouvernoratId(String nom, Long gouvernoratId);

    boolean existsByNomAndGouvernoratId(String nom, Long gouvernoratId);
}