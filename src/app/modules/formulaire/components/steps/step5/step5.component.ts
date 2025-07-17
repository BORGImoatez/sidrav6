import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 5 : Comorbidités</h2>
        <p class="step-description">
          Informations sur les comorbidités et antécédents pénitentiaires
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Section Comorbidités personnelles -->
          <div class="form-section">
            <h3 class="section-title">Comorbidités personnelles</h3>

            <!-- Question 34 -->
            <div class="form-group">
              <label class="form-label">34) Comorbidités Psychiatriques personnelles</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditePsychiatriquePersonnelle"
                      [value]="true"
                      [(ngModel)]="localData.comorbiditePsychiatriquePersonnelle"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditePsychiatriquePersonnelle"
                      [value]="false"
                      [(ngModel)]="localData.comorbiditePsychiatriquePersonnelle"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 34.a -->
            <div class="conditional-field" *ngIf="localData.comorbiditePsychiatriquePersonnelle === true">
              <label class="form-label required">34.a) Si oui, préciser</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.comorbiditePsychiatriquePersonnellePrecision"
                  [(ngModel)]="localData.comorbiditePsychiatriquePersonnellePrecision"
                  name="comorbiditePsychiatriquePersonnellePrecision"
                  placeholder="Préciser les comorbidités psychiatriques personnelles"
                  rows="3"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && !localData.comorbiditePsychiatriquePersonnellePrecision" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 35 -->
            <div class="form-group">
              <label class="form-label">35) Comorbidités somatiques personnelles</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditeSomatiquePersonnelle"
                      [value]="true"
                      [(ngModel)]="localData.comorbiditeSomatiquePersonnelle"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditeSomatiquePersonnelle"
                      [value]="false"
                      [(ngModel)]="localData.comorbiditeSomatiquePersonnelle"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 35.a -->
            <div class="conditional-field" *ngIf="localData.comorbiditeSomatiquePersonnelle === true">
              <label class="form-label required">35.a) Si oui, préciser</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.comorbiditeSomatiquePersonnellePrecision"
                  [(ngModel)]="localData.comorbiditeSomatiquePersonnellePrecision"
                  name="comorbiditeSomatiquePersonnellePrecision"
                  placeholder="Préciser les comorbidités somatiques personnelles"
                  rows="3"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && !localData.comorbiditeSomatiquePersonnellePrecision" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>
          </div>

          <!-- Section Comorbidités des partenaires -->
          <div class="form-section">
            <h3 class="section-title">Comorbidités des partenaires</h3>

            <!-- Question 36 -->
            <div class="form-group">
              <label class="form-label">36) Comorbidités Psychiatriques des partenaires</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditePsychiatriquePartenaire"
                      [value]="true"
                      [(ngModel)]="localData.comorbiditePsychiatriquePartenaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditePsychiatriquePartenaire"
                      [value]="false"
                      [(ngModel)]="localData.comorbiditePsychiatriquePartenaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 36.a -->
            <div class="conditional-field" *ngIf="localData.comorbiditePsychiatriquePartenaire === true">
              <label class="form-label required">36.a) Si oui, préciser</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.comorbiditePsychiatriquePartenairePrecision"
                  [(ngModel)]="localData.comorbiditePsychiatriquePartenairePrecision"
                  name="comorbiditePsychiatriquePartenairePrecision"
                  placeholder="Préciser les comorbidités psychiatriques des partenaires"
                  rows="3"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && !localData.comorbiditePsychiatriquePartenairePrecision" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 37 -->
            <div class="form-group">
              <label class="form-label">37) Comorbidités somatiques des partenaires</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditeSomatiquePartenaire"
                      [value]="true"
                      [(ngModel)]="localData.comorbiditeSomatiquePartenaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="comorbiditeSomatiquePartenaire"
                      [value]="false"
                      [(ngModel)]="localData.comorbiditeSomatiquePartenaire"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
            </div>

            <!-- Question 37.a -->
            <div class="conditional-field" *ngIf="localData.comorbiditeSomatiquePartenaire === true">
              <label class="form-label required">37.a) Si oui, préciser</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.comorbiditeSomatiquePartenairePrecision"
                  [(ngModel)]="localData.comorbiditeSomatiquePartenairePrecision"
                  name="comorbiditeSomatiquePartenairePrecision"
                  placeholder="Préciser les comorbidités somatiques des partenaires"
                  rows="3"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && !localData.comorbiditeSomatiquePartenairePrecision" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>
          </div>

          <!-- Section Antécédents pénitentiaires -->
          <div class="form-section">
            <h3 class="section-title">Antécédents pénitentiaires</h3>

            <!-- Question 38.a -->
            <div class="form-group">
              <label class="form-label">38.a) Nombre de condamnations</label>
              <input
                  type="number"
                  class="form-input number-input"
                  [(ngModel)]="localData.nombreCondamnations"
                  name="nombreCondamnations"
                  placeholder="Nombre de condamnations"
                  min="0"
                  max="99"
                  (input)="onFieldChange()"
              >
              <div class="field-help">
                Saisir le nombre total de condamnations (format: 2 chiffres maximum)
              </div>
            </div>

            <!-- Question 38.b -->
            <div class="form-group">
              <label class="form-label">38.b) La durée de détention</label>
              <div class="duration-inputs">
                <div class="duration-group">
                  <label class="duration-label">Jours</label>
                  <input
                      type="number"
                      class="form-input duration-input"
                      [(ngModel)]="localData.dureeDetentionJours"
                      name="dureeDetentionJours"
                      placeholder="00"
                      min="0"
                      max="99"
                      (input)="onFieldChange()"
                  >
                </div>
                <div class="duration-group">
                  <label class="duration-label">Mois</label>
                  <input
                      type="number"
                      class="form-input duration-input"
                      [(ngModel)]="localData.dureeDetentionMois"
                      name="dureeDetentionMois"
                      placeholder="00"
                      min="0"
                      max="99"
                      (input)="onFieldChange()"
                  >
                </div>
                <div class="duration-group">
                  <label class="duration-label">Années</label>
                  <input
                      type="number"
                      class="form-input duration-input"
                      [(ngModel)]="localData.dureeDetentionAnnees"
                      name="dureeDetentionAnnees"
                      placeholder="00"
                      min="0"
                      max="99"
                      (input)="onFieldChange()"
                  >
                </div>
              </div>
              <div class="field-help">
                Saisir la durée totale de détention (format: 2 chiffres maximum pour chaque unité)
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

    .number-input {
      max-width: 150px;
    }

    .duration-inputs {
      display: flex;
      gap: var(--spacing-4);
      align-items: end;
      flex-wrap: wrap;
    }

    .duration-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .duration-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--gray-600);
    }

    .duration-input {
      width: 80px;
      text-align: center;
    }

    .field-help {
      font-size: 12px;
      color: var(--gray-500);
      margin-top: var(--spacing-2);
      line-height: 1.4;
    }

    .info-box {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      background-color: var(--primary-50);
      border: 1px solid var(--primary-200);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-6);
    }

    .info-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
    }

    .info-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-800);
      margin: 0 0 var(--spacing-2) 0;
    }

    .info-text {
      font-size: 14px;
      color: var(--primary-700);
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .conditional-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }

      .radio-options {
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .duration-inputs {
        flex-direction: column;
        align-items: stretch;
      }

      .duration-input {
        width: 100%;
        text-align: left;
      }

      .info-box {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class Step5Component implements OnInit, OnChanges {
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
    this.localData = { ...this.data };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }



  private validateStep(): void {
    let isValid = true;

    // Validation pour comorbidités psychiatriques personnelles
    if (this.localData.comorbiditePsychiatriquePersonnelle === true &&
        (!this.localData.comorbiditePsychiatriquePersonnellePrecision ||
            this.localData.comorbiditePsychiatriquePersonnellePrecision.trim() === '')) {
      isValid = false;
    }

    // Validation pour comorbidités somatiques personnelles
    if (this.localData.comorbiditeSomatiquePersonnelle === true &&
        (!this.localData.comorbiditeSomatiquePersonnellePrecision ||
            this.localData.comorbiditeSomatiquePersonnellePrecision.trim() === '')) {
      isValid = false;
    }

    // Validation pour comorbidités psychiatriques des partenaires
    if (this.localData.comorbiditePsychiatriquePartenaire === true &&
        (!this.localData.comorbiditePsychiatriquePartenairePrecision ||
            this.localData.comorbiditePsychiatriquePartenairePrecision.trim() === '')) {
      isValid = false;
    }

    // Validation pour comorbidités somatiques des partenaires
    if (this.localData.comorbiditeSomatiquePartenaire === true &&
        (!this.localData.comorbiditeSomatiquePartenairePrecision ||
            this.localData.comorbiditeSomatiquePartenairePrecision.trim() === '')) {
      isValid = false;
    }

    // Cette étape est généralement valide car la plupart des champs sont optionnels
    // La validation principale concerne les champs conditionnels obligatoires
    this.validationChange.emit(isValid);
  }
}
