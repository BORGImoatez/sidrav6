import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaireService } from '../../../../services/formulaire.service';
import { PatientService } from '../../../../services/patient.service';
import { AuthService } from '../../../../services/auth.service';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-mes-formulaires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="mes-formulaires-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Mes formulaires</h1>
          <p class="page-description">
            Consulter et modifier vos saisies de données SIDRA
          </p>
          <div class="search-box">
            <input
                type="text"
                class="form-input"
                placeholder="Rechercher un patient..."
                [(ngModel)]="searchTerm"
                (input)="searchPatients()"
            >
          </div>
        </div>
        <button
            class="btn btn-primary"
            routerLink="/formulaire"
            type="button"
        >
          <span class="btn-icon">➕</span>
          Nouveau formulaire
        </button>
      </div>

      <!-- Liste des patients -->
      <div class="patients-table-container card" *ngIf="!isLoading; else loadingTemplate">
        <div class="card-header">
          <h3 class="card-title">
            Patients ({{ patients.length }})
          </h3>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="patients-table">
              <thead>
              <tr>
                <th>Patient</th>
                <th>Code patient</th>
                <th>Formulaires</th>
                <th>Dernier formulaire</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let patient of patients" class="patient-row">
                <td>
                  <div class="patient-info">
                    <div class="patient-name">{{ patient.prenom }} {{ patient.nom }}</div>
                    <div class="patient-details">
                      {{ patient.genre === 'HOMME' ? 'H' : 'F' }} | {{ calculateAge(patient.dateNaissance) }} ans
                    </div>
                  </div>
                </td>
                <td>
                  <div class="code-patient">{{ patient.codePatient }}</div>
                </td>
                <td>
                  <div class="formulaires-count">{{ patient.nombreFormulaires }}</div>
                </td>
                <td>
                  <div class="last-formulaire" *ngIf="patient.dernierFormulaire">
                    {{ patient.dernierFormulaire | date:'dd/MM/yyyy' }}
                  </div>
                  <div class="no-formulaire" *ngIf="!patient.dernierFormulaire">
                    Aucun formulaire
                  </div>
                </td>
                <td>
                  <div class="actions-menu">
                    <button
                        class="btn btn-sm btn-secondary"
                        [routerLink]="['/mes-formulaires/patient', patient.id]"
                        type="button"
                        title="Voir les formulaires"
                    >
                      👁️
                    </button>
                    <button
                        class="btn btn-sm btn-primary"
                        [routerLink]="['/formulaire']"
                        [queryParams]="{patientId: patient.id}"
                        type="button"
                        title="Nouveau formulaire"
                    >
                      ➕
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Message si aucun patient trouvé -->
      <div class="no-results card" *ngIf="!isLoading && patients.length === 0">
        <div class="card-body text-center">
          <div class="no-results-icon">🔍</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Aucun patient trouvé
          </h3>
          <p class="text-gray-600 mb-6">
            Aucun patient ne correspond à votre recherche ou vous n'avez pas encore créé de formulaire.
          </p>
          <button
              class="btn btn-primary"
              routerLink="/formulaire"
              type="button"
          >
            Créer un nouveau formulaire
          </button>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Chargement des patients...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .mes-formulaires-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-8);
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

    .search-box {
      margin-top: var(--spacing-4);
      max-width: 400px;
    }

    .patients-table-container {
      margin-bottom: var(--spacing-6);
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .patients-table {
      width: 100%;
      border-collapse: collapse;
    }

    .patients-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .patients-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .patient-row:hover {
      background-color: var(--gray-50);
    }

    .patient-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .patient-name {
      font-weight: 600;
      color: var(--gray-900);
    }

    .patient-details {
      font-size: 12px;
      color: var(--gray-600);
    }

    .code-patient {
      font-family: monospace;
      font-weight: 500;
      color: var(--primary-700);
      background-color: var(--primary-50);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    .formulaires-count {
      font-weight: 600;
      color: var(--gray-900);
      text-align: center;
    }

    .last-formulaire {
      color: var(--gray-700);
    }

    .no-formulaire {
      color: var(--gray-500);
      font-style: italic;
      font-size: 12px;
    }

    .actions-menu {
      display: flex;
      gap: var(--spacing-2);
    }

    .actions-menu .btn {
      padding: var(--spacing-2);
      min-width: 32px;
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

      .patients-table {
        font-size: 14px;
      }

      .patients-table th,
      .patients-table td {
        padding: var(--spacing-3);
      }
    }
  `]
})
export class MesFormulairesComponent implements OnInit {
  patients: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
      private patientService: PatientService,
      private formulaireService: FormulaireService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;

    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des patients:', error);
        this.isLoading = false;
      }
    });
  }

  searchPatients(): void {
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.loadPatients();
      return;
    }

    this.isLoading = true;

    this.patientService.getAllPatients(this.searchTerm).subscribe({
      next: (data) => {
        this.patients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des patients:', error);
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

  getUserRole(): UserRole | null {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.role : null;
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole(UserRole.SUPER_ADMIN);
  }

  isAdminStructure(): boolean {
    return this.authService.hasRole(UserRole.ADMIN_STRUCTURE);
  }
}
