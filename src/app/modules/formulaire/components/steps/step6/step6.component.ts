import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 6 : Décès induit par les SPA dans l'entourage</h2>
        <p class="step-description">
          Informations sur les décès liés aux substances psychoactives dans l'entourage
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <div class="form-section">
            <h3 class="section-title">Décès liés aux SPA dans l'entourage</h3>

            <!-- Question 39 -->
            <div class="form-group">
              <label class="form-label">39) Nombre de décès induit par les SPA dans l'entourage</label>
              <input
                  type="number"
                  class="form-input number-input"
                  [(ngModel)]="localData.nombreDecesSpaDansEntourage"
                  name="nombreDecesSpaDansEntourage"
                  placeholder="Nombre de décès"
                  min="0"
                  max="99"
                  (input)="onFieldChange()"
              >
              <div class="field-help">
                Indiquez le nombre de personnes de votre entourage décédées à cause de la consommation de substances psychoactives
              </div>
            </div>

            <!-- Question 39.a - Affiché seulement si nombre >= 1 -->
            <div class="conditional-field" *ngIf="localData.nombreDecesSpaDansEntourage && localData.nombreDecesSpaDansEntourage >= 1">
              <label class="form-label required">39.a) Causes</label>
              <textarea
                  class="form-input"
                  [class.error]="showValidationErrors && (!localData.causesDecesSpaDansEntourage || localData.causesDecesSpaDansEntourage.trim() === '')"
                  [(ngModel)]="localData.causesDecesSpaDansEntourage"
                  name="causesDecesSpaDansEntourage"
                  placeholder="Décrivez les causes des décès (overdose, complications médicales, accidents, etc.)"
                  rows="6"
                  (input)="onFieldChange()"
              ></textarea>
              <div *ngIf="showValidationErrors && (!localData.causesDecesSpaDansEntourage || localData.causesDecesSpaDansEntourage.trim() === '')" class="form-error">
                Ce champ est obligatoire lorsque le nombre de décès est supérieur à 0
              </div>
              <div class="field-help">
                Précisez les circonstances et causes des décès (par exemple : overdose, complications médicales, accidents sous influence, etc.)
              </div>
            </div>
 

            <div class="completion-summary">
              <h4 class="summary-title">Récapitulatif du formulaire</h4>
              <p class="summary-text">
                Vous avez terminé la saisie de toutes les sections du formulaire SIDRA.
                Vérifiez que toutes les informations sont correctes avant de valider.
              </p>

              <div class="summary-sections">
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Informations structure/centre & usager SPA</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Consommation tabac & alcool</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Consommation de substances psychoactives</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Comportements liés à la consommation et tests de dépistage</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Comorbidités</span>
                </div>
                <div class="summary-item">
                  <span class="summary-icon">✅</span>
                  <span class="summary-label">Décès induit par les SPA dans l'entourage</span>
                </div>
              </div>

              <div class="final-note">
                <p>
                  <strong>Prochaine étape :</strong> Cliquez sur "Valider le formulaire" pour enregistrer
                  définitivement les données et générer l'IUN (Identifiant Unique National).
                </p>
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
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .number-input {
      max-width: 150px;
    }

    .form-input[rows] {
      resize: vertical;
      min-height: 120px;
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
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
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
      color: var(--error-700);
      margin: 0 0 var(--spacing-2) 0;
    }

    .info-text {
      font-size: 14px;
      color: var(--error-700);
      margin: 0;
      line-height: 1.5;
    }

    .completion-summary {
      margin-top: var(--spacing-8);
      padding: var(--spacing-6);
      background: linear-gradient(135deg, var(--success-500), var(--primary-50));
      border: 1px solid var(--success-500);
      border-radius: var(--radius-lg);
    }

    .summary-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-3) 0;
    }

    .summary-text {
      color: var(--gray-700);
      margin: 0 0 var(--spacing-6) 0;
      line-height: 1.5;
    }

    .summary-sections {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-6);
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: white;
      border-radius: var(--radius-md);
      border: 1px solid var(--success-500);
    }

    .summary-icon {
      font-size: 16px;
      color: var(--success-600);
    }

    .summary-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-800);
    }

    .final-note {
      padding: var(--spacing-4);
      background-color: var(--primary-100);
      border-radius: var(--radius-md);
      border: 1px solid var(--primary-300);
    }

    .final-note p {
      margin: 0;
      font-size: 14px;
      color: var(--primary-800);
      line-height: 1.5;
    }

    .final-note strong {
      color: var(--primary-800);
    }

    @media (max-width: 768px) {
      .conditional-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }

      .info-box {
        flex-direction: column;
        text-align: center;
      }

      .completion-summary {
        padding: var(--spacing-4);
      }
    }
  `]
})
export class Step6Component implements OnInit, OnChanges {
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
    // Si le nombre de décès devient 0 ou undefined, effacer les causes
    if (!this.localData.nombreDecesSpaDansEntourage || this.localData.nombreDecesSpaDansEntourage < 1) {
      this.localData.causesDecesSpaDansEntourage = undefined;
    }

    this.dataChange.emit(this.localData);
    this.validateStep();
  }



  private validateStep(): void {
    let isValid = true;

    // Si le nombre de décès est >= 1, les causes sont obligatoires
    if (this.localData.nombreDecesSpaDansEntourage &&
        this.localData.nombreDecesSpaDansEntourage >= 1 &&
        (!this.localData.causesDecesSpaDansEntourage ||
            this.localData.causesDecesSpaDansEntourage.trim() === '')) {
      isValid = false;
    }

    // Cette étape est généralement valide car les champs sont optionnels
    // sauf si des décès sont déclarés
    this.validationChange.emit(isValid);
  }
}
