import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormulaireService } from '../../../../services/formulaire.service';
import { FormulaireData, FormulaireStep } from '../../models/formulaire.model';
import {Step1Component} from "../steps/step1/step1.component";
import {Step2Component} from "../steps/step2/step2.component";
import {Step3Component} from "../steps/step3/step3.component";
import {Step4Component} from "../steps/step4/step4.component";
import {Step5Component} from "../steps/step5/step5.component";
import {Step6Component} from "../steps/step6/step6.component";


@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component
  ],
  template: `
    <div class="formulaire-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Nouveau formulaire SIDRA</h1>
          <p class="page-description">
            Saisie des données d'un usager SPA - Étape {{ currentStep }} sur {{ totalSteps }}
          </p>
        </div>
        <button
            class="btn btn-secondary"
            (click)="goBack()"
            type="button"
        >
          ← Retour
        </button>
      </div>

      <!-- Progress bar -->
      <div class="progress-section card">
        <div class="card-body">
          <div class="progress-header">
            <h3 class="text-lg font-semibold text-gray-900">Progression</h3>
            <span class="progress-text">{{ currentStep }}/{{ totalSteps }} étapes</span>
          </div>

          <div class="progress-bar">
            <div
                class="progress-fill"
                [style.width.%]="(currentStep / totalSteps) * 100"
            ></div>
          </div>

          <div class="steps-list">
            <div
                *ngFor="let step of steps; let i = index"
                class="step-item"
                [class.active]="step.id === currentStep"
                [class.completed]="step.isCompleted"
            >
              <div class="step-number">
                <span *ngIf="!step.isCompleted">{{ step.id }}</span>
                <span *ngIf="step.isCompleted">✓</span>
              </div>
              <div class="step-title">{{ step.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form content -->
      <div class="form-content">
        <!-- Step 1: Informations structure/centre & usager SPA -->
        <app-step1
            *ngIf="currentStep === 1"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(1, $event)"
        ></app-step1>

        <!-- Step 2: Consommation tabac & alcool -->
        <app-step2
            *ngIf="currentStep === 2"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(2, $event)"
        ></app-step2>

        <!-- Step 3: Consommation de substances psychoactives -->
        <app-step3
            *ngIf="currentStep === 3"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(3, $event)"
        ></app-step3>

        <!-- Step 4: Comportements liés à la consommation et tests de dépistage -->
        <app-step4
            *ngIf="currentStep === 4"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(4, $event)"
        ></app-step4>

        <!-- Step 5: Comorbidités -->
        <app-step5
            *ngIf="currentStep === 5"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(5, $event)"
        ></app-step5>

        <!-- Step 6: Décès induit par les SPA dans l'entourage -->
        <app-step6
            *ngIf="currentStep === 6"
            [data]="formulaireData"
            (dataChange)="onStepDataChange($event)"
            (validationChange)="onStepValidationChange(6, $event)"
        ></app-step6>
      </div>

      <!-- Navigation buttons -->
      <div class="navigation-section card">
        <div class="card-body">
          <div class="navigation-buttons">
            <button
                class="btn btn-secondary"
                (click)="previousStep()"
                [disabled]="currentStep === 1 || isSaving"
                type="button"
            >
              ← Précédent
            </button>

            <div class="step-info">
              <span class="current-step-title">{{ getCurrentStepTitle() }}</span>
            </div>

            <button
                *ngIf="currentStep < totalSteps"
                class="btn btn-primary"
                (click)="nextStep()"
                [disabled]="!isCurrentStepValid() || isSaving"
                type="button"
            >
              Suivant →
            </button>

            <button
                *ngIf="currentStep === totalSteps"
                class="btn btn-primary"
                (click)="submitForm()"
                [disabled]="!isFormValid() || isSaving"
                type="button"
            >
              <span *ngIf="!isSaving">Valider le formulaire</span>
              <span *ngIf="isSaving" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Validation en cours...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Success modal -->
      <div class="modal-overlay" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">✅ Formulaire validé</h3>
          </div>
          <div class="modal-body">
            <p class="text-center mb-4">
              Le formulaire a été enregistré avec succès.
            </p>
            <div class="success-info">
              <div class="info-item">
                <span class="info-label">IUN généré :</span>
                <span class="info-value">{{ generatedIUN }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date de saisie :</span>
                <span class="info-value">{{ getCurrentDateTimeFormatted() }}</span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button
                type="button"
                class="btn btn-secondary"
                (click)="createNewForm()"
            >
              Nouveau formulaire
            </button>
            <button
                type="button"
                class="btn btn-primary"
                (click)="goToDashboard()"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .formulaire-container {
      max-width: 1000px;
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

    .progress-section {
      margin-bottom: var(--spacing-6);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }

    .progress-text {
      font-size: 14px;
      color: var(--gray-600);
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: var(--gray-200);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: var(--spacing-6);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      transition: width 0.3s ease-in-out;
    }

    .steps-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-3);
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      transition: all 0.2s ease-in-out;
    }

    .step-item.active {
      background-color: var(--primary-50);
      border: 1px solid var(--primary-200);
    }

    .step-item.completed {
      background-color: var(--success-500);
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      background-color: var(--gray-200);
      color: var(--gray-600);
      flex-shrink: 0;
    }

    .step-item.active .step-number {
      background-color: var(--primary-500);
      color: white;
    }

    .step-item.completed .step-number {
      background-color: var(--success-500);
      color: white;
    }

    .step-title {
      font-size: 12px;
      font-weight: 500;
      color: var(--gray-700);
      line-height: 1.3;
    }

    .step-item.active .step-title {
      color: var(--primary-700);
    }

    .step-item.completed .step-title {
      color: var(--success-600);
    }

    .form-content {
      margin-bottom: var(--spacing-6);
    }

    .navigation-section {
      position: sticky;
      bottom: var(--spacing-4);
      z-index: 10;
    }

    .navigation-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-4);
    }

    .step-info {
      flex: 1;
      text-align: center;
    }

    .current-step-title {
      font-weight: 600;
      color: var(--gray-900);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
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
      text-align: center;
    }

    .modal-body {
      padding: var(--spacing-6);
    }

    .success-info {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-4);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-2) 0;
    }

    .info-item:not(:last-child) {
      border-bottom: 1px solid var(--gray-200);
    }

    .info-label {
      font-weight: 500;
      color: var(--gray-700);
    }

    .info-value {
      font-weight: 600;
      color: var(--gray-900);
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      border-top: 1px solid var(--gray-200);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .steps-list {
        grid-template-columns: 1fr;
      }

      .navigation-buttons {
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .step-info {
        order: -1;
      }

      .modal-content {
        margin: var(--spacing-2);
        max-width: none;
      }

      .modal-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FormulaireComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;
  isSaving = false;
  isEditMode = false;
  formulaireId: number | null = null;
  patientId: number | null = null;
  showSuccessModal = false;
  generatedIUN = '';

  formulaireData: Partial<FormulaireData> = {
    cadreConsultation: {},
    origineDemande: {},
    typeAlcool: {},
    entourageSpa: {},
    typeSpaEntourage: {},
    droguesActuelles: {},
    substanceInitiation: {},
    substancePrincipale: {},
    voieAdministration: {},
    testVih: {},
    testVhc: {},
    testVhb: {},
    testSyphilis: {},
    tentativeSevrageDetails: {}
  };

  steps: FormulaireStep[] = [
    {
      id: 1,
      title: 'Informations structure/centre & usager SPA',
      isValid: false,
      isCompleted: false
    },
    {
      id: 2,
      title: 'Consommation tabac & alcool',
      isValid: false,
      isCompleted: false
    },
    {
      id: 3,
      title: 'Consommation de substances psychoactives',
      isValid: false,
      isCompleted: false
    },
    {
      id: 4,
      title: 'Comportements liés à la consommation et tests de dépistage',
      isValid: false,
      isCompleted: false
    },
    {
      id: 5,
      title: 'Comorbidités',
      isValid: false,
      isCompleted: false
    },
    {
      id: 6,
      title: 'Décès induit par les SPA dans l\'entourage',
      isValid: false,
      isCompleted: false
    }
  ];

  constructor(
      private router: Router,
      private datePipe: DatePipe,
      private formulaireService: FormulaireService,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifier si nous sommes en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.formulaireId = +params['id'];
        this.isEditMode = true;
        this.loadFormulaire();
      } else {
        // Vérifier si un ID de patient est fourni dans les paramètres de requête
        this.route.queryParams.subscribe(queryParams => {
          if (queryParams['patientId']) {
            this.patientId = +queryParams['patientId'];
          }
        });
        this.initializeFormData();
      }
    });
  }

  private loadFormulaire(): void {
    if (!this.formulaireId) return;

    console.log('Chargement du formulaire ID:', this.formulaireId);

    this.isSaving = true;
    this.formulaireService.getFormulaireById(this.formulaireId).subscribe({
      next: (data) => {
        console.log('Données du formulaire chargées:', data);
        // Convertir les données du formulaire au format attendu
        this.formulaireData = this.convertApiDataToFormData(data);
        this.isSaving = false;

        // Marquer toutes les étapes comme valides
        this.steps.forEach(step => {
          step.isValid = true;
          step.isCompleted = true;
        });

        // Si le formulaire contient un patient, on le stocke pour pouvoir le réutiliser
        if (data && data.patient && data.patient.id) {
          this.patientId = data.patient.id;
          console.log('ID patient récupéré depuis data.patient:', this.patientId);
        } else if (data && data.patientId) {
          this.patientId = data.patientId;
          console.log('ID patient récupéré depuis data.patientId:', this.patientId);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du formulaire:', error);
        this.isSaving = false;
        this.router.navigate(['/mes-formulaires']);
      }
    });
  }

  private convertApiDataToFormData(apiData: any): Partial<FormulaireData> {
    // Convertir les chaînes JSON en objets
    const formData: Partial<FormulaireData> = { ...apiData };
    console.log('Données API brutes:', apiData);

    // Convertir les champs JSON
    try {
      // Fonction utilitaire pour parser les champs JSON
      const parseJsonField = (field: any): any => {
        if (!field) return {};
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch (e) {
            console.error(`Erreur de parsing JSON pour le champ:`, e);
            return {};
          }
        }
        return field;
      };

      // Appliquer le parsing à tous les champs JSON
      formData.cadreConsultation = parseJsonField(apiData.cadreConsultation);
      formData.origineDemande = parseJsonField(apiData.origineDemande);
      formData.typeAlcool = parseJsonField(apiData.typeAlcool);
      formData.entourageSpa = parseJsonField(apiData.entourageSpa);
      formData.typeSpaEntourage = parseJsonField(apiData.typeSpaEntourage);
      formData.droguesActuelles = parseJsonField(apiData.droguesActuelles);
      formData.substanceInitiation = parseJsonField(apiData.substanceInitiation);
      formData.substancePrincipale = parseJsonField(apiData.substancePrincipale);
      formData.voieAdministration = parseJsonField(apiData.voieAdministration);
      formData.testVih = parseJsonField(apiData.testVih);
      formData.testVhc = parseJsonField(apiData.testVhc);
      formData.testVhb = parseJsonField(apiData.testVhb);
      formData.testSyphilis = parseJsonField(apiData.testSyphilis);
      formData.tentativeSevrageDetails = parseJsonField(apiData.tentativeSevrageDetails);

      // Conversion des dates
      if (apiData.dateConsultation && typeof apiData.dateConsultation === 'string') {
        formData.dateConsultation = new Date(apiData.dateConsultation);
      }

      if (apiData.dateNaissance && typeof apiData.dateNaissance === 'string') {
        formData.dateNaissance = new Date(apiData.dateNaissance);
      }

      console.log('Données formulaire après conversion:', formData);
    } catch (error) {
      console.error('Erreur lors de la conversion des données JSON:', error);
    }

    return formData;
  }

  /* Ancienne méthode de conversion (à supprimer)
  private convertApiDataToFormDataOld(apiData: any): Partial<FormulaireData> {
    // Convertir les chaînes JSON en objets
    const formData: Partial<FormulaireData> = { ...apiData };

    // Convertir les champs JSON
    try {
      if (typeof apiData.cadreConsultation === 'string' && apiData.cadreConsultation) {
        formData.cadreConsultation = JSON.parse(apiData.cadreConsultation);
      }
      if (typeof apiData.origineDemande === 'string' && apiData.origineDemande) {
        formData.origineDemande = JSON.parse(apiData.origineDemande);
      }
      if (typeof apiData.typeAlcool === 'string' && apiData.typeAlcool) {
        formData.typeAlcool = JSON.parse(apiData.typeAlcool);
      }
      if (typeof apiData.entourageSpa === 'string' && apiData.entourageSpa) {
        formData.entourageSpa = JSON.parse(apiData.entourageSpa);
      }
      if (typeof apiData.typeSpaEntourage === 'string' && apiData.typeSpaEntourage) {
        formData.typeSpaEntourage = JSON.parse(apiData.typeSpaEntourage);
      }
      if (typeof apiData.droguesActuelles === 'string' && apiData.droguesActuelles) {
        formData.droguesActuelles = JSON.parse(apiData.droguesActuelles);
      }
      if (typeof apiData.substanceInitiation === 'string' && apiData.substanceInitiation) {
        formData.substanceInitiation = JSON.parse(apiData.substanceInitiation);
      }
      if (typeof apiData.substancePrincipale === 'string' && apiData.substancePrincipale) {
        formData.substancePrincipale = JSON.parse(apiData.substancePrincipale);
      }
      if (typeof apiData.voieAdministration === 'string' && apiData.voieAdministration) {
        formData.voieAdministration = JSON.parse(apiData.voieAdministration);
      }
      if (typeof apiData.testVih === 'string' && apiData.testVih) {
        formData.testVih = JSON.parse(apiData.testVih);
      }
      if (typeof apiData.testVhc === 'string' && apiData.testVhc) {
        formData.testVhc = JSON.parse(apiData.testVhc);
      }
      if (typeof apiData.testVhb === 'string' && apiData.testVhb) {
        formData.testVhb = JSON.parse(apiData.testVhb);
      }
      if (typeof apiData.testSyphilis === 'string' && apiData.testSyphilis) {
        formData.testSyphilis = JSON.parse(apiData.testSyphilis);
      }
      if (typeof apiData.tentativeSevrageDetails === 'string' && apiData.tentativeSevrageDetails) {
        formData.tentativeSevrageDetails = JSON.parse(apiData.tentativeSevrageDetails);
      }
    } catch (error) {
      console.error('Erreur lors de la conversion des données JSON:', error);
    }

    return formData;
  }*/

  private initializeFormData(): void {
    // Initialize with default values
    this.formulaireData = {
      cadreConsultation: {},
      origineDemande: {},
      typeAlcool: {},
      entourageSpa: {},
      typeSpaEntourage: {},
      droguesActuelles: {},
      substanceInitiation: {},
      substancePrincipale: {},
      voieAdministration: {},
      testVih: {},
      testVhc: {},
      testVhb: {},
      testSyphilis: {},
      tentativeSevrageDetails: {}
    };
  }

  onStepDataChange(data: Partial<FormulaireData>): void {
    // Fusionner les données en préservant les objets imbriqués
    this.formulaireData = this.mergeDeep(this.formulaireData, data);
  }

  // Fonction pour fusionner profondément deux objets
  private mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;

    function isObject(item: any): boolean {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }
  }

  onStepValidationChange(stepId: number, isValid: boolean): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.isValid = isValid;
    }
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < this.totalSteps) {
      // Mark current step as completed
      const currentStepObj = this.steps.find(s => s.id === this.currentStep);
      if (currentStepObj) {
        currentStepObj.isCompleted = true;
      }

      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isCurrentStepValid(): boolean {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.isValid : false;
  }

  isFormValid(): boolean {
    return this.steps.every(step => step.isValid);
  }

  getCurrentStepTitle(): string {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.title : '';
  }

  async submitForm(): Promise<void> {
    if (!this.isFormValid() || this.isSaving) {
      return;
    }

    this.isSaving = true;

    // Préparer les données pour l'API
    const formData = this.prepareFormDataForApi();


    // Appeler l'API pour sauvegarder ou mettre à jour le formulaire
    const apiCall = this.isEditMode && this.formulaireId
        ? this.formulaireService.updateFormulaire(this.formulaireId, formData)
        : this.formulaireService.createFormulaire(formData);

    console.log('Mode édition:', this.isEditMode, 'ID:', this.formulaireId);
    console.log('Données envoyées à l\'API:', formData);

    apiCall.subscribe({
      next: (response) => {
        console.log('Réponse de l\'API:', response);
        this.isSaving = false;

        // Récupérer l'identifiant unique généré
        this.generatedIUN = response.identifiantUnique || response.iun;

        // Marquer la dernière étape comme complétée
        const finalStep = this.steps.find(s => s.id === this.totalSteps);
        if (finalStep) {
          finalStep.isCompleted = true;
        }

        this.showSuccessModal = true;
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Erreur lors de la sauvegarde:', error);

        let errorMessage = 'Une erreur est survenue lors de la sauvegarde.';

        if (error.error) {
          if (error.error.message) {
            errorMessage = error.error.message;
          }

          if (error.error.errors) {
            errorMessage += ' Détails: ' + Object.entries(error.error.errors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join(', ');
          }
        }

        // TODO: Afficher un message d'erreur à l'utilisateur
        alert('Erreur lors de la sauvegarde: ' + errorMessage);
      }
    });
  }

  private prepareFormDataForApi(): any {
    // Convertir les objets en chaînes JSON pour l'API
    // Créer une copie pour éviter de modifier l'original
    const formData: any = JSON.parse(JSON.stringify(this.formulaireData));

    // Ajouter l'ID du patient si disponible
    if (this.patientId) {
      formData.patientId = this.patientId;
    }

    // S'assurer que les dates sont au bon format
    if (formData.dateNaissance && formData.dateNaissance instanceof Date) {
      formData.dateNaissance = this.formatDate(formData.dateNaissance);
    }

    if (formData.dateConsultation && formData.dateConsultation instanceof Date) {
      formData.dateConsultation = this.formatDate(formData.dateConsultation);
    }

    // Convertir les objets en chaînes JSON
   // if (formData.cadreConsultation) {
      // Vérifier si c'est déjà une chaîne
    // if (typeof formData.cadreConsultation !== 'string') {

    //   formData.cadreConsultation = JSON.stringify(formData.cadreConsultation || {});
    // } else if (formData.cadreConsultation === '') {
    //  formData.cadreConsultation = '{}';
    //  }
    // }
    //else {
    //  formData.cadreConsultation = '{}';
    //}
/*
    if (formData.origineDemande) {
      if (typeof formData.origineDemande !== 'string') {
        formData.origineDemande = JSON.stringify(formData.origineDemande || {});
      } else if (formData.origineDemande === '') {
        formData.origineDemande = '{}';
      }
    }
    else {
      formData.origineDemande = '{}';
    }

    if (formData.typeAlcool) {
      if (typeof formData.typeAlcool !== 'string') {
        formData.typeAlcool = JSON.stringify(formData.typeAlcool || {});
      } else if (formData.typeAlcool === '') {
        formData.typeAlcool = '{}';
      }
    }
    else {
      formData.typeAlcool = '{}';
    }

    if (formData.entourageSpa) {
      if (typeof formData.entourageSpa !== 'string') {
        formData.entourageSpa = JSON.stringify(formData.entourageSpa || {});
      } else if (formData.entourageSpa === '') {
        formData.entourageSpa = '{}';
      }
    }
    else {
      formData.entourageSpa = '{}';
    }

    if (formData.typeSpaEntourage) {
      if (typeof formData.typeSpaEntourage !== 'string') {
        formData.typeSpaEntourage = JSON.stringify(formData.typeSpaEntourage || {});
      } else if (formData.typeSpaEntourage === '') {
        formData.typeSpaEntourage = '{}';
      }
    }
    else {
      formData.typeSpaEntourage = '{}';
    }

    if (formData.droguesActuelles) {
      if (typeof formData.droguesActuelles !== 'string') {
        formData.droguesActuelles = JSON.stringify(formData.droguesActuelles || {});
      } else if (formData.droguesActuelles === '') {
        formData.droguesActuelles = '{}';
      }
    }
    else {
      formData.droguesActuelles = '{}';
    }

    if (formData.substanceInitiation) {
      if (typeof formData.substanceInitiation !== 'string') {
        formData.substanceInitiation = JSON.stringify(formData.substanceInitiation || {});
      } else if (formData.substanceInitiation === '') {
        formData.substanceInitiation = '{}';
      }
    }
    else {
      formData.substanceInitiation = '{}';
    }

    if (formData.substancePrincipale) {
      if (typeof formData.substancePrincipale !== 'string') {
        formData.substancePrincipale = JSON.stringify(formData.substancePrincipale || {});
      } else if (formData.substancePrincipale === '') {
        formData.substancePrincipale = '{}';
      }
    }
    else {
      formData.substancePrincipale = '{}';
    }

    if (formData.voieAdministration) {
      if (typeof formData.voieAdministration !== 'string') {
        formData.voieAdministration = JSON.stringify(formData.voieAdministration || {});
      } else if (formData.voieAdministration === '') {
        formData.voieAdministration = '{}';
      }
    }
    else {
      formData.voieAdministration = '{}';
    }

    if (formData.testVih) {
      if (typeof formData.testVih !== 'string') {
        formData.testVih = JSON.stringify(formData.testVih || {});
      } else if (formData.testVih === '') {
        formData.testVih = '{}';
      }
    }
    else {
      formData.testVih = '{}';
    }

    if (formData.testVhc) {
      if (typeof formData.testVhc !== 'string') {
        formData.testVhc = JSON.stringify(formData.testVhc || {});
      } else if (formData.testVhc === '') {
        formData.testVhc = '{}';
      }
    }
    else {
      formData.testVhc = '{}';
    }

    if (formData.testVhb) {
      if (typeof formData.testVhb !== 'string') {
        formData.testVhb = JSON.stringify(formData.testVhb || {});
      } else if (formData.testVhb === '') {
        formData.testVhb = '{}';
      }
    }
    else {
      formData.testVhb = '{}';
    }

    if (formData.testSyphilis) {
      if (typeof formData.testSyphilis !== 'string') {
        formData.testSyphilis = JSON.stringify(formData.testSyphilis || {});
      } else if (formData.testSyphilis === '') {
        formData.testSyphilis = '{}';
      }
    }
    else {
      formData.testSyphilis = '{}';
    }

    if (formData.tentativeSevrageDetails) {
      if (typeof formData.tentativeSevrageDetails !== 'string') {
        formData.tentativeSevrageDetails = JSON.stringify(formData.tentativeSevrageDetails || {});
      } else if (formData.tentativeSevrageDetails === '') {
        formData.tentativeSevrageDetails = '{}';
      }
    }
    else {
      formData.tentativeSevrageDetails = '{}';
    }
*/
    return formData;
  }

  // Formater une date au format ISO (YYYY-MM-DD)
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  createNewForm(): void {
    this.showSuccessModal = false;
    // Reset form
    this.currentStep = 1;
    this.initializeFormData();
    this.steps.forEach(step => {
      step.isValid = false;
      step.isCompleted = false;
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    if (this.isEditMode) {
      this.router.navigate(['/mes-formulaires/detail', this.formulaireId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getCurrentDateTimeFormatted(): string {
    return this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') || '';
  }
}
