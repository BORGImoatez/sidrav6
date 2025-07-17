import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container card">
      <div class="card-header">
        <h2 class="step-title">Étape 2 : Consommation de tabac/produits tabagiques & alcool</h2>
        <p class="step-description">
          Renseignez les informations sur la consommation de tabac et d'alcool
        </p>
      </div>

      <div class="card-body">
        <form class="step-form">
          <!-- Section Tabac -->
          <div class="form-section">
            <h3 class="section-title">Consommation de tabac/produits tabagiques</h3>

            <!-- Question 17 -->
            <div class="form-group">
              <label class="form-label required">17) Consommation de tabac/produits nicotiniques (tabagiques, cigarettes électroniques…)</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.consommationTabac === 'FUMEUR'">
                  <input
                      type="checkbox"
                      [checked]="localData.consommationTabac === 'FUMEUR'"
                      (change)="selectTabacStatus('FUMEUR')"
                  >
                  <span class="checkbox-text">1. Fumeur</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.consommationTabac === 'NON_FUMEUR'">
                  <input
                      type="checkbox"
                      [checked]="localData.consommationTabac === 'NON_FUMEUR'"
                      (change)="selectTabacStatus('NON_FUMEUR')"
                  >
                  <span class="checkbox-text">2. Non-fumeur</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.consommationTabac === 'EX_FUMEUR'">
                  <input
                      type="checkbox"
                      [checked]="localData.consommationTabac === 'EX_FUMEUR'"
                      (change)="selectTabacStatus('EX_FUMEUR')"
                  >
                  <span class="checkbox-text">3. Ex-fumeur</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && !localData.consommationTabac" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 17.a -->
            <div class="form-group conditional-field" *ngIf="localData.consommationTabac === 'FUMEUR' || localData.consommationTabac === 'EX_FUMEUR'">
              <label class="form-label required">17.a) Âge lors de la première consommation de tabac</label>
              <input
                  type="number"
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.agePremiereConsommationTabac"
                  [(ngModel)]="localData.agePremiereConsommationTabac"
                  name="agePremiereConsommationTabac"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
              >
              <div *ngIf="showValidationErrors && !localData.agePremiereConsommationTabac" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 17.b -->
            <div class="form-group conditional-field" *ngIf="localData.consommationTabac === 'FUMEUR'">
              <label class="form-label required">17.b) Consommation de tabac/produits tabagiques durant les 30 derniers jours</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationTabac30Jours"
                      [value]="true"
                      [(ngModel)]="localData.consommationTabac30Jours"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationTabac30Jours"
                      [value]="false"
                      [(ngModel)]="localData.consommationTabac30Jours"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && localData.consommationTabac30Jours === undefined" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 17.c -->
            <div class="form-group conditional-field nested" *ngIf="localData.consommationTabac === 'FUMEUR' && localData.consommationTabac30Jours === true">
              <label class="form-label required">17.c) Fréquence de consommation de tabac/produits tabagiques durant les 30 derniers jours</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.frequenceTabac30Jours === 'QUOTIDIEN'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceTabac30Jours === 'QUOTIDIEN'"
                      (change)="selectFrequenceTabac('QUOTIDIEN')"
                  >
                  <span class="checkbox-text">1. Quotidiennement</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceTabac30Jours === '2_3_JOURS'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceTabac30Jours === '2_3_JOURS'"
                      (change)="selectFrequenceTabac('2_3_JOURS')"
                  >
                  <span class="checkbox-text">2. 2 à 3 jours par semaine</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceTabac30Jours === 'HEBDOMADAIRE'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceTabac30Jours === 'HEBDOMADAIRE'"
                      (change)="selectFrequenceTabac('HEBDOMADAIRE')"
                  >
                  <span class="checkbox-text">3. Une fois par semaine ou moins</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceTabac30Jours === 'OCCASIONNEL'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceTabac30Jours === 'OCCASIONNEL'"
                      (change)="selectFrequenceTabac('OCCASIONNEL')"
                  >
                  <span class="checkbox-text">4. Occasionnellement</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && !localData.frequenceTabac30Jours" class="form-error">
                Ce champ est obligatoire
              </div>

              <!-- Nombre de cigarettes par jour -->
              <div class="form-group nested" *ngIf="localData.frequenceTabac30Jours">
                <label class="form-label">Nombre de cigarettes/paquets par jour</label>
                <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="localData.nombreCigarettesJour"
                    name="nombreCigarettesJour"
                    placeholder="Nombre de cigarettes"
                    min="1"
                    (input)="onFieldChange()"
                >
              </div>
            </div>

            <!-- Question 17.d -->
            <div class="form-group conditional-field" *ngIf="localData.consommationTabac === 'FUMEUR'">
              <label class="form-label">17.d) Nombre de paquets/année</label>
              <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="localData.nombrePaquetsAnnee"
                  name="nombrePaquetsAnnee"
                  placeholder="Nombre de paquets par année"
                  min="0"
                  step="0.1"
                  (input)="onFieldChange()"
              >
            </div>

            <!-- Question 17.d (Ex-fumeur) -->
            <div class="form-group conditional-field" *ngIf="localData.consommationTabac === 'EX_FUMEUR'">
              <label class="form-label">17.d) Âge de l'arrêt de la consommation de tabac</label>
              <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="localData.ageArretTabac"
                  name="ageArretTabac"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
              >
            </div>

            <!-- Question 17.e -->
            <div class="form-group conditional-field" *ngIf="localData.consommationTabac === 'EX_FUMEUR'">
              <label class="form-label">17.e) A-t-il demandé des soins de sevrage</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.soinsSevrageTabac === 'OUI_SATISFAIT'">
                  <input
                      type="checkbox"
                      [checked]="localData.soinsSevrageTabac === 'OUI_SATISFAIT'"
                      (change)="selectSoinsSevrageTabac('OUI_SATISFAIT')"
                  >
                  <span class="checkbox-text">1. Oui, satisfait</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.soinsSevrageTabac === 'OUI_NON_SATISFAIT'">
                  <input
                      type="checkbox"
                      [checked]="localData.soinsSevrageTabac === 'OUI_NON_SATISFAIT'"
                      (change)="selectSoinsSevrageTabac('OUI_NON_SATISFAIT')"
                  >
                  <span class="checkbox-text">2. Oui, non satisfait</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.soinsSevrageTabac === 'NON'">
                  <input
                      type="checkbox"
                      [checked]="localData.soinsSevrageTabac === 'NON'"
                      (change)="selectSoinsSevrageTabac('NON')"
                  >
                  <span class="checkbox-text">3. Non</span>
                </label>
              </div>

              <!-- Sevrage médicalement assisté -->
              <div class="form-group nested" *ngIf="localData.soinsSevrageTabac">
                <label class="form-label">A-t-il fait un sevrage médicalement assisté ?</label>
                <div class="radio-options">
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="sevrageAssiste"
                        [value]="true"
                        [(ngModel)]="localData.sevrageAssiste"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">1. Oui</span>
                  </label>
                  <label class="radio-option">
                    <input
                        type="radio"
                        name="sevrageAssiste"
                        [value]="false"
                        [(ngModel)]="localData.sevrageAssiste"
                        (change)="onFieldChange()"
                    >
                    <span class="radio-text">2. Non</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Alcool -->
          <div class="form-section">
            <h3 class="section-title">Consommation d'alcool</h3>

            <!-- Question 18 -->
            <div class="form-group">
              <label class="form-label required">18) Consommation d'alcool</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationAlcool"
                      [value]="true"
                      [(ngModel)]="localData.consommationAlcool"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationAlcool"
                      [value]="false"
                      [(ngModel)]="localData.consommationAlcool"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && localData.consommationAlcool === undefined" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 18.a -->
            <div class="form-group conditional-field" *ngIf="localData.consommationAlcool === true">
              <label class="form-label required">18.a) Âge lors de la première consommation d'alcool</label>
              <input
                  type="number"
                  class="form-input"
                  [class.error]="showValidationErrors && !localData.agePremiereConsommationAlcool"
                  [(ngModel)]="localData.agePremiereConsommationAlcool"
                  name="agePremiereConsommationAlcool"
                  placeholder="Âge en années"
                  min="1"
                  max="100"
                  (input)="onFieldChange()"
              >
              <div *ngIf="showValidationErrors && !localData.agePremiereConsommationAlcool" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 18.b -->
            <div class="form-group conditional-field" *ngIf="localData.consommationAlcool === true">
              <label class="form-label required">18.b) Consommation d'alcool durant les 30 derniers jours</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationAlcool30Jours"
                      [value]="true"
                      [(ngModel)]="localData.consommationAlcool30Jours"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">1. Oui</span>
                </label>
                <label class="radio-option">
                  <input
                      type="radio"
                      name="consommationAlcool30Jours"
                      [value]="false"
                      [(ngModel)]="localData.consommationAlcool30Jours"
                      (change)="onFieldChange()"
                  >
                  <span class="radio-text">2. Non</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && localData.consommationAlcool30Jours === undefined" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 18.c -->
            <div class="form-group conditional-field nested" *ngIf="localData.consommationAlcool === true && localData.consommationAlcool30Jours === true">
              <label class="form-label required">18.c) Fréquence de consommation d'alcool durant les 30 derniers jours</label>
              <div class="checkbox-options">
                <label class="checkbox-option" [class.selected]="localData.frequenceAlcool30Jours === 'QUOTIDIEN'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceAlcool30Jours === 'QUOTIDIEN'"
                      (change)="selectFrequenceAlcool('QUOTIDIEN')"
                  >
                  <span class="checkbox-text">1. Quotidiennement</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceAlcool30Jours === '2_3_JOURS'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceAlcool30Jours === '2_3_JOURS'"
                      (change)="selectFrequenceAlcool('2_3_JOURS')"
                  >
                  <span class="checkbox-text">2. 2 à 3 jours par semaine</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceAlcool30Jours === 'HEBDOMADAIRE'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceAlcool30Jours === 'HEBDOMADAIRE'"
                      (change)="selectFrequenceAlcool('HEBDOMADAIRE')"
                  >
                  <span class="checkbox-text">3. Une fois par semaine ou moins</span>
                </label>
                <label class="checkbox-option" [class.selected]="localData.frequenceAlcool30Jours === 'OCCASIONNEL'">
                  <input
                      type="checkbox"
                      [checked]="localData.frequenceAlcool30Jours === 'OCCASIONNEL'"
                      (change)="selectFrequenceAlcool('OCCASIONNEL')"
                  >
                  <span class="checkbox-text">4. Occasionnellement</span>
                </label>
              </div>
              <div *ngIf="showValidationErrors && !localData.frequenceAlcool30Jours" class="form-error">
                Ce champ est obligatoire
              </div>
            </div>

            <!-- Question 18.d -->
            <div class="form-group conditional-field nested" *ngIf="localData.consommationAlcool === true && localData.consommationAlcool30Jours === true">
              <label class="form-label">18.d) Quantité d'alcool consommé (nombre de verres/prise)</label>
              <input
                  type="number"
                  class="form-input"
                  [(ngModel)]="localData.quantiteAlcoolPrise"
                  name="quantiteAlcoolPrise"
                  placeholder="Nombre de verres"
                  min="1"
                  (input)="onFieldChange()"
              >
            </div>

            <!-- Question 18.e -->
            <div class="form-group conditional-field" *ngIf="localData.consommationAlcool === true">
              <label class="form-label">18.e) Quel type d'alcool consommé (plusieurs choix possibles)</label>
              <div class="checkbox-grid">
                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      [(ngModel)]="localData.typeAlcool!.biere"
                      name="biere"
                      (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Bière</span>
                </label>

                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      [(ngModel)]="localData.typeAlcool!.liqueurs"
                      name="liqueurs"
                      (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Liqueurs</span>
                </label>

                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      [(ngModel)]="localData.typeAlcool!.alcoolBruler"
                      name="alcoolBruler"
                      (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Alcool à brûler</span>
                </label>

                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      [(ngModel)]="localData.typeAlcool!.legmi"
                      name="legmi"
                      (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Legmi</span>
                </label>

                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      [(ngModel)]="localData.typeAlcool!.boukha"
                      name="boukha"
                      (change)="onFieldChange()"
                  >
                  <span class="checkbox-text">Boukha</span>
                </label>
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

    .conditional-field.nested {
      margin-left: var(--spacing-8);
      border-left-color: var(--primary-300);
      background-color: var(--primary-50);
    }

    .nested {
      margin-left: var(--spacing-6);
      padding-left: var(--spacing-4);
      border-left: 2px solid var(--primary-300);
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

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-3);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      cursor: pointer;
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease-in-out;
    }

    .checkbox-label:hover {
      background-color: var(--gray-100);
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary-600);
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

    @media (max-width: 768px) {
      .conditional-field {
        margin-left: var(--spacing-3);
        padding-left: var(--spacing-3);
      }

      .conditional-field.nested {
        margin-left: var(--spacing-4);
      }

      .nested {
        margin-left: var(--spacing-3);
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .radio-options {
        flex-direction: column;
        gap: var(--spacing-3);
      }
    }
  `]
})
export class Step2Component implements OnInit, OnChanges {
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
      typeAlcool: this.data.typeAlcool || {}
    };
    this.validateStep();
  }

  onFieldChange(): void {
    this.dataChange.emit(this.localData);
    this.validateStep();
  }

  selectTabacStatus(status: string): void {
    this.localData.consommationTabac = status as any;

    // Reset dependent fields when changing status
    if (status !== 'FUMEUR') {
      this.localData.consommationTabac30Jours = undefined;
      this.localData.frequenceTabac30Jours = undefined;
      this.localData.nombreCigarettesJour = undefined;
      this.localData.nombrePaquetsAnnee = undefined;
    }
    if (status !== 'EX_FUMEUR') {
      this.localData.ageArretTabac = undefined;
      this.localData.soinsSevrageTabac = undefined;
      this.localData.sevrageAssiste = undefined;
    }
    if (status !== 'FUMEUR' && status !== 'EX_FUMEUR') {
      this.localData.agePremiereConsommationTabac = undefined;
    }

    this.onFieldChange();
  }

  selectFrequenceTabac(frequence: string): void {
    this.localData.frequenceTabac30Jours = frequence as any;
    this.onFieldChange();
  }

  selectSoinsSevrageTabac(soins: string): void {
    this.localData.soinsSevrageTabac = soins as any;
    this.onFieldChange();
  }

  selectFrequenceAlcool(frequence: string): void {
    this.localData.frequenceAlcool30Jours = frequence as any;
    this.onFieldChange();
  }



  private validateStep(): void {
    const required = ['consommationTabac', 'consommationAlcool'];

    // Conditional required fields for tobacco
    if (this.localData.consommationTabac === 'FUMEUR' || this.localData.consommationTabac === 'EX_FUMEUR') {
      required.push('agePremiereConsommationTabac');
    }

    if (this.localData.consommationTabac === 'FUMEUR') {
      required.push('consommationTabac30Jours');

      if (this.localData.consommationTabac30Jours === true) {
        required.push('frequenceTabac30Jours');
      }
    }

    // Conditional required fields for alcohol
    if (this.localData.consommationAlcool === true) {
      required.push('agePremiereConsommationAlcool', 'consommationAlcool30Jours');

      if (this.localData.consommationAlcool30Jours === true) {
        required.push('frequenceAlcool30Jours');
      }
    }

    const isValid = required.every(field => {
      const value = (this.localData as any)[field];
      return value !== undefined && value !== null && value !== '';
    });

    this.validationChange.emit(isValid);
  }
}
