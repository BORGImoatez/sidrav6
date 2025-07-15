import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FormulaireData} from "../../../models/formulaire.model";

// Liste des options pour les hypnotiques
const HYPNOTIQUES_OPTIONS = [
  'LD barbiturique détournés',
  'Benzodiazépine détournés',
  'Antiparkinsonien',
  'Temesta',
  'Lexomil',
  'Lysanxia',
  'Tranxene',
  'Artane',
  'Parkisol',
  'Autre'
];

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 3 : Consommation de substances psychoactives</h2>
        <p class="step-description">
          Consommation de substances psychoactives (en dehors de tabac et l'alcool) et autres comportements addictifs
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Question 19 -->
          <div class="form-group">
            <label class="form-label required">19) Consommation de SPA dans l'entourage</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="consommationSpaEntourage"
                    [value]="true"
                    [(ngModel)]="localData.consommationSpaEntourage"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="consommationSpaEntourage"
                    [value]="false"
                    [(ngModel)]="localData.consommationSpaEntourage"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.consommationSpaEntourage === undefined" class="form-error">
              Ce champ est obligatoire
            </div>
          </div>

          <!-- Question 20 -->
          <div class="form-group conditional-field" *ngIf="localData.consommationSpaEntourage === true">
            <label class="form-label required">20) Si consommation de SPA dans l'entourage oui</label>

            <div class="sub-question">
              <label class="form-label">1. Membre(s) de la famille</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMembresFamille"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.membresFamille"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMembresFamille"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.membresFamille"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <div class="sub-question">
              <label class="form-label">2. Ami(e)s</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageAmis"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.amis"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageAmis"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.amis"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <div class="sub-question">
              <label class="form-label">3. Milieu professionnel</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuProfessionnel"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.milieuProfessionnel"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuProfessionnel"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.milieuProfessionnel"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <div class="sub-question">
              <label class="form-label">4. Milieu sportif</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuSportif"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.milieuSportif"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuSportif"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.milieuSportif"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <div class="sub-question">
              <label class="form-label">5. Milieu scolaire et universitaire</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuScolaire"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.milieuScolaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageMilieuScolaire"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.milieuScolaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <div class="sub-question">
              <label class="form-label">6. Autre</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageAutre"
                      [value]="true"
                      [(ngModel)]="localData.entourageSpa!.autre"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="entourageAutre"
                      [value]="false"
                      [(ngModel)]="localData.entourageSpa!.autre"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>

              <div class="nested" *ngIf="localData.entourageSpa!.autre === true">
                <label class="form-label required">20.a) Si autre, préciser</label>
                <input
                    type="text"
                    class="form-input"
                    [class.error]="showValidationErrors && !localData.entourageSpa!.autrePrecision"
                    [(ngModel)]="localData.entourageSpa!.autrePrecision"
                    name="entourageAutrePrecision"
                    placeholder="Préciser"
                    (input)="onFieldChange()"
                >
                <div *ngIf="showValidationErrors && !localData.entourageSpa!.autrePrecision" class="form-error">
                  Ce champ est obligatoire
                </div>
              </div>
            </div>
          </div>

          <!-- Question 21 -->
          <div class="form-group conditional-field" *ngIf="localData.consommationSpaEntourage === true">
            <label class="form-label required">21) Type de SPA consommées dans l'entourage</label>

            <div class="spa-list">
              <div class="spa-item">
                <label class="form-label">1. Tabac</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageTabac"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.tabac"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageTabac"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.tabac"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">2. Alcool</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageAlcool"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.alcool"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageAlcool"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.alcool"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">3. Cannabis</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageCannabis"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageCannabis"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">4. Opium</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageOpium"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.opium"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageOpium"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.opium"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">5. Les morphiniques de synthèse (Subutex…)</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageMorphiniques"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.morphiniques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageMorphiniques"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.morphiniques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.typeSpaEntourage!.morphiniques === true">
                  <label class="form-label required">5.a) Si oui, préciser la substance</label>
                  <select
                      class="form-select"
                      [class.error]="showValidationErrors && !localData.typeSpaEntourage!.morphiniquesPrecision"
                      [(ngModel)]="localData.typeSpaEntourage!.morphiniquesPrecision"
                      name="entourageMorphiniquesPrecision"
                      (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Subutex">Subutex</option>
                    <option value="Méthadone">Méthadone</option>
                    <option value="Tramal">Tramal</option>
                    <option value="Coalgésic">Coalgésic</option>
                    <option value="Fentanyl">Fentanyl</option>
                  </select>
                  <div *ngIf="showValidationErrors && !localData.typeSpaEntourage!.morphiniquesPrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">6. Héroïne</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageHeroine"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.heroine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageHeroine"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.heroine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">7. Cocaïne</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageCocaine"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.cocaine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageCocaine"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.cocaine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">8. Hypnotiques & sédatifs</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageHypnotiques"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.hypnotiques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageHypnotiques"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.hypnotiques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
                <div class="nested" *ngIf="localData.typeSpaEntourage!.hypnotiques === true">
                  <label class="form-label required">Type d'hypnotiques & sédatifs</label>
                  <select
                      class="form-select"
                      [(ngModel)]="localData.typeSpaEntourage!.hypnotiquesPrecision"
                      name="hypnotiquesPrecision"
                      (change)="onFieldChange()"
                      [class.error]="showValidationErrors && !localData.typeSpaEntourage!.hypnotiquesPrecision"
                  >
                    <option value="">Sélectionner un type</option>
                    <option *ngFor="let option of hypnotiquesOptions" [value]="option">{{ option }}</option>
                  </select>

                  <!-- Champ de saisie pour "Autre" -->
                  <div *ngIf="localData.typeSpaEntourage!.hypnotiquesPrecision === 'Autre'" class="form-group nested mt-4">
                    <label class="form-label required">Préciser</label>
                    <input
                        type="text"
                        class="form-input"
                        [class.error]="showValidationErrors && !localData.typeSpaEntourage!.hypnotiquesAutrePrecision"
                        [(ngModel)]="localData.typeSpaEntourage!.hypnotiquesAutrePrecision"
                        name="hypnotiquesAutrePrecision"
                        placeholder="(il est fort apprécié d'indiquer la substance utilisée comme la prononce l'utilisateur)"
                        (input)="onFieldChange()"
                    >
                    <div *ngIf="showValidationErrors && !localData.typeSpaEntourage!.hypnotiquesAutrePrecision" class="form-error">
                      Ce champ est obligatoire
                    </div>
                  </div>
                </div>
                
              </div>

              <div class="spa-item">
                <label class="form-label">9. Amphétamines</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageAmphetamines"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.amphetamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageAmphetamines"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.amphetamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">10. Ecstasy</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageEcstasy"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.ecstasy"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageEcstasy"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.ecstasy"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">11. Produits à inhaler (colle, solvants)</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageProduitsInhaler"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.produitsInhaler"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageProduitsInhaler"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.produitsInhaler"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">12. Prégabaline</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entouragePregabaline"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.pregabaline"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entouragePregabaline"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.pregabaline"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">13. Kétamines</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageKetamines"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.ketamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageKetamines"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.ketamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">14. LSD</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageLsd"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.lsd"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageLsd"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.lsd"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">15. Autre</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageSpaAutre"
                        [value]="true"
                        [(ngModel)]="localData.typeSpaEntourage!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="entourageSpaAutre"
                        [value]="false"
                        [(ngModel)]="localData.typeSpaEntourage!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.typeSpaEntourage!.autre === true">
                  <label class="form-label required">21.a) Si autre, préciser</label>
                  <input
                      type="text"
                      class="form-input"
                      [class.error]="showValidationErrors && !localData.typeSpaEntourage!.autrePrecision"
                      [(ngModel)]="localData.typeSpaEntourage!.autrePrecision"
                      name="entourageSpaAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                  >
                  <div *ngIf="showValidationErrors && !localData.typeSpaEntourage!.autrePrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 22 -->
          <div class="form-group">
            <label class="form-label required">22) Consommez-vous des SPA en dehors de l'alcool et tabac</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="consommationSpaPersonnelle"
                    [value]="true"
                    [(ngModel)]="localData.consommationSpaPersonnelle"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="consommationSpaPersonnelle"
                    [value]="false"
                    [(ngModel)]="localData.consommationSpaPersonnelle"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.consommationSpaPersonnelle === undefined" class="form-error">
              Ce champ est obligatoire
            </div>
          </div>

          <!-- Question 23 -->
          <div class="form-group conditional-field" *ngIf="localData.consommationSpaPersonnelle === true">
            <label class="form-label required">23) Quelle(s) est/sont la/les drogue(s) utilisée(s) actuellement chez le patient</label>

            <div class="spa-list">
              <div class="spa-item">
                <label class="form-label">1. Cannabis</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualCannabis"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualCannabis"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">2. Opium</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualOpium"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.opium"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualOpium"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.opium"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">3. Les morphiniques de synthèse (Subutex…)</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualMorphiniques"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.morphiniques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualMorphiniques"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.morphiniques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.droguesActuelles!.morphiniques === true">
                  <label class="form-label required">3.a) Si oui, préciser la substance</label>
                  <select
                      class="form-select"
                      [class.error]="showValidationErrors && !localData.droguesActuelles!.morphiniquesPrecision"
                      [(ngModel)]="localData.droguesActuelles!.morphiniquesPrecision"
                      name="actualMorphiniquesPrecision"
                      (change)="onFieldChange()"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Subutex">Subutex</option>
                    <option value="Méthadone">Méthadone</option>
                    <option value="Tramal">Tramal</option>
                    <option value="Coalgésic">Coalgésic</option>
                    <option value="Fentanyl">Fentanyl</option>
                  </select>
                  <div *ngIf="showValidationErrors && !localData.droguesActuelles!.morphiniquesPrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>

              <!-- Répéter pour les autres substances... -->
              <div class="spa-item">
                <label class="form-label">4. Héroïne</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualHeroine"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.heroine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualHeroine"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.heroine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">5. Cocaïne</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualCocaine"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.cocaine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualCocaine"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.cocaine"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">6. Hypnotiques & sédatifs</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualHypnotiques"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.hypnotiques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualHypnotiques"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.hypnotiques"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.droguesActuelles!.hypnotiques === true">
                  <label class="form-label required">Type d'hypnotiques & sédatifs</label>
                  <select
                      class="form-select"
                      [(ngModel)]="localData.droguesActuelles!.hypnotiquesPrecision"
                      name="hypnotiquesPrecision"
                      (change)="onFieldChange()"
                      [class.error]="showValidationErrors && !localData.droguesActuelles!.hypnotiquesPrecision"
                  >
                      <option value="">Sélectionner un type</option>
                      <option *ngFor="let option of hypnotiquesOptions" [value]="option">{{ option }}</option>
                  </select>
                  
                  <!-- Champ de saisie pour "Autre" -->
                  <div *ngIf="localData.droguesActuelles!.hypnotiquesPrecision === 'Autre'" class="form-group nested mt-4">
                    <label class="form-label required">Préciser</label>
                    <input
                        type="text"
                        class="form-input"
                        [class.error]="showValidationErrors && !localData.droguesActuelles!.hypnotiquesAutrePrecision"
                        [(ngModel)]="localData.droguesActuelles!.hypnotiquesAutrePrecision"
                        name="hypnotiquesAutrePrecision"
                        placeholder="(il est fort apprécié d'indiquer la substance utilisée comme la prononce l'utilisateur)"
                        (input)="onFieldChange()"
                    >
                    <div *ngIf="showValidationErrors && !localData.droguesActuelles!.hypnotiquesAutrePrecision" class="form-error">
                      Ce champ est obligatoire
                    </div>
                  </div>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">7. Amphétamines</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualAmphetamines"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.amphetamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualAmphetamines"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.amphetamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">8. Ecstasy</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualEcstasy"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.ecstasy"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualEcstasy"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.ecstasy"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">9. Produits à inhaler (colle, solvants)</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualProduitsInhaler"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.produitsInhaler"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualProduitsInhaler"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.produitsInhaler"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">10. Prégabaline</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualPregabaline"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.pregabaline"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualPregabaline"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.pregabaline"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">11. Kétamines</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualKetamines"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.ketamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualKetamines"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.ketamines"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">12. LSD</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualLsd"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.lsd"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualLsd"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.lsd"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <div class="spa-item">
                <label class="form-label">13. Autre</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualAutre"
                        [value]="true"
                        [(ngModel)]="localData.droguesActuelles!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="actualAutre"
                        [value]="false"
                        [(ngModel)]="localData.droguesActuelles!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.droguesActuelles!.autre === true">
                  <label class="form-label required">23.a) Si autre, préciser</label>
                  <input
                      type="text"
                      class="form-input"
                      [class.error]="showValidationErrors && !localData.droguesActuelles!.autrePrecision"
                      [(ngModel)]="localData.droguesActuelles!.autrePrecision"
                      name="actualAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                  >
                  <div *ngIf="showValidationErrors && !localData.droguesActuelles!.autrePrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Question 24 -->
          <div class="form-group conditional-field" *ngIf="localData.consommationSpaPersonnelle === true">
            <label class="form-label">24) Quelle est la substance d'initiation de consommation chez le patient</label>

            <div class="spa-list">
              <!-- Répéter la même structure que pour la question 23 mais avec substanceInitiation -->
              <div class="spa-item">
                <label class="form-label">1. Cannabis</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="initiationCannabis"
                        [value]="true"
                        [(ngModel)]="localData.substanceInitiation!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="initiationCannabis"
                        [value]="false"
                        [(ngModel)]="localData.substanceInitiation!.cannabis"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>

              <!-- Continuer avec les autres substances... -->
              <!-- Pour économiser l'espace, je vais juste montrer quelques exemples -->

              <div class="spa-item">
                <label class="form-label">13. Autre</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="initiationAutre"
                        [value]="true"
                        [(ngModel)]="localData.substanceInitiation!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="initiationAutre"
                        [value]="false"
                        [(ngModel)]="localData.substanceInitiation!.autre"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>

                <div class="nested" *ngIf="localData.substanceInitiation!.autre === true">
                  <label class="form-label required">24.13.a) Si autre, préciser</label>
                  <input
                      type="text"
                      class="form-input"
                      [class.error]="showValidationErrors && !localData.substanceInitiation!.autrePrecision"
                      [(ngModel)]="localData.substanceInitiation!.autrePrecision"
                      name="initiationAutrePrecision"
                      placeholder="Préciser"
                      (input)="onFieldChange()"
                  >
                  <div *ngIf="showValidationErrors && !localData.substanceInitiation!.autrePrecision" class="form-error">
                    Ce champ est obligatoire
                  </div>
                </div>
              </div>
            </div>

            <!-- Question 24.B -->
            <div class="form-group nested">
              <label class="form-label">24.B) Âge d'initiation à la consommation de la première substance</label>
              <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="localData.ageInitiationPremiere"
                  name="ageInitiationPremiere"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
              >
            </div>
          </div>

          <!-- Question 25 -->
          <div class="form-group conditional-field" *ngIf="localData.consommationSpaPersonnelle === true">
            <label class="form-label">25) (en cas de poly-consommation) Quelle est la substance principale de consommation chez le patient (la plus consommée)</label>

            <!-- Même structure que les questions précédentes pour substancePrincipale -->

            <!-- Question 25.B -->
            <div class="form-group nested">
              <label class="form-label">25.B) Âge d'initiation de consommation de la substance principale</label>
              <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="localData.ageInitiationPrincipale"
                  name="ageInitiationPrincipale"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
              >
            </div>
          </div>

          <!-- Question 26 -->
          <div class="form-group">
            <label class="form-label required">26) Antécédents de troubles des comportements alimentaires (boulimie)</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="troublesAlimentaires"
                    [value]="true"
                    [(ngModel)]="localData.troublesAlimentaires"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="troublesAlimentaires"
                    [value]="false"
                    [(ngModel)]="localData.troublesAlimentaires"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.troublesAlimentaires === undefined" class="form-error">
              Ce champ est obligatoire
            </div>
          </div>

          <!-- Question 26.1 -->
          <div class="form-group">
            <label class="form-label required">26.1) Addiction aux jeux pathologiques</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="addictionJeux"
                    [value]="true"
                    [(ngModel)]="localData.addictionJeux"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="addictionJeux"
                    [value]="false"
                    [(ngModel)]="localData.addictionJeux"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.addictionJeux === undefined" class="form-error">
              Ce champ est obligatoire
            </div>
          </div>

          <!-- Question 26.2 -->
          <div class="form-group">
            <label class="form-label required">26.2) Addiction aux écrans</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="addictionEcrans"
                    [value]="true"
                    [(ngModel)]="localData.addictionEcrans"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="addictionEcrans"
                    [value]="false"
                    [(ngModel)]="localData.addictionEcrans"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.addictionEcrans === undefined" class="form-error">
              Ce champ est obligatoire
            </div>
          </div>

          <!-- Question 26.3 -->
          <div class="form-group">
            <label class="form-label required">26.3) Comportements sexuels addictifs</label>
            <div class="radio-options">
              <label class="radio-option">
                <input
                    type="radio"
                    name="comportementsSexuels"
                    [value]="true"
                    [(ngModel)]="localData.comportementsSexuels"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">1. Oui</span>
              </label>
              <label class="radio-option">
                <input
                    type="radio"
                    name="comportementsSexuels"
                    [value]="false"
                    [(ngModel)]="localData.comportementsSexuels"
                    (change)="onFieldChange()"
                >
                <span class="radio-text">2. Non</span>
              </label>
            </div>
            <div *ngIf="showValidationErrors && localData.comportementsSexuels === undefined" class="form-error">
              Ce champ est obligatoire
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

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-6) 0;
      padding-bottom: var(--spacing-3);
      border-bottom: 2px solid var(--primary-200);
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

    .nested {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 2px solid var(--primary-300);
      background-color: var(--primary-50);
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-3);
    }

    .sub-question {
      margin-bottom: var(--spacing-4);
      padding: var(--spacing-3);
      background-color: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
    }

    .spa-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .spa-item {
      padding: var(--spacing-4);
      background-color: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
    }

    .radio-options {
      display: flex;
      gap: var(--spacing-6);
      flex-wrap: wrap;
      margin-top: var(--spacing-2);
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

    .form-input.error,
    .form-select.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .form-error {
      margin-top: var(--spacing-2);
      font-size: 12px;
      color: var(--error-500);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .conditional-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }

      .nested {
        margin-left: var(--spacing-3);
      }

      .radio-options {
        flex-direction: column;
        gap: var(--spacing-3);
      }
    }
  `]
})
export class Step3Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};
  showValidationErrors = false;

  // Options pour les hypnotiques
  hypnotiquesOptions = HYPNOTIQUES_OPTIONS;

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.localData = {
      ...this.data,
      entourageSpa: this.data.entourageSpa || {},
      typeSpaEntourage: this.data.typeSpaEntourage || {},
      droguesActuelles: this.data.droguesActuelles || {},
      substanceInitiation: this.data.substanceInitiation || {},
      substancePrincipale: this.data.substancePrincipale || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  // Méthodes pour gérer les hypnotiques
  toggleHypnotiques(): void {
    this.localData.droguesActuelles!.hypnotiques = !this.localData.droguesActuelles!.hypnotiques;
    if (!this.localData.droguesActuelles!.hypnotiques) {
      this.localData.droguesActuelles!.hypnotiquesPrecision = undefined;
      this.localData.droguesActuelles!.hypnotiquesAutrePrecision = undefined;
    }
    this.onFieldChange();
  }

  toggleInitiationHypnotiques(): void {
    this.localData.substanceInitiation!.hypnotiques = !this.localData.substanceInitiation!.hypnotiques;
    if (!this.localData.substanceInitiation!.hypnotiques) {
      this.localData.substanceInitiation!.hypnotiquesPrecision = undefined;
      this.localData.substanceInitiation!.hypnotiquesAutrePrecision = undefined;
    }
    this.onFieldChange();
  }

  togglePrincipaleHypnotiques(): void {
    this.localData.substancePrincipale!.hypnotiques = !this.localData.substancePrincipale!.hypnotiques;
    if (!this.localData.substancePrincipale!.hypnotiques) {
      this.localData.substancePrincipale!.hypnotiquesPrecision = undefined;
      this.localData.substancePrincipale!.hypnotiquesAutrePrecision = undefined;
    }
    this.onFieldChange();
  }


  private validateStep(): void {
    const required = [
      'consommationSpaEntourage',
      'consommationSpaPersonnelle',
      'troublesAlimentaires',
      'addictionJeux',
      'addictionEcrans',
      'comportementsSexuels'
    ];

    // Validation conditionnelle pour l'entourage
    if (this.localData.consommationSpaEntourage === true) {
      // Au moins un type d'entourage doit être sélectionné
      const entourageSelected = Object.values(this.localData.entourageSpa || {}).some(value => value === true);
      if (!entourageSelected) {
        this.validationChange.emit(false);
        return;
      }

      // Si "autre" est sélectionné, la précision est obligatoire
      if (this.localData.entourageSpa?.autre === true && !this.localData.entourageSpa?.autrePrecision) {
        this.validationChange.emit(false);
        return;
      }

      // Au moins un type de SPA dans l'entourage doit être sélectionné
      const typeSpaSelected = Object.values(this.localData.typeSpaEntourage || {}).some(value => value === true);
      if (!typeSpaSelected) {
        this.validationChange.emit(false);
        return;
      }

      // Validations conditionnelles pour les précisions
      if (this.localData.typeSpaEntourage?.morphiniques === true && !this.localData.typeSpaEntourage?.morphiniquesPrecision) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.typeSpaEntourage?.autre === true && !this.localData.typeSpaEntourage?.autrePrecision) {
        this.validationChange.emit(false);
        return;
      }
    }

    // Validation conditionnelle pour la consommation personnelle
    if (this.localData.consommationSpaPersonnelle === true) {
      // Au moins une drogue actuelle doit être sélectionnée
      const drogueSelected = Object.values(this.localData.droguesActuelles || {}).some(value => value === true);
      if (!drogueSelected) {
        this.validationChange.emit(false);
        return;
      }

      // Validations conditionnelles pour les précisions
      if (this.localData.droguesActuelles?.morphiniques === true && !this.localData.droguesActuelles?.morphiniquesPrecision) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.droguesActuelles?.autre === true && !this.localData.droguesActuelles?.autrePrecision) {
        this.validationChange.emit(false);
        return;
      }

      if (this.localData.substanceInitiation?.autre === true && !this.localData.substanceInitiation?.autrePrecision) {
        this.validationChange.emit(false);
        return;
      }
    }

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    this.validationChange.emit(isValid);
  }
}
