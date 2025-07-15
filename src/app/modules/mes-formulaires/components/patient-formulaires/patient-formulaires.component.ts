import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormulaireService } from '../../../../services/formulaire.service';
import { PatientService } from '../../../../services/patient.service';
import { AuthService } from '../../../../services/auth.service';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-patient-formulaires',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="patient-formulaires-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Formulaires du patient</h1>
          <p class="page-description" *ngIf="patient">
            {{ patient.prenom }} {{ patient.nom }} ({{ patient.codePatient }})
          </p>
        </div>
        <button 
          class="btn btn-secondary"
          routerLink="/mes-formulaires"
          type="button"
        >
          ← Retour
        </button>
      </div>

      <!-- Informations patient -->
      <div class="patient-info-card card" *ngIf="patient">
        <div class="card-header">
          <h3 class="section-title">Informations du patient</h3>
        </div>
        <div class="card-body">
          <div class="patient-info-grid">
            <div class="info-item">
              <span class="info-label">Nom complet</span>
              <span class="info-value">{{ patient.prenom }} {{ patient.nom }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Code patient</span>
              <span class="info-value code-patient">{{ patient.codePatient }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date de naissance</span>
              <span class="info-value">{{ patient.dateNaissance | date:'dd/MM/yyyy' }} ({{ calculateAge(patient.dateNaissance) }} ans)</span>
            </div>
            <div class="info-item">
              <span class="info-label">Genre</span>
              <span class="info-value">{{ patient.genre === 'HOMME' ? 'Homme' : 'Femme' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Structure</span>
              <span class="info-value">{{ patient.structure?.nom }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nombre de formulaires</span>
              <span class="info-value">{{ formulaires.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des formulaires -->
      <div class="formulaires-table-container card" *ngIf="!isLoading && formulaires.length > 0; else noFormulaires">
        <div class="card-header">
          <h3 class="section-title">Historique des formulaires</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="formulaires-table">
              <thead>
                <tr>
                  <th>Date de consultation</th>
                  <th>ID Formulaire</th>
                  <th>Motif de consultation</th>
                  <th>Substance consommée en cours</th>
                  <th>Conduite à tenir</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let formulaire of formulaires" class="formulaire-row">
                  <td>
                    <div class="date-info">
                      <div class="date-value">{{ formulaire.dateConsultation | date:'dd/MM/yyyy' }}</div>
                      <div class="date-day">{{ formulaire.dateConsultation | date:'EEEE' }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="formulaire-id">{{ formulaire.identifiantUnique }}</div>
                  </td>
                  <td>
                    <div class="motif-consultation">
                      {{ getMotifConsultation(formulaire) }}
                    </div>
                  </td>
                  <td>
                    <div class="substance-principale">
                      {{ getSubstancePrincipale(formulaire) }}
                    </div>
                  </td>
                  <td>
                    <div class="conduite-tenir">
                      {{ formulaire.conduiteATenir || 'Non spécifiée' }}
                    </div>
                  </td>
                  <td>
                    <div class="actions-menu">
                      <button 
                        class="btn btn-sm btn-secondary"
                        [routerLink]="['/mes-formulaires/detail', formulaire.id]"
                        type="button"
                        title="Voir les détails"
                      >
                        👁️
                      </button>
                      <button 
                        class="btn btn-sm btn-secondary"
                        [routerLink]="['/formulaire', 'edit', formulaire.id]"
                        type="button"
                        title="Modifier"
                        *ngIf="canEditFormulaire(formulaire)"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Bouton pour créer un nouveau formulaire -->
      <div class="actions-container">
        <button 
          class="btn btn-primary"
          [routerLink]="['/formulaire']"
          [queryParams]="{patientId: patientId}"
          type="button"
        >
          <span class="btn-icon">➕</span>
          Nouveau formulaire pour ce patient
        </button>
      </div>
    </div>

    <ng-template #noFormulaires>
      <div class="no-results card" *ngIf="!isLoading">
        <div class="card-body text-center">
          <div class="no-results-icon">📋</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Aucun formulaire trouvé
          </h3>
          <p class="text-gray-600 mb-6">
            Ce patient n'a pas encore de formulaire enregistré.
          </p>
          <button 
            class="btn btn-primary"
            [routerLink]="['/formulaire']"
            [queryParams]="{patientId: patientId}"
            type="button"
          >
            Créer un formulaire
          </button>
        </div>
      </div>
    </ng-template>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .patient-formulaires-container {
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

    .patient-info-card {
      margin-bottom: var(--spacing-6);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .patient-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-4);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .info-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--gray-900);
    }

    .code-patient {
      font-family: monospace;
      color: var(--primary-700);
      background-color: var(--primary-50);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    .formulaires-table-container {
      margin-bottom: var(--spacing-6);
    }

    .table-responsive {
      overflow-x: auto;
    }

    .formulaires-table {
      width: 100%;
      border-collapse: collapse;
    }

    .formulaires-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .formulaires-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .formulaire-row:hover {
      background-color: var(--gray-50);
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .date-value {
      font-weight: 600;
      color: var(--gray-900);
    }

    .date-day {
      font-size: 12px;
      color: var(--gray-500);
      text-transform: capitalize;
    }

    .formulaire-id {
      font-family: monospace;
      font-weight: 500;
      color: var(--primary-700);
      background-color: var(--primary-50);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    .motif-consultation,
    .substance-principale,
    .conduite-tenir {
      font-size: 14px;
      color: var(--gray-700);
    }

    .actions-menu {
      display: flex;
      gap: var(--spacing-2);
    }

    .actions-menu .btn {
      padding: var(--spacing-2);
      min-width: 32px;
    }

    .actions-container {
      display: flex;
      justify-content: center;
      margin-top: var(--spacing-8);
    }

    .no-results {
      max-width: 600px;
      margin: 0 auto;
    }

    .no-results-icon {
      font-size: 64px;
      margin-bottom: var(--spacing-6);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-12);
      gap: var(--spacing-4);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .patient-info-grid {
        grid-template-columns: 1fr;
      }
      
      .formulaires-table {
        font-size: 14px;
      }
      
      .formulaires-table th,
      .formulaires-table td {
        padding: var(--spacing-3);
      }
    }
  `]
})
export class PatientFormulairesComponent implements OnInit {
  patientId: number = 0;
  patient: any = null;
  formulaires: any[] = [];
  isLoading: boolean = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private patientService: PatientService,
      private formulaireService: FormulaireService,
      private authService: AuthService
 ) {}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.patientId = +params['id'];
    if (this.patientId) {
      this.loadPatient();
      this.loadFormulaires();
    } else {
      this.router.navigate(['/mes-formulaires']);
    }
  });
}

loadPatient(): void {
  this.isLoading = true;

  this.patientService.getPatientById(this.patientId).subscribe({
    next: (data) => {
      this.patient = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erreur lors du chargement du patient:', error);
      this.isLoading = false;
      this.router.navigate(['/mes-formulaires']);
    }
  });
}

loadFormulaires(): void {
  this.isLoading = true;

  this.formulaireService.getFormulairesByPatientId(this.patientId).subscribe({
    next: (data) => {
      this.formulaires = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des formulaires:', error);
      this.isLoading = false;
    }
  });
}

calculateAge(dateNaissance: string): number {
  const today = new Date();
  const birthDate = new Date(dateNaissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

getSubstancePrincipale(formulaire: any): string {
  // Extraire la substance principale du JSON
  try {
    if (!formulaire || !formulaire.substancePrincipale) {
      return 'Non renseignée';
    }

    const substancePrincipale = typeof formulaire.substancePrincipale === 'string'
        ? JSON.parse(formulaire.substancePrincipale)
        : formulaire.substancePrincipale;

    // Logique pour déterminer la substance principale
    // Parcourir les propriétés et retourner la première qui est true
    const substances = {
      'cannabis': 'Cannabis',
      'heroine': 'Héroïne',
      'cocaine': 'Cocaïne',
      'ecstasy': 'Ecstasy',
      'amphetamines': 'Amphétamines',
      'lsd': 'LSD',
      'opium': 'Opium',
      'morphiniques': 'Morphiniques',
      'hypnotiques': 'Hypnotiques',
      'produitsInhaler': 'Produits à inhaler',
      'pregabaline': 'Prégabaline',
      'ketamines': 'Kétamine'
    };

    for (const [key, label] of Object.entries(substances)) {
      if (substancePrincipale[key]) {
        return label;
      }
    }

    // Vérifier s'il y a une substance "autre" avec précision
    if (substancePrincipale.autre && substancePrincipale.autrePrecision) {
      return substancePrincipale.autrePrecision;
    }

    return 'Non spécifiée';
  } catch (error) {
    console.error('Erreur lors de l\'extraction de la substance principale:', error);
    return 'Erreur de lecture';
  }
}

getMotifConsultation(formulaire: any): string {
  try {
    if (!formulaire) return 'Non spécifié';

    // Si le motif de consultation antérieure est disponible, l'utiliser en priorité
    if (formulaire.motifConsultationAnterieure) {
      return formulaire.motifConsultationAnterieure;
    }

    // Vérifier si le cadre de consultation est disponible
    if (formulaire.cadreConsultation) {
      const cadreConsultation = typeof formulaire.cadreConsultation === 'string'
          ? JSON.parse(formulaire.cadreConsultation)
          : formulaire.cadreConsultation;

      // Construire une liste des motifs de consultation
      const motifs = [];

      if (cadreConsultation.addictologie) motifs.push('Addictologie');
      if (cadreConsultation.psychiatrie) motifs.push('Psychiatrie');
      if (cadreConsultation.psychologique) motifs.push('Psychologique');
      if (cadreConsultation.medecineGenerale) motifs.push('Médecine générale');
      if (cadreConsultation.neurologique) motifs.push('Neurologique');
      if (cadreConsultation.infectieux) motifs.push('Infectieux');
      if (cadreConsultation.espaceAmisJeunes) motifs.push('Espace amis jeunes');
      if (cadreConsultation.echangeMateriel) motifs.push('Échange de matériel');
      if (cadreConsultation.rehabilitation) motifs.push('Réhabilitation');
      if (cadreConsultation.urgenceMedicale) motifs.push('Urgence médicale');
      if (cadreConsultation.urgenceChirurgicale) motifs.push('Urgence chirurgicale');
      if (cadreConsultation.depistage) motifs.push('Dépistage');
      if (cadreConsultation.autre && cadreConsultation.autrePrecision) {
        motifs.push(cadreConsultation.autrePrecision);
      }

      return motifs.length > 0 ? motifs.join(', ') : 'Non spécifié';
    }

    return 'Non spécifié';
  } catch (error) {
    console.error('Erreur lors de l\'extraction du motif de consultation:', error);
    return 'Erreur de lecture';
  }
}

canEditFormulaire(formulaire: any): boolean {
  const currentUser = this.authService.getCurrentUser();
  if (!currentUser) return false;

  // Super admin peut tout modifier
  if (this.authService.hasRole(UserRole.SUPER_ADMIN)) return true;

  // Admin structure peut modifier les formulaires de sa structure
  if (this.authService.hasRole(UserRole.ADMIN_STRUCTURE)) {
    return formulaire.structure.id === currentUser.structureId;
  }

  // Utilisateur ne peut modifier que ses propres formulaires
  if (this.authService.hasRole(UserRole.UTILISATEUR)) {
    return formulaire.utilisateur.id === currentUser.id;
  }

  return false;
}
}
