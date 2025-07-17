import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 4 : Comportements liés à la consommation des SPA et tests de dépistage VIH, VHC et VHB</h2>
        <p class="step-description">
          Informations sur les modes de consommation et les tests de dépistage
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Question 27 - Voie d'administration -->
          <div class="form-section">
            <h3 class="section-title">Voie d'administration habituelle (substance principale)</h3>

            <!-- Question 27.1 -->
            <div class="form-group">
              <label class="form-label">27.1) Injectée</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieInjectee"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.injectee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieInjectee"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.injectee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 27.2 -->
            <div class="form-group">
              <label class="form-label">27.2) Fumée</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieFumee"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.fumee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieFumee"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.fumee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 27.3 -->
            <div class="form-group">
              <label class="form-label">27.3) Ingérée/bue</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieIngeree"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.ingeree"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieIngeree"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.ingeree"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 27.4 -->
            <div class="form-group">
              <label class="form-label">27.4) Sniffée</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieSniffee"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.sniffee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieSniffee"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.sniffee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 27.5 -->
            <div class="form-group">
              <label class="form-label">27.5) Inhalée</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieInhalee"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.inhalee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieInhalee"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.inhalee"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 27.6 -->
            <div class="form-group">
              <label class="form-label">27.6) Autre</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieAutre"
                      [value]="true"
                      [(ngModel)]="localData.voieAdministration!.autre"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="voieAutre"
                      [value]="false"
                      [(ngModel)]="localData.voieAdministration!.autre"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>

              <!-- Question 27.a -->
              <div class="conditional-field" *ngIf="localData.voieAdministration!.autre === true">
                <label class="form-label required">27.a) Si autre, préciser</label>
                <input
                    type="text"
                    class="form-input"
                    [class.error]="showValidationErrors && !localData.voieAdministration!.autrePrecision"
                    [(ngModel)]="localData.voieAdministration!.autrePrecision"
                    name="voieAutrePrecision"
                    placeholder="Préciser la voie d'administration"
                    (input)="onFieldChange()"
                >
                <div *ngIf="showValidationErrors && !localData.voieAdministration!.autrePrecision" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>
          </div>

          <!-- Question 28 - Fréquence de consommation -->
          <div class="form-section">
            <h3 class="section-title">Fréquence de consommation de la substance principale</h3>

            <div class="form-group">
              <label class="form-label">28) Fréquence de consommation de la substance principale</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.frequenceSubstancePrincipale === 'DEUX_FOIS_PLUS_PAR_JOUR'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceSubstancePrincipale === 'DEUX_FOIS_PLUS_PAR_JOUR'"
                      (change)="selectFrequenceSubstance('DEUX_FOIS_PLUS_PAR_JOUR')"
                  >
                  <span class="checkbox-text">1. 2 fois (/doses) ou plus par jour</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceSubstancePrincipale === 'UNE_FOIS_PAR_JOUR'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceSubstancePrincipale === 'UNE_FOIS_PAR_JOUR'"
                      (change)="selectFrequenceSubstance('UNE_FOIS_PAR_JOUR')"
                  >
                  <span class="checkbox-text">2. Une fois (dose) par jour</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceSubstancePrincipale === 'DEUX_TROIS_JOURS_SEMAINE'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceSubstancePrincipale === 'DEUX_TROIS_JOURS_SEMAINE'"
                      (change)="selectFrequenceSubstance('DEUX_TROIS_JOURS_SEMAINE')"
                  >
                  <span class="checkbox-text">3. 2 à 3 jours par semaine</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceSubstancePrincipale === 'UNE_FOIS_SEMAINE'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceSubstancePrincipale === 'UNE_FOIS_SEMAINE'"
                      (change)="selectFrequenceSubstance('UNE_FOIS_SEMAINE')"
                  >
                  <span class="checkbox-text">4. Une fois par semaine</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceSubstancePrincipale === 'OCCASIONNEL_FESTIF'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceSubstancePrincipale === 'OCCASIONNEL_FESTIF'"
                      (change)="selectFrequenceSubstance('OCCASIONNEL_FESTIF')"
                  >
                  <span class="checkbox-text">5. Occasionnellement (usage festif)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Question 29 - Partage de seringues -->
          <div class="form-section">
            <h3 class="section-title">Notion de partage de seringues</h3>

            <div class="form-group">
              <label class="form-label">29) Notion de partage de seringues pendant la période précédente ?</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'JAMAIS_PARTAGE'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'JAMAIS_PARTAGE'"
                      (change)="selectPartageSeringues('JAMAIS_PARTAGE')"
                  >
                  <span class="checkbox-text">1. N'a jamais partagé de seringue</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'INFERIEUR_1_MOIS'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'INFERIEUR_1_MOIS'"
                      (change)="selectPartageSeringues('INFERIEUR_1_MOIS')"
                  >
                  <span class="checkbox-text">2. Inférieur à un mois</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'ENTRE_1_3_MOIS'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'ENTRE_1_3_MOIS'"
                      (change)="selectPartageSeringues('ENTRE_1_3_MOIS')"
                  >
                  <span class="checkbox-text">3. Entre 1 mois et 3 mois</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'ENTRE_3_6_MOIS'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'ENTRE_3_6_MOIS'"
                      (change)="selectPartageSeringues('ENTRE_3_6_MOIS')"
                  >
                  <span class="checkbox-text">4. Entre 3 mois et 6 mois</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'ENTRE_6_12_MOIS'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'ENTRE_6_12_MOIS'"
                      (change)="selectPartageSeringues('ENTRE_6_12_MOIS')"
                  >
                  <span class="checkbox-text">5. Entre 6 mois et 12 mois</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.partageSeringues === 'DOUZE_MOIS_PLUS'">
                  <input
                      type="checkbox"
                      [checked]="localData.partageSeringues === 'DOUZE_MOIS_PLUS'"
                      (change)="selectPartageSeringues('DOUZE_MOIS_PLUS')"
                  >
                  <span class="checkbox-text">6. 12 mois ou plus</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Question 30 - Tests de dépistage -->
          <div class="form-section">
            <h3 class="section-title">Tests de dépistage</h3>

            <!-- Test VIH -->
            <div class="form-group">
              <h4 class="test-title">Test VIH</h4>

              <!-- Question 30.a.1 -->
              <div class="form-group">
                <label class="form-label">30.a.1) Test réalisé</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVihRealise"
                        [value]="true"
                        [(ngModel)]="localData.testVih!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVihRealise"
                        [value]="false"
                        [(ngModel)]="localData.testVih!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 30.a.2 -->
              <div class="conditional-field" *ngIf="localData.testVih!.realise === true">
                <label class="form-label required">30.a.2) Si oui, date du test</label>
                <div class="checkbox-options">
                  <label class="checkbox-option" [class.selected]="localData.testVih!.periode === '3_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVih!.periode === '3_MOIS'"
                        (change)="selectPeriodeTestVih('3_MOIS')"
                    >
                    <span class="checkbox-text">1. 3 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVih!.periode === '6_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVih!.periode === '6_MOIS'"
                        (change)="selectPeriodeTestVih('6_MOIS')"
                    >
                    <span class="checkbox-text">2. 6 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVih!.periode === '12_MOIS_PLUS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVih!.periode === '12_MOIS_PLUS'"
                        (change)="selectPeriodeTestVih('12_MOIS_PLUS')"
                    >
                    <span class="checkbox-text">3. 12 mois ou plus</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.testVih!.periode" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>

            <!-- Test VHC -->
            <div class="form-group">
              <h4 class="test-title">Test VHC</h4>

              <!-- Question 30.b.1 -->
              <div class="form-group">
                <label class="form-label">30.b.1) Test réalisé</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVhcRealise"
                        [value]="true"
                        [(ngModel)]="localData.testVhc!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVhcRealise"
                        [value]="false"
                        [(ngModel)]="localData.testVhc!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 30.b.2 -->
              <div class="conditional-field" *ngIf="localData.testVhc!.realise === true">
                <label class="form-label required">30.b.2) Si oui, date du test</label>
                <div class="checkbox-options">
                  <label class="checkbox-option" [class.selected]="localData.testVhc!.periode === '3_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhc!.periode === '3_MOIS'"
                        (change)="selectPeriodeTestVhc('3_MOIS')"
                    >
                    <span class="checkbox-text">1. 3 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVhc!.periode === '6_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhc!.periode === '6_MOIS'"
                        (change)="selectPeriodeTestVhc('6_MOIS')"
                    >
                    <span class="checkbox-text">2. 6 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVhc!.periode === '12_MOIS_PLUS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhc!.periode === '12_MOIS_PLUS'"
                        (change)="selectPeriodeTestVhc('12_MOIS_PLUS')"
                    >
                    <span class="checkbox-text">3. 12 mois ou plus</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.testVhc!.periode" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>

            <!-- Test VHB -->
            <div class="form-group">
              <h4 class="test-title">Test VHB</h4>

              <!-- Question 30.c.1 -->
              <div class="form-group">
                <label class="form-label">30.c.1) Test réalisé</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVhbRealise"
                        [value]="true"
                        [(ngModel)]="localData.testVhb!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testVhbRealise"
                        [value]="false"
                        [(ngModel)]="localData.testVhb!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 30.c.2 -->
              <div class="conditional-field" *ngIf="localData.testVhb!.realise === true">
                <label class="form-label required">30.c.2) Si oui, date du test</label>
                <div class="checkbox-options">
                  <label class="checkbox-option" [class.selected]="localData.testVhb!.periode === '3_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhb!.periode === '3_MOIS'"
                        (change)="selectPeriodeTestVhb('3_MOIS')"
                    >
                    <span class="checkbox-text">1. 3 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVhb!.periode === '6_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhb!.periode === '6_MOIS'"
                        (change)="selectPeriodeTestVhb('6_MOIS')"
                    >
                    <span class="checkbox-text">2. 6 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testVhb!.periode === '12_MOIS_PLUS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testVhb!.periode === '12_MOIS_PLUS'"
                        (change)="selectPeriodeTestVhb('12_MOIS_PLUS')"
                    >
                    <span class="checkbox-text">3. 12 mois ou plus</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.testVhb!.periode" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>

            <!-- Test Syphilis -->
            <div class="form-group">
              <h4 class="test-title">Test du Syphilis (il est déjà pratiqué aux CCDAG)</h4>

              <!-- Question 30.d.1 -->
              <div class="form-group">
                <label class="form-label">30.d.1) Test réalisé</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testSyphilisRealise"
                        [value]="true"
                        [(ngModel)]="localData.testSyphilis!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="testSyphilisRealise"
                        [value]="false"
                        [(ngModel)]="localData.testSyphilis!.realise"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 30.d.2 -->
              <div class="conditional-field" *ngIf="localData.testSyphilis!.realise === true">
                <label class="form-label required">30.d.2) Si oui, date du test</label>
                <div class="checkbox-options">
                  <label class="checkbox-option" [class.selected]="localData.testSyphilis!.periode === '3_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testSyphilis!.periode === '3_MOIS'"
                        (change)="selectPeriodeTestSyphilis('3_MOIS')"
                    >
                    <span class="checkbox-text">1. 3 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testSyphilis!.periode === '6_MOIS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testSyphilis!.periode === '6_MOIS'"
                        (change)="selectPeriodeTestSyphilis('6_MOIS')"
                    >
                    <span class="checkbox-text">2. 6 mois</span>
                  </label>
                  <label class="checkbox-option" [class.selected]="localData.testSyphilis!.periode === '12_MOIS_PLUS'">
                    <input
                        type="checkbox"
                        [checked]="localData.testSyphilis!.periode === '12_MOIS_PLUS'"
                        (change)="selectPeriodeTestSyphilis('12_MOIS_PLUS')"
                    >
                    <span class="checkbox-text">3. 12 mois ou plus</span>
                  </label>
                </div>
                <div *ngIf="showValidationErrors && !localData.testSyphilis!.periode" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>
          </div>

          <!-- Question 31 - Accompagnement sevrage -->
          <div class="form-section">
            <h3 class="section-title">Accompagnement pour le sevrage</h3>

            <div class="form-group">
              <label class="form-label">31) Est-ce que vous souhaitez avoir un accompagnement en vue d'un sevrage ?</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="accompagnementSevrage"
                      [value]="true"
                      [(ngModel)]="localData.accompagnementSevrage"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="accompagnementSevrage"
                      [value]="false"
                      [(ngModel)]="localData.accompagnementSevrage"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 32a -->
            <div class="conditional-field" *ngIf="localData.accompagnementSevrage === false">
              <label class="form-label required">32.a) Si non, pourquoi</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.accompagnementSevrageNonRaison"
                  [(ngModel)]="localData.accompagnementSevrageNonRaison"
                  name="accompagnementSevrageNonRaison"
                  placeholder="Préciser les raisons"
                  rows="3"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && !localData.accompagnementSevrageNonRaison" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>
          </div>

          <!-- Question 33 - Tentative de sevrage -->
          <div class="form-section">
            <h3 class="section-title">Tentative de sevrage</h3>

            <div class="form-group">
              <label class="form-label">33) Est-ce que vous avez déjà tenté le sevrage ?</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="tentativeSevrage"
                      [value]="true"
                      [(ngModel)]="localData.tentativeSevrage"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="tentativeSevrage"
                      [value]="false"
                      [(ngModel)]="localData.tentativeSevrage"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Si oui, modalités -->
            <div class="conditional-field" *ngIf="localData.tentativeSevrage === true">
              <h4 class="subsection-title">Si oui, modalités de la tentative de sevrage</h4>

              <!-- Question 33.1 -->
              <div class="form-group">
                <label class="form-label">33.1) Tout seul</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="toutSeul"
                        [value]="true"
                        [(ngModel)]="localData.tentativeSevrageDetails!.toutSeul"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="toutSeul"
                        [value]="false"
                        [(ngModel)]="localData.tentativeSevrageDetails!.toutSeul"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 33.2 -->
              <div class="form-group">
                <label class="form-label">33.2) Avec le soutien de la famille</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienFamille"
                        [value]="true"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienFamille"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienFamille"
                        [value]="false"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienFamille"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 33.3 -->
              <div class="form-group">
                <label class="form-label">33.3) Avec le soutien d'un ami</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienAmi"
                        [value]="true"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienAmi"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienAmi"
                        [value]="false"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienAmi"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 33.4 -->
              <div class="form-group">
                <label class="form-label">33.4) Avec un soutien scolaire</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienScolaire"
                        [value]="true"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienScolaire"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="soutienScolaire"
                        [value]="false"
                        [(ngModel)]="localData.tentativeSevrageDetails!.soutienScolaire"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Question 33.5 -->
              <div class="form-group">
                <label class="form-label">33.5) Dans une structure de santé</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="structureSante"
                        [value]="true"
                        [(ngModel)]="localData.tentativeSevrageDetails!.structureSante"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="structureSante"
                        [value]="false"
                        [(ngModel)]="localData.tentativeSevrageDetails!.structureSante"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <!-- Question 33.a -->
                <div class="conditional-field nested" *ngIf="localData.tentativeSevrageDetails!.structureSante === true">
                  <label class="form-label required">33.a) Si 33.5 oui, laquelle</label>
                  <textarea
                      class="form-input"
                      [class.error]="showValidationErrors && !localData.tentativeSevrageDetails!.structureSantePrecision"
                      [(ngModel)]="localData.tentativeSevrageDetails!.structureSantePrecision"
                      name="structureSantePrecision"
                      placeholder="Préciser la structure de santé"
                      rows="3"
                      (input)="onFieldChange()"
                  ></textarea>
                  <div *ngIf="showValidationErrors && !localData.tentativeSevrageDetails!.structureSantePrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .step-container {
      margin-bottom: var(--spacing-6);
    }

    .step-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-2) 0;
    }

    .step-description {
      color: var(--gray-600);
      margin: 0;
    }

    .form-section {
      margin-bottom: var(--spacing-8);
    }

    .form-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-6) 0;
      padding-bottom: var(--spacing-3);
      border-bottom: 2px solid var(--primary-200);
    }

    .subsection-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 var(--spacing-4) 0;
    }

    .test-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 var(--spacing-3) 0;
      padding-bottom: var(--spacing-2);
      border-bottom: 1px solid var(--gray-300);
    }

    .form-group {
      margin-bottom: var(--spacing-6);
    }

    .conditional-field {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 3px solid var(--primary-200);
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
    }

    .conditional-field.nested {
      margin-left: var(--spacing-8);
      border-left-color: var(--primary-300);
      background-color: var(--primary-50);
    }

    .checkbox-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .checkbox-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      cursor: pointer;
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: all 0.2s ease-in-out;
      border: 1px solid transparent;
    }

    .checkbox-option:hover {
      background-color: var(--gray-100);
    }

    .checkbox-option.selected {
      background-color: var(--primary-50);
      border-color: var(--primary-300);
    }

    .checkbox-option input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .checkbox-text {
      font-weight: 500;
      color: var(--gray-700);
    }

    .radio-options {
      display: flex;
      gap: var(--spacing-6);
      flex-wrap: wrap;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      cursor: pointer;
    }

    .radio-option input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
    }

    .radio-text {
      font-weight: 500;
      color: var(--gray-700);
    }

    .form-input.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .form-error {
      margin-top: var(--spacing-2);
      font-size: 12px;
      color: var(--error-500);
      font-weight: 500;
    }

    .form-input[rows] {
      resize: vertical;
      min-height: 80px;
    }

    @media (max-width: 768px) {
      .conditional-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }

      .conditional-field.nested {
        margin-left: var(--spacing-4);
      }

      .radio-options {
        flex-direction: column;
        gap: var(--spacing-3);
      }
    }
  `]
})
export class Step4Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};
  showValidationErrors = false;

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.localData = {
      ...this.data,
      voieAdministration: this.data.voieAdministration || {},
      testVih: this.data.testVih || {},
      testVhc: this.data.testVhc || {},
      testVhb: this.data.testVhb || {},
      testSyphilis: this.data.testSyphilis || {},
      tentativeSevrageDetails: this.data.tentativeSevrageDetails || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  selectFrequenceSubstance(frequence: string): void {
    this.localData.frequenceSubstancePrincipale = frequence as any;
    this.onFieldChange();
  }

  selectPartageSeringues(partage: string): void {
    this.localData.partageSeringues = partage as any;
    this.onFieldChange();
  }

  selectPeriodeTestVih(periode: string): void {
    this.localData.testVih!.periode = periode as any;
    this.onFieldChange();
  }

  selectPeriodeTestVhc(periode: string): void {
    this.localData.testVhc!.periode = periode as any;
    this.onFieldChange();
  }

  selectPeriodeTestVhb(periode: string): void {
    this.localData.testVhb!.periode = periode as any;
    this.onFieldChange();
  }

  selectPeriodeTestSyphilis(periode: string): void {
    this.localData.testSyphilis!.periode = periode as any;
    this.onFieldChange();
  }


  private validateStep(): void {
    let isValid = true;

    // Validation pour "autre" voie d'administration
    if (this.localData.voieAdministration?.autre === true &&
        (!this.localData.voieAdministration?.autrePrecision ||
            this.localData.voieAdministration?.autrePrecision.trim() === '')) {
      isValid = false;
    }

    // Validation pour les tests de dépistage
    if (this.localData.testVih?.realise === true && !this.localData.testVih?.periode) {
      isValid = false;
    }
    if (this.localData.testVhc?.realise === true && !this.localData.testVhc?.periode) {
      isValid = false;
    }
    if (this.localData.testVhb?.realise === true && !this.localData.testVhb?.periode) {
      isValid = false;
    }
    if (this.localData.testSyphilis?.realise === true && !this.localData.testSyphilis?.periode) {
      isValid = false;
    }

    // Validation pour accompagnement sevrage
    if (this.localData.accompagnementSevrage === false &&
        (!this.localData.accompagnementSevrageNonRaison ||
            this.localData.accompagnementSevrageNonRaison.trim() === '')) {
      isValid = false;
    }

    // Validation pour structure de santé
    if (this.localData.tentativeSevrageDetails?.structureSante === true &&
        (!this.localData.tentativeSevrageDetails?.structureSantePrecision ||
            this.localData.tentativeSevrageDetails?.structureSantePrecision.trim() === '')) {
      isValid = false;
    }

    this.validationChange.emit(isValid);
  }
}
