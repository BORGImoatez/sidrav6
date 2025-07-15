import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormulaireService } from '../../../../services/formulaire.service';
import { AuthService } from '../../../../services/auth.service';
import { UserRole } from '../../../../models/user.model';

@Component({
    selector: 'app-formulaire-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="formulaire-detail-container">
            <div class="page-header">
                <div class="header-content">
                    <h1 class="page-title">Détail du formulaire</h1>
                    <p class="page-description" *ngIf="formulaire">
                        {{ formulaire.identifiantUnique }}
                    </p>
                </div>
                <div class="header-actions">
                    <button
                            *ngIf="canEdit()"
                            class="btn btn-secondary"
                            (click)="editFormulaire()"
                            type="button"
                    >
                        ✏️ Modifier
                    </button>
                    <button
                            *ngIf="canDelete()"
                            class="btn btn-danger"
                            (click)="confirmDelete()"
                            type="button"
                    >
                        🗑️ Supprimer
                    </button>
                    <button
                            class="btn btn-secondary"
                            (click)="goBack()"
                            type="button"
                    >
                        ← Retour
                    </button>
                </div>
            </div>

            <div *ngIf="isLoading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Chargement du formulaire...</p>
            </div>

            <div *ngIf="!isLoading && formulaire" class="formulaire-content">
                <!-- Informations générales -->
                <div class="formulaire-header card">
                    <div class="card-header">
                        <h3 class="section-title">Informations générales</h3>
                    </div>
                    <div class="card-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Identifiant unique</span>
                                <span class="info-value formulaire-id">{{ formulaire.identifiantUnique }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Date de consultation</span>
                                <span class="info-value">{{ formulaire.dateConsultation | date:'dd/MM/yyyy' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Patient</span>
                                <span class="info-value">{{ formulaire.patient.prenom }} {{ formulaire.patient.nom }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Code patient</span>
                                <span class="info-value code-patient">{{ formulaire.patient.codePatient }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Structure</span>
                                <span class="info-value">{{ formulaire.structure.nom }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Saisi par</span>
                                <span class="info-value">{{ formulaire.utilisateur.prenom }} {{ formulaire.utilisateur.nom }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Date de création</span>
                                <span class="info-value">{{ formulaire.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
                            </div>
                            <div class="info-item" *ngIf="formulaire.dateModification">
                                <span class="info-label">Dernière modification</span>
                                <span class="info-value">{{ formulaire.dateModification | date:'dd/MM/yyyy HH:mm' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 1: Informations structure/centre & usager SPA -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">1. Informations structure/centre & usager SPA</h3>
                    </div>
                    <div class="card-body">
                        <div class="section-grid">
                            <div class="section-item">
                                <span class="section-label">Secteur</span>
                                <span class="section-value">{{ formulaire.secteur }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.ongPrecision">
                                <span class="section-label">Précision ONG</span>
                                <span class="section-value">{{ formulaire.ongPrecision }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.ministere">
                                <span class="section-label">Ministère</span>
                                <span class="section-value">{{ formulaire.ministere }}</span>
                            </div>
                            <div class="section-item">
                                <span class="section-label">Gouvernorat structure</span>
                                <span class="section-value">{{ formulaire.gouvernoratStructure }}</span>
                            </div>
                            <div class="section-item">
                                <span class="section-label">Nationalité</span>
                                <span class="section-value">{{ formulaire.nationalite }}</span>
                            </div>
                            <div class="section-item">
                                <span class="section-label">Résidence</span>
                                <span class="section-value">{{ formulaire.residence }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.gouvernoratResidence">
                                <span class="section-label">Gouvernorat résidence</span>
                                <span class="section-value">{{ formulaire.gouvernoratResidence }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.delegationResidence">
                                <span class="section-label">Délégation résidence</span>
                                <span class="section-value">{{ formulaire.delegationResidence }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.paysResidence">
                                <span class="section-label">Pays résidence</span>
                                <span class="section-value">{{ formulaire.paysResidence }}</span>
                            </div>
                        </div>

                        <!-- Cadre de consultation -->
                        <div class="subsection">
                            <h4 class="subsection-title">Cadre de consultation</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="getCadreConsultation('addictologie')">
                                    <span class="section-label">Addictologie</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('addictologieType')">
                                    <span class="section-label">Type d'addictologie</span>
                                    <span class="section-value">{{ getCadreConsultation('addictologieType') }}</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('psychiatrie')">
                                    <span class="section-label">Psychiatrie</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('psychologique')">
                                    <span class="section-label">Psychologique</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('medecineGenerale')">
                                    <span class="section-label">Médecine générale</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('neurologique')">
                                    <span class="section-label">Neurologique</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('infectieux')">
                                    <span class="section-label">Infectieux</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('espaceAmisJeunes')">
                                    <span class="section-label">Espace amis jeunes</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('echangeMateriel')">
                                    <span class="section-label">Échange matériel</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('rehabilitation')">
                                    <span class="section-label">Réhabilitation</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('urgenceMedicale')">
                                    <span class="section-label">Urgence médicale</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('urgenceChirurgicale')">
                                    <span class="section-label">Urgence chirurgicale</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('depistage')">
                                    <span class="section-label">Dépistage</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getCadreConsultation('autre')">
                                    <span class="section-label">Autre</span>
                                    <span class="section-value">{{ getCadreConsultation('autrePrecision') || 'Oui' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Origine de la demande -->
                        <div class="subsection">
                            <h4 class="subsection-title">Origine de la demande</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="getOrigineDemande('luiMeme')">
                                    <span class="section-label">Lui-même</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('famille')">
                                    <span class="section-label">Famille</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('amis')">
                                    <span class="section-label">Amis</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('celluleEcoute')">
                                    <span class="section-label">Cellule d'écoute</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('autreCentre')">
                                    <span class="section-label">Autre centre</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('structureSociale')">
                                    <span class="section-label">Structure sociale</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('structureJudiciaire')">
                                    <span class="section-label">Structure judiciaire</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('jugeEnfance')">
                                    <span class="section-label">Juge enfance</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getOrigineDemande('autre')">
                                    <span class="section-label">Autre</span>
                                    <span class="section-value">{{ getOrigineDemande('autrePrecision') || 'Oui' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Autres informations -->
                        <div class="subsection">
                            <h4 class="subsection-title">Autres informations</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.causeCirconstance">
                                    <span class="section-label">Cause/circonstance</span>
                                    <span class="section-value">{{ formulaire.causeCirconstance }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.consultationAnterieure !== null">
                                    <span class="section-label">Consultation antérieure</span>
                                    <span class="section-value">{{ formulaire.consultationAnterieure ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.dateConsultationAnterieure">
                                    <span class="section-label">Date consultation antérieure</span>
                                    <span class="section-value">{{ formulaire.dateConsultationAnterieure }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.motifConsultationAnterieure">
                                    <span class="section-label">Motif consultation antérieure</span>
                                    <span class="section-value">{{ formulaire.motifConsultationAnterieure }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.causeRecidive">
                                    <span class="section-label">Cause récidive</span>
                                    <span class="section-value">{{ formulaire.causeRecidive }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.causeEchecSevrage">
                                    <span class="section-label">Cause échec sevrage</span>
                                    <span class="section-value">{{ formulaire.causeEchecSevrage }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.situationFamiliale">
                                    <span class="section-label">Situation familiale</span>
                                    <span class="section-value">{{ getSituationFamiliale() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.logement30Jours">
                                    <span class="section-label">Logement 30 jours</span>
                                    <span class="section-value">{{ getLogement30Jours() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.natureLogement">
                                    <span class="section-label">Nature logement</span>
                                    <span class="section-value">{{ formulaire.natureLogement === 'STABLE' ? 'Stable' : 'Précaire' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.profession">
                                    <span class="section-label">Profession</span>
                                    <span class="section-value">{{ getProfession() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.niveauScolaire">
                                    <span class="section-label">Niveau scolaire</span>
                                    <span class="section-value">{{ getNiveauScolaire() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.activiteSportive !== null">
                                    <span class="section-label">Activité sportive</span>
                                    <span class="section-value">{{ formulaire.activiteSportive ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.activiteSportiveFrequence">
                                    <span class="section-label">Fréquence activité sportive</span>
                                    <span class="section-value">{{ formulaire.activiteSportiveFrequence === 'REGULIERE' ? 'Régulière' : 'Irrégulière' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.activiteSportiveType">
                                    <span class="section-label">Type activité sportive</span>
                                    <span class="section-value">{{ formulaire.activiteSportiveType === 'COMPETITION' ? 'Compétition' : 'Loisir' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.espacesLoisirs !== null">
                                    <span class="section-label">Espaces loisirs</span>
                                    <span class="section-value">{{ formulaire.espacesLoisirs ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.dopage !== null">
                                    <span class="section-label">Dopage</span>
                                    <span class="section-value">{{ formulaire.dopage ? 'Oui' : 'Non' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Consommation tabac & alcool -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">2. Consommation tabac & alcool</h3>
                    </div>
                    <div class="card-body">
                        <!-- Tabac -->
                        <div class="subsection">
                            <h4 class="subsection-title">Consommation de tabac</h4>
                            <div class="section-grid">
                                <div class="section-item">
                                    <span class="section-label">Consommation tabac</span>
                                    <span class="section-value">{{ getConsommationTabac() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.agePremiereConsommationTabac">
                                    <span class="section-label">Âge première consommation</span>
                                    <span class="section-value">{{ formulaire.agePremiereConsommationTabac }} ans</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.consommationTabac30Jours !== null">
                                    <span class="section-label">Consommation 30 derniers jours</span>
                                    <span class="section-value">{{ formulaire.consommationTabac30Jours ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.frequenceTabac30Jours">
                                    <span class="section-label">Fréquence 30 derniers jours</span>
                                    <span class="section-value">{{ getFrequenceTabac() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.nombreCigarettesJour">
                                    <span class="section-label">Nombre cigarettes/jour</span>
                                    <span class="section-value">{{ formulaire.nombreCigarettesJour }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.nombrePaquetsAnnee">
                                    <span class="section-label">Nombre paquets/année</span>
                                    <span class="section-value">{{ formulaire.nombrePaquetsAnnee }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.ageArretTabac">
                                    <span class="section-label">Âge arrêt tabac</span>
                                    <span class="section-value">{{ formulaire.ageArretTabac }} ans</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.soinsSevrageTabac">
                                    <span class="section-label">Soins sevrage tabac</span>
                                    <span class="section-value">{{ getSoinsSevrageTabac() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.sevrageAssiste !== null">
                                    <span class="section-label">Sevrage assisté</span>
                                    <span class="section-value">{{ formulaire.sevrageAssiste ? 'Oui' : 'Non' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Alcool -->
                        <div class="subsection">
                            <h4 class="subsection-title">Consommation d'alcool</h4>
                            <div class="section-grid">
                                <div class="section-item">
                                    <span class="section-label">Consommation alcool</span>
                                    <span class="section-value">{{ formulaire.consommationAlcool ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.agePremiereConsommationAlcool">
                                    <span class="section-label">Âge première consommation</span>
                                    <span class="section-value">{{ formulaire.agePremiereConsommationAlcool }} ans</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.consommationAlcool30Jours !== null">
                                    <span class="section-label">Consommation 30 derniers jours</span>
                                    <span class="section-value">{{ formulaire.consommationAlcool30Jours ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.frequenceAlcool30Jours">
                                    <span class="section-label">Fréquence 30 derniers jours</span>
                                    <span class="section-value">{{ getFrequenceAlcool() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.quantiteAlcoolPrise">
                                    <span class="section-label">Quantité alcool/prise</span>
                                    <span class="section-value">{{ formulaire.quantiteAlcoolPrise }} verres</span>
                                </div>
                            </div>

                            <!-- Type d'alcool -->
                            <div class="section-grid" *ngIf="formulaire.typeAlcool">
                                <div class="section-item" *ngIf="getTypeAlcool('biere')">
                                    <span class="section-label">Bière</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTypeAlcool('liqueurs')">
                                    <span class="section-label">Liqueurs</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTypeAlcool('alcoolBruler')">
                                    <span class="section-label">Alcool à brûler</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTypeAlcool('legmi')">
                                    <span class="section-label">Legmi</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTypeAlcool('boukha')">
                                    <span class="section-label">Boukha</span>
                                    <span class="section-value">Oui</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Consommation de substances psychoactives -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">3. Consommation de substances psychoactives</h3>
                    </div>
                    <div class="card-body">
                        <div class="section-grid">
                            <div class="section-item" *ngIf="formulaire.consommationSpaEntourage !== null">
                                <span class="section-label">Consommation SPA dans l'entourage</span>
                                <span class="section-value">{{ formulaire.consommationSpaEntourage ? 'Oui' : 'Non' }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.consommationSpaPersonnelle !== null">
                                <span class="section-label">Consommation SPA personnelle</span>
                                <span class="section-value">{{ formulaire.consommationSpaPersonnelle ? 'Oui' : 'Non' }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.ageInitiationPremiere">
                                <span class="section-label">Âge initiation première substance</span>
                                <span class="section-value">{{ formulaire.ageInitiationPremiere }} ans</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.ageInitiationPrincipale">
                                <span class="section-label">Âge initiation substance principale</span>
                                <span class="section-value">{{ formulaire.ageInitiationPrincipale }} ans</span>
                            </div>
                        </div>

                        <!-- Substances consommées -->
                        <div class="subsection" *ngIf="formulaire.droguesActuelles">
                            <h4 class="subsection-title">Substances consommées actuellement</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngFor="let substance of getSubstancesConsommees()">
                                    <span class="section-label">{{ substance.label }}</span>
                                    <span class="section-value">{{ substance.precision || 'Oui' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Autres comportements addictifs -->
                        <div class="subsection">
                            <h4 class="subsection-title">Autres comportements addictifs</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.troublesAlimentaires !== null">
                                    <span class="section-label">Troubles alimentaires</span>
                                    <span class="section-value">{{ formulaire.troublesAlimentaires ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.addictionJeux !== null">
                                    <span class="section-label">Addiction aux jeux</span>
                                    <span class="section-value">{{ formulaire.addictionJeux ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.addictionEcrans !== null">
                                    <span class="section-label">Addiction aux écrans</span>
                                    <span class="section-value">{{ formulaire.addictionEcrans ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comportementsSexuels !== null">
                                    <span class="section-label">Comportements sexuels</span>
                                    <span class="section-value">{{ formulaire.comportementsSexuels ? 'Oui' : 'Non' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Comportements liés à la consommation et tests de dépistage -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">4. Comportements liés à la consommation et tests de dépistage</h3>
                    </div>
                    <div class="card-body">
                        <!-- Voie d'administration -->
                        <div class="subsection" *ngIf="formulaire.voieAdministration">
                            <h4 class="subsection-title">Voie d'administration</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="getVoieAdministration('injectee')">
                                    <span class="section-label">Injectée</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getVoieAdministration('fumee')">
                                    <span class="section-label">Fumée</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getVoieAdministration('ingeree')">
                                    <span class="section-label">Ingérée/bue</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getVoieAdministration('sniffee')">
                                    <span class="section-label">Sniffée</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getVoieAdministration('inhalee')">
                                    <span class="section-label">Inhalée</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getVoieAdministration('autre')">
                                    <span class="section-label">Autre</span>
                                    <span class="section-value">{{ getVoieAdministration('autrePrecision') || 'Oui' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Fréquence et partage -->
                        <div class="subsection">
                            <h4 class="subsection-title">Fréquence et partage</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.frequenceSubstancePrincipale">
                                    <span class="section-label">Fréquence substance principale</span>
                                    <span class="section-value">{{ getFrequenceSubstancePrincipale() }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.partageSeringues">
                                    <span class="section-label">Partage de seringues</span>
                                    <span class="section-value">{{ getPartageSeringues() }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Tests de dépistage -->
                        <div class="subsection">
                            <h4 class="subsection-title">Tests de dépistage</h4>
                            <div class="section-grid">
                                <!-- VIH -->
                                <div class="section-item" *ngIf="getTestRealise('testVih')">
                                    <span class="section-label">Test VIH réalisé</span>
                                    <span class="section-value">Oui, {{ getTestPeriode('testVih') }}</span>
                                </div>
                                <div class="section-item" *ngIf="getTestRealise('testVih') === false">
                                    <span class="section-label">Test VIH réalisé</span>
                                    <span class="section-value">Non</span>
                                </div>

                                <!-- VHC -->
                                <div class="section-item" *ngIf="getTestRealise('testVhc')">
                                    <span class="section-label">Test VHC réalisé</span>
                                    <span class="section-value">Oui, {{ getTestPeriode('testVhc') }}</span>
                                </div>
                                <div class="section-item" *ngIf="getTestRealise('testVhc') === false">
                                    <span class="section-label">Test VHC réalisé</span>
                                    <span class="section-value">Non</span>
                                </div>

                                <!-- VHB -->
                                <div class="section-item" *ngIf="getTestRealise('testVhb')">
                                    <span class="section-label">Test VHB réalisé</span>
                                    <span class="section-value">Oui, {{ getTestPeriode('testVhb') }}</span>
                                </div>
                                <div class="section-item" *ngIf="getTestRealise('testVhb') === false">
                                    <span class="section-label">Test VHB réalisé</span>
                                    <span class="section-value">Non</span>
                                </div>

                                <!-- Syphilis -->
                                <div class="section-item" *ngIf="getTestRealise('testSyphilis')">
                                    <span class="section-label">Test Syphilis réalisé</span>
                                    <span class="section-value">Oui, {{ getTestPeriode('testSyphilis') }}</span>
                                </div>
                                <div class="section-item" *ngIf="getTestRealise('testSyphilis') === false">
                                    <span class="section-label">Test Syphilis réalisé</span>
                                    <span class="section-value">Non</span>
                                </div>
                            </div>
                        </div>

                        <!-- Accompagnement sevrage -->
                        <div class="subsection">
                            <h4 class="subsection-title">Accompagnement sevrage</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.accompagnementSevrage !== null">
                                    <span class="section-label">Souhaite accompagnement sevrage</span>
                                    <span class="section-value">{{ formulaire.accompagnementSevrage ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.accompagnementSevrageNonRaison">
                                    <span class="section-label">Raison refus accompagnement</span>
                                    <span class="section-value">{{ formulaire.accompagnementSevrageNonRaison }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.tentativeSevrage !== null">
                                    <span class="section-label">Tentative sevrage antérieure</span>
                                    <span class="section-value">{{ formulaire.tentativeSevrage ? 'Oui' : 'Non' }}</span>
                                </div>
                            </div>

                            <!-- Modalités tentative sevrage -->
                            <div class="section-grid" *ngIf="formulaire.tentativeSevrageDetails">
                                <div class="section-item" *ngIf="getTentativeSevrage('toutSeul')">
                                    <span class="section-label">Tout seul</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTentativeSevrage('soutienFamille')">
                                    <span class="section-label">Avec soutien famille</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTentativeSevrage('soutienAmi')">
                                    <span class="section-label">Avec soutien ami</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTentativeSevrage('soutienScolaire')">
                                    <span class="section-label">Avec soutien scolaire</span>
                                    <span class="section-value">Oui</span>
                                </div>
                                <div class="section-item" *ngIf="getTentativeSevrage('structureSante')">
                                    <span class="section-label">Dans structure de santé</span>
                                    <span class="section-value">{{ getTentativeSevrage('structureSantePrecision') || 'Oui' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 5: Comorbidités -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">5. Comorbidités</h3>
                    </div>
                    <div class="card-body">
                        <!-- Comorbidités personnelles -->
                        <div class="subsection">
                            <h4 class="subsection-title">Comorbidités personnelles</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.comorbiditePsychiatriquePersonnelle !== null">
                                    <span class="section-label">Comorbidités psychiatriques</span>
                                    <span class="section-value">{{ formulaire.comorbiditePsychiatriquePersonnelle ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditePsychiatriquePersonnellePrecision">
                                    <span class="section-label">Précision comorbidités psychiatriques</span>
                                    <span class="section-value">{{ formulaire.comorbiditePsychiatriquePersonnellePrecision }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditeSomatiquePersonnelle !== null">
                                    <span class="section-label">Comorbidités somatiques</span>
                                    <span class="section-value">{{ formulaire.comorbiditeSomatiquePersonnelle ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditeSomatiquePersonnellePrecision">
                                    <span class="section-label">Précision comorbidités somatiques</span>
                                    <span class="section-value">{{ formulaire.comorbiditeSomatiquePersonnellePrecision }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Comorbidités des partenaires -->
                        <div class="subsection">
                            <h4 class="subsection-title">Comorbidités des partenaires</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.comorbiditePsychiatriquePartenaire !== null">
                                    <span class="section-label">Comorbidités psychiatriques</span>
                                    <span class="section-value">{{ formulaire.comorbiditePsychiatriquePartenaire ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditePsychiatriquePartenairePrecision">
                                    <span class="section-label">Précision comorbidités psychiatriques</span>
                                    <span class="section-value">{{ formulaire.comorbiditePsychiatriquePartenairePrecision }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditeSomatiquePartenaire !== null">
                                    <span class="section-label">Comorbidités somatiques</span>
                                    <span class="section-value">{{ formulaire.comorbiditeSomatiquePartenaire ? 'Oui' : 'Non' }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.comorbiditeSomatiquePartenairePrecision">
                                    <span class="section-label">Précision comorbidités somatiques</span>
                                    <span class="section-value">{{ formulaire.comorbiditeSomatiquePartenairePrecision }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Antécédents pénitentiaires -->
                        <div class="subsection">
                            <h4 class="subsection-title">Antécédents pénitentiaires</h4>
                            <div class="section-grid">
                                <div class="section-item" *ngIf="formulaire.nombreCondamnations">
                                    <span class="section-label">Nombre de condamnations</span>
                                    <span class="section-value">{{ formulaire.nombreCondamnations }}</span>
                                </div>
                                <div class="section-item" *ngIf="formulaire.dureeDetentionJours || formulaire.dureeDetentionMois || formulaire.dureeDetentionAnnees">
                                    <span class="section-label">Durée de détention</span>
                                    <span class="section-value">
                    {{ getDureeDetention() }}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 6: Décès induit par les SPA dans l'entourage -->
                <div class="formulaire-section card">
                    <div class="card-header">
                        <h3 class="section-title">6. Décès induit par les SPA dans l'entourage</h3>
                    </div>
                    <div class="card-body">
                        <div class="section-grid">
                            <div class="section-item" *ngIf="formulaire.nombreDecesSpaDansEntourage !== null">
                                <span class="section-label">Nombre de décès</span>
                                <span class="section-value">{{ formulaire.nombreDecesSpaDansEntourage }}</span>
                            </div>
                            <div class="section-item" *ngIf="formulaire.causesDecesSpaDansEntourage">
                                <span class="section-label">Causes des décès</span>
                                <span class="section-value">{{ formulaire.causesDecesSpaDansEntourage }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div *ngIf="!isLoading && !formulaire" class="error-container">
                <div class="error-message">
                    <h3>Formulaire non trouvé</h3>
                    <p>Le formulaire demandé n'a pas pu être trouvé.</p>
                    <button class="btn btn-primary" (click)="goBack()">Retour à la liste</button>
                </div>
            </div>

            <!-- Modal de confirmation de suppression -->
            <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
                <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">Confirmer la suppression</h3>
                    </div>
                    <div class="modal-body">
                        <p>
                            Êtes-vous sûr de vouloir supprimer le formulaire
                            <strong>{{ formulaire?.identifiantUnique }}</strong> ?
                        </p>
                        <p class="text-sm text-error">
                            Cette action est irréversible.
                        </p>
                    </div>
                    <div class="modal-actions">
                        <button
                                type="button"
                                class="btn btn-secondary"
                                (click)="closeDeleteModal()"
                                [disabled]="isDeleting"
                        >
                            Annuler
                        </button>
                        <button
                                type="button"
                                class="btn btn-danger"
                                (click)="deleteFormulaire()"
                                [disabled]="isDeleting"
                        >
                            <span *ngIf="!isDeleting">Supprimer</span>
                            <span *ngIf="isDeleting" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Suppression...
              </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .formulaire-detail-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-6);
            gap: var(--spacing-4);
        }

        .header-content {
            flex: 1;
        }

        .header-actions {
            display: flex;
            gap: var(--spacing-3);
        }

        .page-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--gray-900);
            margin: 0 0 var(--spacing-2) 0;
        }

        .page-description {
            color: var(--gray-600);
            font-size: 16px;
            margin: 0;
        }

        .formulaire-content {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-6);
        }

        .formulaire-header {
            margin-bottom: var(--spacing-6);
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--gray-900);
            margin: 0;
        }

        .subsection {
            margin-top: var(--spacing-6);
        }

        .subsection-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--gray-800);
            margin: 0 0 var(--spacing-4) 0;
            padding-bottom: var(--spacing-2);
            border-bottom: 1px solid var(--gray-200);
        }

        .info-grid, .section-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-4);
        }

        .info-item, .section-item {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-1);
        }

        .info-label, .section-label {
            font-size: 12px;
            font-weight: 500;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-value, .section-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--gray-900);
        }

        .formulaire-id,
        .code-patient {
            font-family: monospace;
            color: var(--primary-700);
            background-color: var(--primary-50);
            padding: var(--spacing-1) var(--spacing-2);
            border-radius: var(--radius-sm);
            display: inline-block;
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-12);
            gap: var(--spacing-4);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--gray-200);
            border-top: 3px solid var(--primary-600);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--spacing-12);
        }

        .error-message {
            text-align: center;
            max-width: 400px;
        }

        .error-message h3 {
            font-size: 24px;
            font-weight: 600;
            color: var(--gray-900);
            margin: 0 0 var(--spacing-4) 0;
        }

        .error-message p {
            color: var(--gray-600);
            margin: 0 0 var(--spacing-6) 0;
        }

        /* Modal styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: var(--spacing-4);
        }

        .modal-content {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-content.modal-sm {
            max-width: 400px;
        }

        .modal-header {
            padding: var(--spacing-6);
            border-bottom: 1px solid var(--gray-200);
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--gray-900);
            margin: 0;
        }

        .modal-body {
            padding: var(--spacing-6);
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: var(--spacing-3);
            padding: var(--spacing-6);
            border-top: 1px solid var(--gray-200);
        }

        .loading-spinner-sm {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
            .page-header {
                flex-direction: column;
                align-items: stretch;
            }

            .header-actions {
                flex-direction: column;
                width: 100%;
            }

            .info-grid,
            .section-grid {
                grid-template-columns: 1fr;
            }

            .modal-content {
                margin: var(--spacing-2);
                max-width: none;
            }
        }
    `]
})
export class FormulaireDetailComponent implements OnInit {
    formulaireId: number = 0;
    formulaire: any = null;
    isLoading: boolean = false;
    showDeleteModal: boolean = false;
    isDeleting: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formulaireService: FormulaireService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.formulaireId = +params['id'];
            if (this.formulaireId) {
                this.loadFormulaire();
            } else {
                this.router.navigate(['/mes-formulaires']);
            }
        });
    }

    loadFormulaire(): void {
        this.isLoading = true;

        this.formulaireService.getFormulaireById(this.formulaireId).subscribe({
            next: (data) => {
                this.formulaire = data;
                this.isLoading = false;
             },
            error: (error) => {
                console.error('Erreur lors du chargement du formulaire:', error);
                this.isLoading = false;
            }
        });
    }

    goBack(): void {
        if (this.formulaire && this.formulaire.patient) {
            this.router.navigate(['/mes-formulaires/patient', this.formulaire.patient.id]);
        } else {
            this.router.navigate(['/mes-formulaires']);
        }
    }

    canEdit(): boolean {
        if (!this.formulaire) return false;

        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) return false;

        // Super admin peut tout modifier
        if (this.authService.hasRole(UserRole.SUPER_ADMIN)) return true;

        // Admin structure peut modifier les formulaires de sa structure
        if (this.authService.hasRole(UserRole.ADMIN_STRUCTURE)) {
            return this.formulaire.structure.id === currentUser.structureId;
        }

        // Utilisateur ne peut modifier que ses propres formulaires
        if (this.authService.hasRole(UserRole.UTILISATEUR)) {
            return this.formulaire.utilisateur.id === currentUser.id;
        }

        return false;
    }

    canDelete(): boolean {
        // Mêmes permissions que pour l'édition
        return this.canEdit();
    }

    editFormulaire(): void {
        this.router.navigate(['/formulaire', 'edit', this.formulaireId]);
    }

    confirmDelete(): void {
        this.showDeleteModal = true;
    }

    closeDeleteModal(): void {
        this.showDeleteModal = false;
    }

    deleteFormulaire(): void {
        if (!this.formulaire) return;

        this.isDeleting = true;

        this.formulaireService.deleteFormulaire(this.formulaireId).subscribe({
            next: () => {
                this.isDeleting = false;
                this.router.navigate(['/mes-formulaires']);
            },
            error: (error) => {
                this.isDeleting = false;
                console.error('Erreur lors de la suppression du formulaire:', error);
                // TODO: Afficher un message d'erreur
            }
        });
    }

    // Méthodes d'aide pour l'affichage des données
    getCadreConsultation(field: string): any {
        if (!this.formulaire || !this.formulaire.cadreConsultation) return null;

        const cadreConsultation = typeof this.formulaire.cadreConsultation === 'string'
            ? JSON.parse(this.formulaire.cadreConsultation)
            : this.formulaire.cadreConsultation;

        return cadreConsultation[field];
    }

    getOrigineDemande(field: string): any {
        if (!this.formulaire || !this.formulaire.origineDemande) return null;

        const origineDemande = typeof this.formulaire.origineDemande === 'string'
            ? JSON.parse(this.formulaire.origineDemande)
            : this.formulaire.origineDemande;

        return origineDemande[field];
    }

    getTypeAlcool(field: string): any {
        if (!this.formulaire || !this.formulaire.typeAlcool) return null;

        const typeAlcool = typeof this.formulaire.typeAlcool === 'string'
            ? JSON.parse(this.formulaire.typeAlcool)
            : this.formulaire.typeAlcool;

        return typeAlcool[field];
    }

    getVoieAdministration(field: string): any {
        if (!this.formulaire || !this.formulaire.voieAdministration) return null;

        const voieAdministration = typeof this.formulaire.voieAdministration === 'string'
            ? JSON.parse(this.formulaire.voieAdministration)
            : this.formulaire.voieAdministration;

        return voieAdministration[field];
    }

    getTentativeSevrage(field: string): any {
        if (!this.formulaire || !this.formulaire.tentativeSevrageDetails) return null;

        const tentativeSevrageDetails = typeof this.formulaire.tentativeSevrageDetails === 'string'
            ? JSON.parse(this.formulaire.tentativeSevrageDetails)
            : this.formulaire.tentativeSevrageDetails;

        return tentativeSevrageDetails[field];
    }

    getTestRealise(testField: string): boolean | null {
        if (!this.formulaire || !this.formulaire[testField]) return null;

        const test = typeof this.formulaire[testField] === 'string'
            ? JSON.parse(this.formulaire[testField])
            : this.formulaire[testField];

        return test.realise;
    }

    getTestPeriode(testField: string): string {
        if (!this.formulaire || !this.formulaire[testField]) return '';

        const test = typeof this.formulaire[testField] === 'string'
            ? JSON.parse(this.formulaire[testField])
            : this.formulaire[testField];

        if (!test.periode) return '';

        switch (test.periode) {
            case '3_MOIS': return 'il y a 3 mois';
            case '6_MOIS': return 'il y a 6 mois';
            case '12_MOIS_PLUS': return 'il y a 12 mois ou plus';
            default: return test.periode;
        }
    }

    getSubstancesConsommees(): {label: string, precision?: string}[] {
        if (!this.formulaire || !this.formulaire.droguesActuelles) return [];

        const droguesActuelles = typeof this.formulaire.droguesActuelles === 'string'
            ? JSON.parse(this.formulaire.droguesActuelles)
            : this.formulaire.droguesActuelles;

        const substances: {label: string, precision?: string}[] = [];

        if (droguesActuelles.cannabis) substances.push({label: 'Cannabis'});
        if (droguesActuelles.opium) substances.push({label: 'Opium'});
        if (droguesActuelles.morphiniques) {
            substances.push({
                label: 'Morphiniques',
                precision: droguesActuelles.morphiniquesPrecision
            });
        }
        if (droguesActuelles.heroine) substances.push({label: 'Héroïne'});
        if (droguesActuelles.cocaine) substances.push({label: 'Cocaïne'});
        if (droguesActuelles.hypnotiques) {
            substances.push({
                label: 'Hypnotiques',
                precision: droguesActuelles.hypnotiquesPrecision
            });
        }
        if (droguesActuelles.amphetamines) substances.push({label: 'Amphétamines'});
        if (droguesActuelles.ecstasy) substances.push({label: 'Ecstasy'});
        if (droguesActuelles.produitsInhaler) substances.push({label: 'Produits à inhaler'});
        if (droguesActuelles.pregabaline) substances.push({label: 'Prégabaline'});
        if (droguesActuelles.ketamines) substances.push({label: 'Kétamine'});
        if (droguesActuelles.lsd) substances.push({label: 'LSD'});
        if (droguesActuelles.autre) {
            substances.push({
                label: 'Autre',
                precision: droguesActuelles.autrePrecision
            });
        }

        return substances;
    }

    getSituationFamiliale(): string {
        if (!this.formulaire || !this.formulaire.situationFamiliale) return '';

        switch (this.formulaire.situationFamiliale) {
            case 'CELIBATAIRE': return 'Célibataire';
            case 'MARIE': return 'Marié(e)';
            case 'DIVORCE': return 'Divorcé(e)';
            case 'SEPARE': return 'Séparé(e)';
            case 'VEUF': return 'Veuf/Veuve';
            case 'AUTRE': return this.formulaire.situationFamilialeAutre || 'Autre';
            default: return this.formulaire.situationFamiliale;
        }
    }

    getLogement30Jours(): string {
        if (!this.formulaire || !this.formulaire.logement30Jours) return '';

        switch (this.formulaire.logement30Jours) {
            case 'SEUL': return 'Seul';
            case 'FAMILLE_ORIGINE': return 'Famille d\'origine';
            case 'PARTENAIRE': return 'Avec partenaire';
            case 'ENFANTS': return 'Avec enfants';
            case 'AMIS': return 'Avec amis';
            case 'INTERNAT': return 'Internat';
            case 'COLOCATION': return 'Colocation';
            case 'FOYER': return 'Foyer';
            case 'DETENTION': return 'Détention';
            case 'CENTRE_JEUNESSE': return 'Centre jeunesse';
            case 'INSTITUTION': return 'Institution';
            case 'AUTRE': return this.formulaire.logement30JoursAutre || 'Autre';
            default: return this.formulaire.logement30Jours;
        }
    }

    getProfession(): string {
        if (!this.formulaire || !this.formulaire.profession) return '';

        switch (this.formulaire.profession) {
            case 'EMPLOYE': return 'Employé';
            case 'COMPTE_PROPRE': return 'À son compte';
            case 'JOURNALIER': return 'Journalier';
            case 'SPORTIF': return 'Sportif';
            case 'CHOMAGE': return 'Chômage';
            case 'ELEVE': return 'Élève';
            case 'ETUDIANT': return 'Étudiant';
            case 'FORMATION': return 'En formation';
            case 'RETRAITE': return 'Retraité';
            case 'SANS_RESSOURCES': return 'Sans ressources';
            default: return this.formulaire.profession;
        }
    }

    getNiveauScolaire(): string {
        if (!this.formulaire || !this.formulaire.niveauScolaire) return '';

        switch (this.formulaire.niveauScolaire) {
            case 'ANALPHABETE': return 'Analphabète';
            case 'PRESCOLAIRE': return 'Préscolaire';
            case 'PRIMAIRE': return 'Primaire';
            case 'COLLEGE': return 'Collège';
            case 'SECONDAIRE': return 'Secondaire';
            case 'FORMATION_PROF': return 'Formation professionnelle';
            case 'UNIVERSITAIRE': return 'Universitaire';
            default: return this.formulaire.niveauScolaire;
        }
    }

    getConsommationTabac(): string {
        if (!this.formulaire || !this.formulaire.consommationTabac) return '';

        switch (this.formulaire.consommationTabac) {
            case 'FUMEUR': return 'Fumeur';
            case 'NON_FUMEUR': return 'Non-fumeur';
            case 'EX_FUMEUR': return 'Ex-fumeur';
            default: return this.formulaire.consommationTabac;
        }
    }

    getFrequenceTabac(): string {
        if (!this.formulaire || !this.formulaire.frequenceTabac30Jours) return '';

        switch (this.formulaire.frequenceTabac30Jours) {
            case 'QUOTIDIEN': return 'Quotidiennement';
            case '2_3_JOURS': return '2 à 3 jours par semaine';
            case 'HEBDOMADAIRE': return 'Une fois par semaine ou moins';
            case 'OCCASIONNEL': return 'Occasionnellement';
            default: return this.formulaire.frequenceTabac30Jours;
        }
    }

    getSoinsSevrageTabac(): string {
        if (!this.formulaire || !this.formulaire.soinsSevrageTabac) return '';

        switch (this.formulaire.soinsSevrageTabac) {
            case 'OUI_SATISFAIT': return 'Oui, satisfait';
            case 'OUI_NON_SATISFAIT': return 'Oui, non satisfait';
            case 'NON': return 'Non';
            default: return this.formulaire.soinsSevrageTabac;
        }
    }

    getFrequenceAlcool(): string {
        if (!this.formulaire || !this.formulaire.frequenceAlcool30Jours) return '';

        switch (this.formulaire.frequenceAlcool30Jours) {
            case 'QUOTIDIEN': return 'Quotidiennement';
            case '2_3_JOURS': return '2 à 3 jours par semaine';
            case 'HEBDOMADAIRE': return 'Une fois par semaine ou moins';
            case 'OCCASIONNEL': return 'Occasionnellement';
            default: return this.formulaire.frequenceAlcool30Jours;
        }
    }

    getFrequenceSubstancePrincipale(): string {
        if (!this.formulaire || !this.formulaire.frequenceSubstancePrincipale) return '';

        switch (this.formulaire.frequenceSubstancePrincipale) {
            case 'DEUX_FOIS_PLUS_PAR_JOUR': return '2 fois ou plus par jour';
            case 'UNE_FOIS_PAR_JOUR': return 'Une fois par jour';
            case 'DEUX_TROIS_JOURS_SEMAINE': return '2 à 3 jours par semaine';
            case 'UNE_FOIS_SEMAINE': return 'Une fois par semaine';
            case 'OCCASIONNEL_FESTIF': return 'Occasionnellement (usage festif)';
            default: return this.formulaire.frequenceSubstancePrincipale;
        }
    }

    getPartageSeringues(): string {
        if (!this.formulaire || !this.formulaire.partageSeringues) return '';

        switch (this.formulaire.partageSeringues) {
            case 'JAMAIS_PARTAGE': return 'N\'a jamais partagé de seringue';
            case 'INFERIEUR_1_MOIS': return 'Inférieur à un mois';
            case 'ENTRE_1_3_MOIS': return 'Entre 1 mois et 3 mois';
            case 'ENTRE_3_6_MOIS': return 'Entre 3 mois et 6 mois';
            case 'ENTRE_6_12_MOIS': return 'Entre 6 mois et 12 mois';
            case 'DOUZE_MOIS_PLUS': return '12 mois ou plus';
            default: return this.formulaire.partageSeringues;
        }
    }

    getDureeDetention(): string {
        if (!this.formulaire) return '';

        const jours = this.formulaire.dureeDetentionJours || 0;
        const mois = this.formulaire.dureeDetentionMois || 0;
        const annees = this.formulaire.dureeDetentionAnnees || 0;

        const parts = [];
        if (annees > 0) parts.push(`${annees} an${annees > 1 ? 's' : ''}`);
        if (mois > 0) parts.push(`${mois} mois`);
        if (jours > 0) parts.push(`${jours} jour${jours > 1 ? 's' : ''}`);

        return parts.length > 0 ? parts.join(', ') : 'Non spécifiée';
    }
}
