import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaireData } from '../../../models/formulaire.model';
import { DelegationService } from '../../../../../services/delegation.service';
import { CountryService } from '../../../../../services/country.service';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step1.component.html',
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
      padding: var(--spacing-6);
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
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

    .section-description {
      color: var(--gray-600);
      font-size: 14px;
      margin-top: var(--spacing-2);
      margin-bottom: var(--spacing-4);
    }

    .form-group {
      margin-bottom: var(--spacing-6);
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

    .nested-options {
      margin-left: var(--spacing-6);
      margin-top: var(--spacing-3);
      padding-left: var(--spacing-4);
      border-left: 2px solid var(--primary-200);
    }

    .form-input.error, .form-select.error {
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
      .radio-options {
        flex-direction: column;
        gap: var(--spacing-3);
      }

      .checkbox-grid {
        grid-template-columns: 1fr;
      }

      .nested-options {
        margin-left: var(--spacing-4);
      }
    }
  `]
})
export class Step1Component implements OnInit, OnChanges {
  @Input() data: Partial<FormulaireData> = {};
  @Input() showValidationErrors = false;
  @Output() dataChange = new EventEmitter<Partial<FormulaireData>>();
  @Output() validationChange = new EventEmitter<boolean>();

  localData: Partial<FormulaireData> = {};
  gouvernorats: any[] = [];
  delegations: any[] = [];
  countries: any[] = [];

  constructor(
    private delegationService: DelegationService,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.loadGouvernorats();
    this.loadCountries();
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeData();
    }
  }

  private initializeData(): void {
    // Create a deep copy of the input data
    this.localData = JSON.parse(JSON.stringify(this.data || {}));
    
    // Initialize empty objects if they don't exist
    if (!this.localData.cadreConsultation) {
      this.localData.cadreConsultation = {};
    }
    
    if (!this.localData.origineDemande) {
      this.localData.origineDemande = {};
    }

    // Handle patient data if available
    if (this.data.patient) {
      // Copy patient data
      if (!this.localData.nom && this.data.patient.nom) {
        this.localData.nom = this.data.patient.nom;
      }
      
      if (!this.localData.prenom && this.data.patient.prenom) {
        this.localData.prenom = this.data.patient.prenom;
      }
      
      if (!this.localData.genre && this.data.patient.genre) {
        this.localData.genre = this.data.patient.genre;
      }
      
      // Handle date of birth
      if (this.data.patient.dateNaissance) {
        if (typeof this.data.patient.dateNaissance === 'string') {
          // Convert string to Date object
          this.localData.dateNaissance = new Date(this.data.patient.dateNaissance);
        } else {
          this.localData.dateNaissance = this.data.patient.dateNaissance;
        }
      }
    }

    // Handle date consultation
    if (this.data.dateConsultation) {
      if (typeof this.data.dateConsultation === 'string') {
        // Handle ISO date string format
        const dateStr = this.data.dateConsultation.split('T')[0];
        this.localData.dateConsultation = new Date(dateStr);
      } else {
        this.localData.dateConsultation = this.data.dateConsultation;
      }
    }

    // Load delegations if gouvernorat is selected
    if (this.localData.gouvernoratResidence) {
      this.loadDelegations(this.localData.gouvernoratResidence);
    }

    this.validateStep();
  }

  private loadGouvernorats(): void {
    this.delegationService.getGouvernorat().subscribe({
      next: (data) => {
        this.gouvernorats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des gouvernorats:', error);
      }
    });
  }

  private loadDelegations(gouvernoratId: any): void {
    this.delegationService.getDelegationsByGouvernorat(gouvernoratId).subscribe({
      next: (data) => {
        this.delegations = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des délégations:', error);
      }
    });
  }

  private loadCountries(): void {
    this.countryService.getAllCountries().subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pays:', error);
      }
    });
  }

  onSecteurChange(): void {
    // Reset related fields when sector changes
    this.localData.ongPrecision = undefined;
    this.localData.ministere = undefined;
    this.onFieldChange();
  }

  onResidenceChange(): void {
    // Reset related fields when residence changes
    this.localData.gouvernoratResidence = undefined;
    this.localData.delegationResidence = undefined;
    this.localData.paysResidence = undefined;
    this.delegations = [];
    this.onFieldChange();
  }

  onGouvernoratResidenceChange(): void {
    // Reset delegation when gouvernorat changes
    this.localData.delegationResidence = undefined;
    
    // Load delegations for the selected gouvernorat
    if (this.localData.gouvernoratResidence) {
      this.loadDelegations(this.localData.gouvernoratResidence);
    } else {
      this.delegations = [];
    }
    
    this.onFieldChange();
  }

  onConsultationAnterieureChange(): void {
    // Reset related fields when consultation anterieure changes
    if (this.localData.consultationAnterieure === false) {
      this.localData.dateConsultationAnterieure = undefined;
      this.localData.motifConsultationAnterieure = undefined;
      this.localData.motifConsultationAnterieurePrecision = undefined;
      this.localData.causeRecidive = undefined;
      this.localData.causeRecidivePrecision = undefined;
      this.localData.causeEchecSevrage = undefined;
      this.localData.causeEchecSevragePrecision = undefined;
    }
    this.onFieldChange();
  }

  onSituationFamilialeChange(): void {
    // Reset related fields when situation familiale changes
    if (this.localData.situationFamiliale !== 'AUTRE') {
      this.localData.situationFamilialeAutre = undefined;
    }
    this.onFieldChange();
  }

  onLogement30JoursChange(): void {
    // Reset related fields when logement changes
    if (this.localData.logement30Jours !== 'AUTRE') {
      this.localData.logement30JoursAutre = undefined;
    }
    this.onFieldChange();
  }

  onActiviteSportiveChange(): void {
    // Reset related fields when activite sportive changes
    if (this.localData.activiteSportive === false) {
      this.localData.activiteSportiveFrequence = undefined;
      this.localData.activiteSportiveType = undefined;
    }
    this.onFieldChange();
  }

  onFieldChange(): void {
    // Emit data changes
    this.dataChange.emit(this.localData);
    
    // Validate the step
    this.validateStep();
  }

  private validateStep(): void {
    // Required fields for all cases
    const requiredFields = [
      'secteur',
      'structure',
      'gouvernoratStructure',
      'dateConsultation',
      'genre',
      'dateNaissance',
      'nationalite',
      'residence',
      'causeCirconstance',
      'consultationAnterieure',
      'situationFamiliale',
      'logement30Jours',
      'natureLogement',
      'profession',
      'niveauScolaire',
      'activiteSportive'
    ];

    // Conditional required fields
    if (this.localData.secteur === 'ONG' || this.localData.secteur === 'SOCIETE_CIVILE_ONG') {
      requiredFields.push('ongPrecision');
    }

    if (this.localData.secteur === 'PUBLIC') {
      requiredFields.push('ministere');
    }

    if (this.localData.residence === 'TUNISIE') {
      requiredFields.push('gouvernoratResidence', 'delegationResidence');
    } else if (this.localData.residence === 'ETRANGER') {
      requiredFields.push('paysResidence');
    }

    if (this.localData.cadreConsultation?.autre) {
      requiredFields.push('cadreConsultation.autrePrecision');
    }

    if (this.localData.origineDemande?.autre) {
      requiredFields.push('origineDemande.autrePrecision');
    }

    if (this.localData.consultationAnterieure === true) {
      requiredFields.push('dateConsultationAnterieure', 'motifConsultationAnterieure', 'causeRecidive', 'causeEchecSevrage');
      
      if (this.localData.motifConsultationAnterieure === 'Autre') {
        requiredFields.push('motifConsultationAnterieurePrecision');
      }
      
      if (this.localData.causeRecidive === 'Autre') {
        requiredFields.push('causeRecidivePrecision');
      }
      
      if (this.localData.causeEchecSevrage === 'Autre') {
        requiredFields.push('causeEchecSevragePrecision');
      }
    }

    if (this.localData.situationFamiliale === 'AUTRE') {
      requiredFields.push('situationFamilialeAutre');
    }

    if (this.localData.logement30Jours === 'AUTRE') {
      requiredFields.push('logement30JoursAutre');
    }

    if (this.localData.activiteSportive === true) {
      requiredFields.push('activiteSportiveFrequence', 'activiteSportiveType');
    }

    // Check if all required fields are filled
    const isValid = requiredFields.every(field => {
      // Handle nested fields (e.g., cadreConsultation.autrePrecision)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return this.localData[parent]?.[child] !== undefined && 
               this.localData[parent]?.[child] !== null && 
               this.localData[parent]?.[child] !== '';
      }
      
      return this.localData[field] !== undefined && 
             this.localData[field] !== null && 
             this.localData[field] !== '';
    });

    // Check if at least one cadre consultation is selected
    const hasCadreConsultation = this.localData.cadreConsultation && Object.values(this.localData.cadreConsultation).some(value => value === true);
    
    // Check if at least one origine demande is selected
    const hasOrigineDemande = this.localData.origineDemande && Object.values(this.localData.origineDemande).some(value => value === true);

    // Emit validation result
    this.validationChange.emit(isValid && hasCadreConsultation && hasOrigineDemande);
  }
}