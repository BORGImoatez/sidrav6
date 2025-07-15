package tn.gov.ms.sidra.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.gov.ms.sidra.entity.Country;
import tn.gov.ms.sidra.repository.CountryRepository;

import java.util.List;

@RestController
@RequestMapping("/countries")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
public class CountryController {

    private final CountryRepository countryRepository;

    /**
     * Récupère tous les pays
     */
    @GetMapping
    public ResponseEntity<List<Country>> getAllCountries() {
        log.info("Récupération de tous les pays");

        List<Country> countries = countryRepository.findAllByOrderByNomAsc();
        return ResponseEntity.ok(countries);
    }

    /**
     * Recherche des pays par nom
     */
    @GetMapping("/search")
    public ResponseEntity<List<Country>> searchCountries(@RequestParam String query) {
        log.info("Recherche de pays avec le terme: {}", query);

        List<Country> countries = countryRepository.findByNomContainingIgnoreCaseOrderByNomAsc(query);
        return ResponseEntity.ok(countries);
    }

    /**
     * Récupère un pays par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Country> getCountryById(@PathVariable Long id) {
        log.info("Récupération du pays avec l'ID: {}", id);

        return countryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}