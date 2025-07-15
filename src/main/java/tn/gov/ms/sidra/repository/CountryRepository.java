package tn.gov.ms.sidra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.ms.sidra.entity.Country;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {

    Optional<Country> findByNom(String nom);

    Optional<Country> findByCodeIso2(String codeIso2);

    Optional<Country> findByCodeIso3(String codeIso3);

    List<Country> findByNomContainingIgnoreCaseOrderByNomAsc(String nom);

    List<Country> findAllByOrderByNomAsc();
}