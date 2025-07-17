import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../../../services/patient.service';
import { PatientAccessService } from '../../../../services/patient-access.service';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="patient-search-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Recherche de patients</h1>
          <p class="page-description">
            Recherchez des patients dans d'autres structures et demandez l'accès
          </p>
        </div>
        <button
            class="btn btn-secondary"
            routerLink="/patient-access/requests"
            type="button"
        >
          Mes demandes d'accès
        </button>
      </div>

      <!-- Filtres de recherche -->
      <div class="search-filters card">
        <div class="card-body">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="form-label">Code patient</label>
              <input
                  type="text"
                  class="form-input"
                  placeholder="Ex: P-2025-00001"
                  [(ngModel)]="searchCode"
                  (input)="onSearchChange()"
              >
            </div>

            <div class="filter-group">
              <label class="form-label">Structure</label>
              <select
                  class="form-select"
                  [(ngModel)]="selectedStructureId"
                  (change)="onSearchChange()"
              >
                <option value="">Toutes les structures</option>
                <option *ngFor="let structure of structures" [value]="structure.id">
                  {{ structure.nom }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="form-label">&nbsp;</label>
              <button
                  class="btn btn-primary w-full"
                  (click)="searchPatients()"
                  [disabled]="isLoading"
                  type="button"
              >
                <span *ngIf="!isLoading">Rechercher</span>
                <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                  <div class="loading-spinner-sm"></div>
                  Recherche...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div class="search-results card" *ngIf="!isLoading && patients.length > 0">
        <div class="card-header">
          <h3 class="card-title">Résultats ({{ patients.length }})</h3>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="patients-table">
              <thead>
                <tr>
                  <th>Code patient</th>
                  <th>Structure</th>
                  <th>Genre</th>
                  <th>Date de naissance</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let patient of patients">
                  <td>
                    <div class="patient-code">{{ patient.codePatient }}</div>
                  </td>
                  <td>
                    <div class="structure-info">
                      <div class="structure-name">{{ patient.structure.nom }}</div>
                      <div class="structure-type">{{ patient.structure.type }}</div>
                    </div>
                  </td>
                  <td>{{ patient.genre === 'HOMME' ? 'Homme' : 'Femme' }}</td>
                  <td>{{ patient.dateNaissance | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="getAccessStatusClass(patient)">
                      {{ getAccessStatusLabel(patient) }}
                    </span>
                  </td>
                  <td>
                    <div class="actions-menu">
                      <button
                          *ngIf="canRequestAccess(patient)"
                          class="btn btn-sm btn-primary"
                          (click)="requestAccess(patient)"
                          [disabled]="isRequestingAccess"
                          type="button"
                          title="Demander l'accès"
                      >
                        🔒 Demander l'accès
                      </button>
                      <button
                          *ngIf="hasAccess(patient)"
                          class="btn btn-sm btn-secondary"
                          [routerLink]="['/mes-formulaires/patient', patient.id]"
                          type="button"
                          title="Voir les formulaires"
                      >
                        👁️ Voir les formulaires
                      </button>
                      <div *ngIf="isPending(patient)" class="pending-info">
                        Demande en attente
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Message si aucun résultat -->
      <div class="no-results card" *ngIf="!isLoading && patients.length === 0 && hasSearched">
        <div class="card-body text-center">
          <div class="no-results-icon">🔍</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Aucun patient trouvé
          </h3>
          <p class="text-gray-600 mb-6">
            Aucun patient ne correspond à vos critères de recherche.
          </p>
        </div>
      </div>

      <!-- Message d'information -->
      <div class="info-card card" *ngIf="!hasSearched">
        <div class="card-body text-center">
          <div class="info-icon">ℹ️</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Recherche de patients
          </h3>
          <p class="text-gray-600 mb-6">
            Utilisez les filtres ci-dessus pour rechercher des patients dans d'autres structures.<br>
            Vous ne verrez que le code patient et les informations de base jusqu'à ce que votre demande d'accès soit approuvée.
          </p>
        </div>
      </div>

      <!-- Loading indicator -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Recherche en cours...</p>
      </div>
    </div>
  `,
  styles: [`
    .patient-search-container {
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

    .search-filters {
      margin-bottom: var(--spacing-6);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-4);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .search-results {
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

    .patient-code {
      font-family: monospace;
      font-weight: 500;
      color: var(--primary-700);
      background-color: var(--primary-50);
      padding: var(--spacing-1) var(--spacing-2);
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    .structure-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .structure-name {
      font-weight: 500;
      color: var(--gray-900);
    }

    .structure-type {
      font-size: 12px;
      color: var(--gray-600);
    }

    .status-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.no-access {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }

    .status-badge.has-access {
      background-color: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.pending {
      background-color: var(--warning-100);
      color: var(--warning-700);
    }

    .actions-menu {
      display: flex;
      gap: var(--spacing-2);
    }

    .pending-info {
      font-size: 12px;
      color: var(--warning-700);
      font-style: italic;
    }

    .no-results, .info-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .no-results-icon, .info-icon {
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

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top: 3px solid var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .patients-table {
        font-size: 14px;
      }

      .patients-table th,
      .patients-table td {
        padding: var(--spacing-3);
      }

      .actions-menu {
        flex-direction: column;
      }
    }
  `]
})
export class PatientSearchComponent implements OnInit {
  searchCode = '';
  selectedStructureId = '';
  patients: any[] = [];
  structures: any[] = [];
  isLoading = false;
  isRequestingAccess = false;
  hasSearched = false;
  
  // Map to track access status for each patient
  patientAccessStatus: Map<number, string> = new Map();

  constructor(
    private patientService: PatientService,
    private patientAccessService: PatientAccessService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStructures();
    this.loadMyAccessRequests();
  }

  private loadStructures(): void {
    this.userService.getStructures().subscribe({
      next: (data) => {
        this.structures = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des structures:', error);
      }
    });
  }

  private loadMyAccessRequests(): void {
    this.patientAccessService.getMyRequests().subscribe({
      next: (requests) => {
        // Update the access status map
        requests.forEach(request => {
          this.patientAccessStatus.set(
            request.patientId, 
            request.status
          );
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes d\'accès:', error);
      }
    });
  }

  onSearchChange(): void {
    // Reset results if search criteria are cleared
    if (!this.searchCode && !this.selectedStructureId) {
      this.patients = [];
      this.hasSearched = false;
    }
  }

  searchPatients(): void {
    if (!this.searchCode && !this.selectedStructureId) {
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;

    this.patientService.searchPatientsExternal(this.searchCode, this.selectedStructureId).subscribe({
      next: (data) => {
        this.patients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche des patients:', error);
        this.isLoading = false;
        this.patients = [];
      }
    });
  }

  requestAccess(patient: any): void {
    this.isRequestingAccess = true;

    this.patientAccessService.requestAccess(patient.id).subscribe({
      next: (response) => {
        this.isRequestingAccess = false;
        // Update the access status for this patient
        this.patientAccessStatus.set(patient.id, 'PENDING');
        // Refresh the list
        this.searchPatients();
      },
      error: (error) => {
        console.error('Erreur lors de la demande d\'accès:', error);
        this.isRequestingAccess = false;
      }
    });
  }

  getAccessStatusClass(patient: any): string {
    const status = this.patientAccessStatus.get(patient.id);
    
    if (!status) return 'no-access';
    if (status === 'APPROVED') return 'has-access';
    if (status === 'PENDING') return 'pending';
    
    return 'no-access';
  }

  getAccessStatusLabel(patient: any): string {
    const status = this.patientAccessStatus.get(patient.id);
    
    if (!status) return 'Accès non demandé';
    if (status === 'APPROVED') return 'Accès autorisé';
    if (status === 'PENDING') return 'Demande en attente';
    if (status === 'REJECTED') return 'Demande rejetée';
    
    return 'Accès non demandé';
  }

  canRequestAccess(patient: any): boolean {
    const status = this.patientAccessStatus.get(patient.id);
    // Can request access if no status or rejected status
    return !status || status === 'REJECTED';
  }

  hasAccess(patient: any): boolean {
    const status = this.patientAccessStatus.get(patient.id);
    return status === 'APPROVED';
  }

  isPending(patient: any): boolean {
    const status = this.patientAccessStatus.get(patient.id);
    return status === 'PENDING';
  }
}