export interface FormulaireData {
  // Partie 1: Informations structure/centre & usager SPA
  iun?: string; // Généré automatiquement
  id?: number;
  secteur: 'PUBLIC' | 'PRIVE' | 'ONG' | 'SOCIETE_CIVILE_ONG';
  ongPrecision?: string;
  ministere?: string;
  structure: string;
  gouvernoratStructure: string;
  prenom: string;
  dateConsultation: Date;
  genre: 'HOMME' | 'FEMME';
  dateNaissance: Date;
  nationalite: string;
  residence: 'TUNISIE' | 'ETRANGER';
  gouvernoratResidence?: string;
  delegationResidence?: string;
  paysResidence?: string;
  patientId?: number;
  patient?: {
    id: number;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    genre: string;
    codePatient: string;
  };

  // Cadre de consultation (multiple)
  cadreConsultation: {
    addictologie?: boolean;
    addictologieType?: 'SEVRAGE' | 'GESTION_ADDICTION' | 'RISQUE_RECHUTE';
    psychiatrie?: boolean;
    psychologique?: boolean;
    medecineGenerale?: boolean;
    neurologique?: boolean;
    infectieux?: boolean;
    espaceAmisJeunes?: boolean;
    echangeMateriel?: boolean;
    rehabilitation?: boolean;
    urgenceMedicale?: boolean;
    urgenceChirurgicale?: boolean;
    depistage?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  // Origine de la demande (multiple)
  origineDemande: {
    luiMeme?: boolean;
    famille?: boolean;
    amis?: boolean;
    celluleEcoute?: boolean;
    autreCentre?: boolean;
    structureSociale?: boolean;
    structureJudiciaire?: boolean;
    jugeEnfance?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  causeCirconstance?: string;
  consultationAnterieure?: boolean | null;
  dateConsultationAnterieure?: string;
  motifConsultationAnterieure?: string;
  motifConsultationAnterieurePrecision?: string;

  causeRecidive?: string;
  causeRecidivePrecision?: string;
  causeEchecSevrage?: string;
  causeEchecSevragePrecision?: string;

  situationFamiliale?: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'SEPARE' | 'VEUF' | 'AUTRE';
  situationFamilialeAutre?: string;

  logement30Jours?: 'SEUL' | 'FAMILLE_ORIGINE' | 'PARTENAIRE' | 'ENFANTS' | 'AMIS' | 'INTERNAT' | 'COLOCATION' | 'FOYER' | 'DETENTION' | 'CENTRE_JEUNESSE' | 'INSTITUTION' | 'AUTRE';
  logement30JoursAutre?: string;

  natureLogement?: 'STABLE' | 'PRECAIRE';

  profession?: 'EMPLOYE' | 'COMPTE_PROPRE' | 'JOURNALIER' | 'SPORTIF' | 'CHOMAGE' | 'ELEVE' | 'ETUDIANT' | 'FORMATION' | 'RETRAITE' | 'SANS_RESSOURCES';

  niveauScolaire?: 'ANALPHABETE' | 'PRESCOLAIRE' | 'PRIMAIRE' | 'COLLEGE' | 'SECONDAIRE' | 'FORMATION_PROF' | 'UNIVERSITAIRE';

  activiteSportive?: boolean | null;
  activiteSportiveFrequence?: 'REGULIERE' | 'IRREGULIERE';
  activiteSportiveType?: 'COMPETITION' | 'LOISIR';
  espacesLoisirs?: boolean;
  dopage?: boolean | null;

  // Champ pour gérer le cadre de consultation principal (choix unique)
  cadreConsultationPrincipal?: string;

  // Partie 2: Consommation tabac & alcool
  consommationTabac: 'FUMEUR' | 'NON_FUMEUR' | 'EX_FUMEUR';
  agePremiereConsommationTabac?: number;
  consommationTabac30Jours?: boolean;
  frequenceTabac30Jours?: 'QUOTIDIEN' | '2_3_JOURS' | 'HEBDOMADAIRE' | 'OCCASIONNEL';
  nombreCigarettesJour?: number;
  nombrePaquetsAnnee?: number;
  ageArretTabac?: number;
  soinsSevrageTabac?: 'OUI_SATISFAIT' | 'OUI_NON_SATISFAIT' | 'NON';
  sevrageAssiste?: boolean;

  consommationAlcool: boolean;
  agePremiereConsommationAlcool?: number;
  consommationAlcool30Jours?: boolean;
  frequenceAlcool30Jours?: 'QUOTIDIEN' | '2_3_JOURS' | 'HEBDOMADAIRE' | 'OCCASIONNEL';
  quantiteAlcoolPrise?: number;
  typeAlcool?: {
    biere?: boolean;
    liqueurs?: boolean;
    alcoolBruler?: boolean;
    legmi?: boolean;
    boukha?: boolean;
  };

  // Partie 3: Consommation de substances psychoactives
  consommationSpaEntourage: boolean | null;

  // Si consommation SPA dans l'entourage
  entourageSpa?: {
    membresFamille?: boolean;
    amis?: boolean;
    milieuProfessionnel?: boolean;
    milieuSportif?: boolean;
    milieuScolaire?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  // Types de SPA consommées dans l'entourage
  typeSpaEntourage?: {
    tabac?: boolean;
    alcool?: boolean;
    cannabis?: boolean;
    opium?: boolean;
    morphiniques?: boolean;
    morphiniquesPrecision?: string;
    heroine?: boolean;
    cocaine?: boolean;
    hypnotiques?: boolean;
    hypnotiquesPrecision?: string;
    hypnotiquesAutrePrecision?: string;
    amphetamines?: boolean;
    ecstasy?: boolean;
    produitsInhaler?: boolean;
    pregabaline?: boolean;
    ketamines?: boolean;
    lsd?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  // Consommation personnelle de SPA
  consommationSpaPersonnelle: boolean | null;

  // Drogues utilisées actuellement
  droguesActuelles?: {
    cannabis?: boolean;
    opium?: boolean;
    morphiniques?: boolean;
    morphiniquesPrecision?: string;
    heroine?: boolean;
    cocaine?: boolean;
    hypnotiques?: boolean;
    hypnotiquesPrecision?: string;
    hypnotiquesAutrePrecision?: string;
    amphetamines?: boolean;
    ecstasy?: boolean;
    produitsInhaler?: boolean;
    pregabaline?: boolean;
    ketamines?: boolean;
    lsd?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  // Substance d'initiation
  substanceInitiation?: {
    cannabis?: boolean;
    opium?: boolean;
    morphiniques?: boolean;
    morphiniquesPrecision?: string;
    heroine?: boolean;
    cocaine?: boolean;
    hypnotiques?: boolean;
    hypnotiquesPrecision?: string;
    hypnotiquesAutrePrecision?: string;
    amphetamines?: boolean;
    ecstasy?: boolean;
    produitsInhaler?: boolean;
    pregabaline?: boolean;
    ketamines?: boolean;
    lsd?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  ageInitiationPremiere?: number;

  // Substance principale (en cas de poly-consommation)
  substancePrincipale?: {
    cannabis?: boolean;
    opium?: boolean;
    morphiniques?: boolean;
    morphiniquesPrecision?: string;
    heroine?: boolean;
    cocaine?: boolean;
    hypnotiques?: boolean;
    hypnotiquesPrecision?: string;
    hypnotiquesAutrePrecision?: string;
    amphetamines?: boolean;
    ecstasy?: boolean;
    produitsInhaler?: boolean;
    pregabaline?: boolean;
    ketamines?: boolean;
    lsd?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  ageInitiationPrincipale?: number;

  // Autres comportements addictifs
  troublesAlimentaires: boolean | null;
  addictionJeux: boolean | null;
  addictionEcrans: boolean | null;
  comportementsSexuels: boolean | null;

  // Partie 4: Comportements liés à la consommation et tests de dépistage
  // Voie d'administration habituelle (substance principale)
  voieAdministration?: {
    injectee?: boolean;
    fumee?: boolean;
    ingeree?: boolean;
    sniffee?: boolean;
    inhalee?: boolean;
    autre?: boolean;
    autrePrecision?: string;
  };

  // Fréquence de consommation de la substance principale
  frequenceSubstancePrincipale?: 'DEUX_FOIS_PLUS_PAR_JOUR' | 'UNE_FOIS_PAR_JOUR' | 'DEUX_TROIS_JOURS_SEMAINE' | 'UNE_FOIS_SEMAINE' | 'OCCASIONNEL_FESTIF';

  // Notion de partage de seringues
  partageSeringues?: 'JAMAIS_PARTAGE' | 'INFERIEUR_1_MOIS' | 'ENTRE_1_3_MOIS' | 'ENTRE_3_6_MOIS' | 'ENTRE_6_12_MOIS' | 'DOUZE_MOIS_PLUS';

  // Tests de dépistage
  testVih?: {
    realise?: boolean;
    periode?: '3_MOIS' | '6_MOIS' | '12_MOIS_PLUS';
  };

  testVhc?: {
    realise?: boolean;
    periode?: '3_MOIS' | '6_MOIS' | '12_MOIS_PLUS';
  };

  testVhb?: {
    realise?: boolean;
    periode?: '3_MOIS' | '6_MOIS' | '12_MOIS_PLUS';
  };

  testSyphilis?: {
    realise?: boolean;
    periode?: '3_MOIS' | '6_MOIS' | '12_MOIS_PLUS';
  };

  // Accompagnement sevrage
  accompagnementSevrage?: boolean;
  accompagnementSevrageNonRaison?: string;

  // Tentative de sevrage
  tentativeSevrage?: boolean;
  tentativeSevrageDetails?: {
    toutSeul?: boolean;
    soutienFamille?: boolean;
    soutienAmi?: boolean;
    soutienScolaire?: boolean;
    structureSante?: boolean;
    structureSantePrecision?: string;
  };

  // Partie 5: Comorbidités
  // Comorbidités psychiatriques personnelles
  comorbiditePsychiatriquePersonnelle?: boolean;
  comorbiditePsychiatriquePersonnellePrecision?: string;

  // Comorbidités somatiques personnelles
  comorbiditeSomatiquePersonnelle?: boolean;
  comorbiditeSomatiquePersonnellePrecision?: string;

  // Comorbidités psychiatriques des partenaires
  comorbiditePsychiatriquePartenaire?: boolean;
  comorbiditePsychiatriquePartenairePrecision?: string;

  // Comorbidités somatiques des partenaires
  comorbiditeSomatiquePartenaire?: boolean;
  comorbiditeSomatiquePartenairePrecision?: string;

  // Antécédents pénitentiaires
  nombreCondamnations?: number;
  dureeDetentionJours?: number;
  dureeDetentionMois?: number;
  dureeDetentionAnnees?: number;

  // Partie 6: Décès induit par les SPA dans l'entourage
  nombreDecesSpaDansEntourage?: number;
  causesDecesSpaDansEntourage?: string;
}

export interface FormulaireStep {
  id: number;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}
