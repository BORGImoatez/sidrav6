package tn.gov.ms.sidra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.ms.sidra.entity.*;
import tn.gov.ms.sidra.repository.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GouvernoratRepository gouvernoratRepository;
    private final StructureRepository structureRepository;
    private final CountryRepository countryRepository;
    private final MinistereRepository ministereRepository;
    private final DelegationRepository delegationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        initializeGouvernorats();
        initializeMinisteres();
        initializeStructures();
        initializeDelegations();
        initializeCountries();
        initializeDefaultSuperAdmin();


    }

    /**
     * Initialise les gouvernorats de la Tunisie
     */
    private void initializeGouvernorats() {
        log.info("Initialisation des gouvernorats...");

        if (gouvernoratRepository.count() == 0) {
            String[][] gouvernoratsData = {
                    {"Tunis", "TUN"}, {"Ariana", "ARI"}, {"Ben Arous", "BEN"}, {"Manouba", "MAN"},
                    {"Nabeul", "NAB"}, {"Zaghouan", "ZAG"}, {"Bizerte", "BIZ"}, {"Béja", "BEJ"},
                    {"Jendouba", "JEN"}, {"Kef", "KEF"}, {"Siliana", "SIL"}, {"Sousse", "SOU"},
                    {"Monastir", "MON"}, {"Mahdia", "MAH"}, {"Sfax", "SFX"}, {"Kairouan", "KAI"},
                    {"Kasserine", "KAS"}, {"Sidi Bouzid", "SID"}, {"Gabès", "GAB"}, {"Médenine", "MED"},
                    {"Tataouine", "TAT"}, {"Gafsa", "GAF"}, {"Tozeur", "TOZ"}, {"Kébili", "KEB"}
            };

            for (String[] data : gouvernoratsData) {
                Gouvernorat gouvernorat = new Gouvernorat();
                gouvernorat.setNom(data[0]);
                gouvernorat.setCodeIso3(data[1]);
                gouvernoratRepository.save(gouvernorat);
            }

            log.info("✅ {} gouvernorats initialisés", gouvernoratsData.length);
        } else {
            log.info("✅ Gouvernorats déjà initialisés");
        }
    }

    /**
     * Initialise les ministères
     */
    private void initializeMinisteres() {
        log.info("Initialisation des ministères...");

        if (ministereRepository.count() == 0) {
            List<String[]> ministeresData = Arrays.asList(
                    new String[]{"Ministère de la Santé", "MS"},
                    new String[]{"Ministère de l'Intérieur", "MI"},
                    new String[]{"Ministère de la Justice", "MJ"},
                    new String[]{"Ministère de l'Éducation", "ME"},
                    new String[]{"Ministère de l'Enseignement Supérieur et de la Recherche Scientifique", "MESRS"},
                    new String[]{"Ministère des Affaires Sociales", "MAS"},
                    new String[]{"Ministère de la Jeunesse et des Sports", "MJS"},
                    new String[]{"Ministère de la Défense Nationale", "MDN"},
                    new String[]{"Ministère des Finances", "MF"},
                    new String[]{"Ministère des Affaires Étrangères", "MAE"},
                    new String[]{"Ministère de l'Agriculture", "MA"},
                    new String[]{"Ministère de l'Industrie", "MIND"},
                    new String[]{"Ministère du Tourisme", "MT"},
                    new String[]{"Ministère du Transport", "MTR"},
                    new String[]{"Ministère de l'Environnement", "MENV"}
            );

            for (String[] data : ministeresData) {
                Ministere ministere = new Ministere();
                ministere.setNom(data[0]);
                ministere.setCode(data[1]);
                ministere.setActif(true);
                ministereRepository.save(ministere);
            }

            log.info("✅ {} ministères initialisés", ministeresData.size());
        } else {
            log.info("✅ Ministères déjà initialisés");
        }
    }

    /**
     * Initialise les délégations pour le gouvernorat d'Ariana
     */
    private void initializeDelegations() {
        log.info("Initialisation des délégations pour Ariana...");

        Gouvernorat ariana = gouvernoratRepository.findByNom("Ariana").orElse(null);

        if (ariana != null) {
            // Vérifier si des délégations existent déjà pour Ariana
            if (ariana.getDelegations() == null || ariana.getDelegations().isEmpty()) {
                // Créer les délégations pour Ariana
                String[] delegationsAriana = {"Soukra", "Borj Louzir", "Ariana Ville", "Raoued", "Kalaat el-Andalous", "Sidi Thabet"};

                for (String nomDelegation : delegationsAriana) {
                    Delegation delegation = new Delegation();
                    delegation.setNom(nomDelegation);
                    delegation.setGouvernorat(ariana);
                    delegationRepository.save(delegation);
                }

                log.info("✅ {} délégations créées pour Ariana", delegationsAriana.length);
            } else {
                log.info("✅ Délégations pour Ariana déjà initialisées");
            }
        } else {
            log.warn("⚠️ Gouvernorat Ariana non trouvé, impossible d'initialiser les délégations");
        }
    }

    /**
     * Initialise quelques structures par défaut
     */
    private void initializeStructures() {
        log.info("Initialisation des structures par défaut...");

        if (structureRepository.count() == 0) {
            Gouvernorat tunis = gouvernoratRepository.findByNom("Tunis").orElse(null);
            Gouvernorat sfax = gouvernoratRepository.findByNom("Sfax").orElse(null);
            Ministere sante = ministereRepository.findByNomAndActifTrue("Ministère de la Santé").orElse(null);

            if (tunis != null && sante != null) {
                // Structures publiques
                createStructure("Hôpital Charles Nicolle", TypeStructure.PUBLIQUE, tunis, "Secteur Public", sante);
                createStructure("Hôpital La Rabta", TypeStructure.PUBLIQUE, tunis, "Secteur Public", sante);

                // Structure privée
                createStructure("Clinique Avicenne", TypeStructure.PRIVEE, tunis, "Secteur Privé", null);

                // ONG
                createStructure("Association Tunisienne de Lutte contre les Drogues", TypeStructure.ONG, tunis, "ATLD", null);
            }

            if (sfax != null && sante != null) {
                createStructure("Hôpital Habib Bourguiba", TypeStructure.PUBLIQUE, sfax, "Secteur Public", sante);
            }

            log.info("✅ Structures par défaut initialisées");
        } else {
            log.info("✅ Structures déjà initialisées");
        }
    }

    private void createStructure(String nom, TypeStructure type, Gouvernorat gouvernorat, String secteur, Ministere ministere) {
        Structure structure = new Structure();
        structure.setNom(nom);
        structure.setType(type);
        structure.setGouvernorat(gouvernorat);
        structure.setSecteur(secteur);
        structure.setMinistere(ministere);
        structure.setActif(true);
        structureRepository.save(structure);
    }

    /**
     * Initialise la liste des pays
     */
    private void initializeCountries() {
        log.info("Initialisation des pays...");

        if (countryRepository.count() == 0) {
            // Liste des pays avec leurs codes ISO
            Object[][] countriesData = {
                    {"Afghanistan", "AF", "AFG"}, {"Afrique du Sud", "ZA", "ZAF"}, {"Albanie", "AL", "ALB"},
                    {"Algérie", "DZ", "DZA"}, {"Allemagne", "DE", "DEU"}, {"Andorre", "AD", "AND"},
                    {"Angola", "AO", "AGO"}, {"Antigua-et-Barbuda", "AG", "ATG"}, {"Arabie saoudite", "SA", "SAU"},
                    {"Argentine", "AR", "ARG"}, {"Arménie", "AM", "ARM"}, {"Australie", "AU", "AUS"},
                    {"Autriche", "AT", "AUT"}, {"Azerbaïdjan", "AZ", "AZE"}, {"Bahamas", "BS", "BHS"},
                    {"Bahreïn", "BH", "BHR"}, {"Bangladesh", "BD", "BGD"}, {"Barbade", "BB", "BRB"},
                    {"Belgique", "BE", "BEL"}, {"Belize", "BZ", "BLZ"}, {"Bénin", "BJ", "BEN"},
                    {"Bhoutan", "BT", "BTN"}, {"Biélorussie", "BY", "BLR"}, {"Birmanie", "MM", "MMR"},
                    {"Bolivie", "BO", "BOL"}, {"Bosnie-Herzégovine", "BA", "BIH"}, {"Botswana", "BW", "BWA"},
                    {"Brésil", "BR", "BRA"}, {"Brunei", "BN", "BRN"}, {"Bulgarie", "BG", "BGR"},
                    {"Burkina Faso", "BF", "BFA"}, {"Burundi", "BI", "BDI"}, {"Cambodge", "KH", "KHM"},
                    {"Cameroun", "CM", "CMR"}, {"Canada", "CA", "CAN"}, {"Cap-Vert", "CV", "CPV"},
                    {"Chili", "CL", "CHL"}, {"Chine", "CN", "CHN"}, {"Chypre", "CY", "CYP"},
                    {"Colombie", "CO", "COL"}, {"Comores", "KM", "COM"}, {"Congo", "CG", "COG"},
                    {"Corée du Nord", "KP", "PRK"}, {"Corée du Sud", "KR", "KOR"}, {"Costa Rica", "CR", "CRI"},
                    {"Côte d'Ivoire", "CI", "CIV"}, {"Croatie", "HR", "HRV"}, {"Cuba", "CU", "CUB"},
                    {"Danemark", "DK", "DNK"}, {"Djibouti", "DJ", "DJI"}, {"Dominique", "DM", "DMA"},
                    {"Égypte", "EG", "EGY"}, {"Émirats arabes unis", "AE", "ARE"}, {"Équateur", "EC", "ECU"},
                    {"Érythrée", "ER", "ERI"}, {"Espagne", "ES", "ESP"}, {"Estonie", "EE", "EST"},
                    {"États-Unis", "US", "USA"}, {"Éthiopie", "ET", "ETH"}, {"Fidji", "FJ", "FJI"},
                    {"Finlande", "FI", "FIN"}, {"France", "FR", "FRA"}, {"Gabon", "GA", "GAB"},
                    {"Gambie", "GM", "GMB"}, {"Géorgie", "GE", "GEO"}, {"Ghana", "GH", "GHA"},
                    {"Grèce", "GR", "GRC"}, {"Grenade", "GD", "GRD"}, {"Guatemala", "GT", "GTM"},
                    {"Guinée", "GN", "GIN"}, {"Guinée-Bissau", "GW", "GNB"}, {"Guinée équatoriale", "GQ", "GNQ"},
                    {"Guyana", "GY", "GUY"}, {"Haïti", "HT", "HTI"}, {"Honduras", "HN", "HND"},
                    {"Hongrie", "HU", "HUN"}, {"Îles Marshall", "MH", "MHL"}, {"Îles Salomon", "SB", "SLB"},
                    {"Inde", "IN", "IND"}, {"Indonésie", "ID", "IDN"}, {"Irak", "IQ", "IRQ"},
                    {"Iran", "IR", "IRN"}, {"Irlande", "IE", "IRL"}, {"Islande", "IS", "ISL"},
                    {"Israël", "IL", "ISR"}, {"Italie", "IT", "ITA"}, {"Jamaïque", "JM", "JAM"},
                    {"Japon", "JP", "JPN"}, {"Jordanie", "JO", "JOR"}, {"Kazakhstan", "KZ", "KAZ"},
                    {"Kenya", "KE", "KEN"}, {"Kirghizistan", "KG", "KGZ"}, {"Kiribati", "KI", "KIR"},
                    {"Koweït", "KW", "KWT"}, {"Laos", "LA", "LAO"}, {"Lesotho", "LS", "LSO"},
                    {"Lettonie", "LV", "LVA"}, {"Liban", "LB", "LBN"}, {"Liberia", "LR", "LBR"},
                    {"Libye", "LY", "LBY"}, {"Liechtenstein", "LI", "LIE"}, {"Lituanie", "LT", "LTU"},
                    {"Luxembourg", "LU", "LUX"}, {"Macédoine du Nord", "MK", "MKD"}, {"Madagascar", "MG", "MDG"},
                    {"Malaisie", "MY", "MYS"}, {"Malawi", "MW", "MWI"}, {"Maldives", "MV", "MDV"},
                    {"Mali", "ML", "MLI"}, {"Malte", "MT", "MLT"}, {"Maroc", "MA", "MAR"},
                    {"Maurice", "MU", "MUS"}, {"Mauritanie", "MR", "MRT"}, {"Mexique", "MX", "MEX"},
                    {"Micronésie", "FM", "FSM"}, {"Moldavie", "MD", "MDA"}, {"Monaco", "MC", "MCO"},
                    {"Mongolie", "MN", "MNG"}, {"Monténégro", "ME", "MNE"}, {"Mozambique", "MZ", "MOZ"},
                    {"Namibie", "NA", "NAM"}, {"Nauru", "NR", "NRU"}, {"Népal", "NP", "NPL"},
                    {"Nicaragua", "NI", "NIC"}, {"Niger", "NE", "NER"}, {"Nigeria", "NG", "NGA"},
                    {"Norvège", "NO", "NOR"}, {"Nouvelle-Zélande", "NZ", "NZL"}, {"Oman", "OM", "OMN"},
                    {"Ouganda", "UG", "UGA"}, {"Ouzbékistan", "UZ", "UZB"}, {"Pakistan", "PK", "PAK"},
                    {"Palaos", "PW", "PLW"}, {"Palestine", "PS", "PSE"}, {"Panama", "PA", "PAN"},
                    {"Papouasie-Nouvelle-Guinée", "PG", "PNG"}, {"Paraguay", "PY", "PRY"}, {"Pays-Bas", "NL", "NLD"},
                    {"Pérou", "PE", "PER"}, {"Philippines", "PH", "PHL"}, {"Pologne", "PL", "POL"},
                    {"Portugal", "PT", "PRT"}, {"Qatar", "QA", "QAT"}, {"République centrafricaine", "CF", "CAF"},
                    {"République démocratique du Congo", "CD", "COD"}, {"République dominicaine", "DO", "DOM"}, {"République tchèque", "CZ", "CZE"},
                    {"Roumanie", "RO", "ROU"}, {"Royaume-Uni", "GB", "GBR"}, {"Russie", "RU", "RUS"},
                    {"Rwanda", "RW", "RWA"}, {"Saint-Kitts-et-Nevis", "KN", "KNA"}, {"Saint-Marin", "SM", "SMR"},
                    {"Saint-Vincent-et-les-Grenadines", "VC", "VCT"}, {"Sainte-Lucie", "LC", "LCA"}, {"Salvador", "SV", "SLV"},
                    {"Samoa", "WS", "WSM"}, {"São Tomé-et-Principe", "ST", "STP"}, {"Sénégal", "SN", "SEN"},
                    {"Serbie", "RS", "SRB"}, {"Seychelles", "SC", "SYC"}, {"Sierra Leone", "SL", "SLE"},
                    {"Singapour", "SG", "SGP"}, {"Slovaquie", "SK", "SVK"}, {"Slovénie", "SI", "SVN"},
                    {"Somalie", "SO", "SOM"}, {"Soudan", "SD", "SDN"}, {"Soudan du Sud", "SS", "SSD"},
                    {"Sri Lanka", "LK", "LKA"}, {"Suède", "SE", "SWE"}, {"Suisse", "CH", "CHE"},
                    {"Suriname", "SR", "SUR"}, {"Syrie", "SY", "SYR"}, {"Tadjikistan", "TJ", "TJK"},
                    {"Tanzanie", "TZ", "TZA"}, {"Tchad", "TD", "TCD"}, {"Thaïlande", "TH", "THA"},
                    {"Timor oriental", "TL", "TLS"}, {"Togo", "TG", "TGO"}, {"Tonga", "TO", "TON"},
                    {"Trinité-et-Tobago", "TT", "TTO"}, {"Tunisie", "TN", "TUN"}, {"Turkménistan", "TM", "TKM"},
                    {"Turquie", "TR", "TUR"}, {"Tuvalu", "TV", "TUV"}, {"Ukraine", "UA", "UKR"},
                    {"Uruguay", "UY", "URY"}, {"Vanuatu", "VU", "VUT"}, {"Vatican", "VA", "VAT"},
                    {"Venezuela", "VE", "VEN"}, {"Viêt Nam", "VN", "VNM"}, {"Yémen", "YE", "YEM"},
                    {"Zambie", "ZM", "ZMB"}, {"Zimbabwe", "ZW", "ZWE"}
            };

            for (Object[] data : countriesData) {
                Country country = new Country();
                country.setNom((String) data[0]);
                country.setCodeIso2((String) data[1]);
                country.setCodeIso3((String) data[2]);
                countryRepository.save(country);
            }

            log.info("✅ {} pays initialisés", countriesData.length);
        } else {
            log.info("✅ Pays déjà initialisés");
        }
    }

    /**
     * Crée un utilisateur SUPER_ADMIN par défaut s'il n'en existe aucun
     */
    private void initializeDefaultSuperAdmin() {
        log.info("Vérification de l'existence d'un utilisateur SUPER_ADMIN...");

        // Vérifier s'il existe déjà un SUPER_ADMIN
        boolean superAdminExists = userRepository.findByRole(UserRole.SUPER_ADMIN)
                .stream()
                .anyMatch(User::getActif);

        if (!superAdminExists) {
            log.info("Aucun utilisateur SUPER_ADMIN actif trouvé. Création du compte par défaut...");

            // Créer le SUPER_ADMIN par défaut
            User defaultSuperAdmin = new User();
            defaultSuperAdmin.setNom("Administrateur");
            defaultSuperAdmin.setPrenom("Système");
            defaultSuperAdmin.setEmail("admin@sidra.tn");
            defaultSuperAdmin.setTelephone("+21695418515"); // Numéro spécifié
            defaultSuperAdmin.setMotDePasse(passwordEncoder.encode("Insp2025")); // Mot de passe spécifié
            defaultSuperAdmin.setRole(UserRole.SUPER_ADMIN);
            defaultSuperAdmin.setActif(true);
            defaultSuperAdmin.setDateCreation(LocalDateTime.now());
            defaultSuperAdmin.setTentativesConnexion(0);

            try {
                userRepository.save(defaultSuperAdmin);
                log.info("✅ Utilisateur SUPER_ADMIN créé avec succès:");
                log.info("   📧 Email: {}", defaultSuperAdmin.getEmail());
                log.info("   📱 Téléphone: {}", defaultSuperAdmin.getTelephone());
                log.info("   🔑 Mot de passe: Insp2025");
                log.info("   👤 Rôle: {}", defaultSuperAdmin.getRole());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création du SUPER_ADMIN par défaut: {}", e.getMessage(), e);
            }

            // Créer un utilisateur EXTERNE pour les tests
            createDefaultExterneUser();
        } else {
            log.info("✅ Un utilisateur SUPER_ADMIN existe déjà. Aucune action nécessaire.");
        }
    }

    /**
     * Crée un utilisateur EXTERNE par défaut pour les tests
     */
    private void createDefaultExterneUser() {
        log.info("Création d'un utilisateur EXTERNE par défaut...");

        // Récupérer une structure par défaut
        Structure defaultStructure = structureRepository.findByNomContainingIgnoreCase("Charles Nicolle")
                .stream()
                .findFirst()
                .orElse(null);

        if (defaultStructure != null) {
            User externeUser = new User();
            externeUser.setNom("Externe");
            externeUser.setPrenom("Utilisateur");
            externeUser.setEmail("externe@sidra.tn");
            externeUser.setTelephone("+21698407454");
            externeUser.setMotDePasse(passwordEncoder.encode("123456"));
            externeUser.setRole(UserRole.EXTERNE);
            externeUser.setStructure(defaultStructure);
            externeUser.setActif(true);
            externeUser.setDateCreation(LocalDateTime.now());
            externeUser.setTentativesConnexion(0);

            try {
                userRepository.save(externeUser);
                log.info("✅ Utilisateur EXTERNE créé avec succès:");
                log.info("   📧 Email: {}", externeUser.getEmail());
                log.info("   📱 Téléphone: {}", externeUser.getTelephone());
                log.info("   🔑 Mot de passe: 123456");
                log.info("   👤 Rôle: {}", externeUser.getRole());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la création de l'utilisateur EXTERNE: {}", e.getMessage(), e);
            }
        }
    }
}