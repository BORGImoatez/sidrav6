import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientAccessService } from '../../../../services/patient-access.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-access-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="access-requests-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Demandes d'accès aux patients</h1>
          <p class="page-description">
            Gérez les demandes d'accès aux patients
          </p>
        </div>
        <button
            class="btn btn-secondary"
            routerLink="/patient-access"
            type="button"
        >
          Retour à la recherche
        </button>
      </div>

      <!-- Onglets -->
      <div class="tabs-container">
        <div class="tabs">
          <button
              class="tab-button"
              [class.active]="activeTab === 'sent'"
              (click)="setActiveTab('sent')"
              type="button"
          >
            Demandes envoyées
          </button>
          <button
              class="tab-button"
              [class.active]="activeTab === 'received'"
              (click)="setActiveTab('received')"
              type="button"
          >
            Demandes reçues
          </button>
        </div>
      </div>

      <!-- Demandes envoyées -->
      <div class="tab-content" *ngIf="activeTab === 'sent'">
        <div class="card" *ngIf="!isLoading && sentRequests.length > 0">
          <div class="card-header">
            <h3 class="card-title">Mes demandes d'accès ({{ sentRequests.length }})</h3>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="requests-table">
                <thead>
                  <tr>
                    <th>Code patient</th>
                    <th>Structure</th>
                    <th>Date de demande</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let request of sentRequests">
                    <td>
                      <div class="patient-code">{{ request.patient.codePatient }}</div>
                    </td>
                    <td>
                      <div class="structure-info">
                        <div class="structure-name">{{ request.patient.structure.nom }}</div>
                        <div class="structure-type">{{ request.patient.structure.type }}</div>
                      </div>
                    </td>
                    <td>{{ request.dateCreation | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(request.status)">
                        {{ getStatusLabel(request.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="actions-menu">
                        <button
                            *ngIf="request.status === 'APPROVED'"
                            class="btn btn-sm btn-secondary"
                            [routerLink]="['/mes-formulaires/patient', request.patient.id]"
                            type="button"
                            title="Voir les formulaires"
                        >
                          👁️ Voir les formulaires
                        </button>
                        <button
                            *ngIf="request.status === 'PENDING'"
                            class="btn btn-sm btn-danger"
                            (click)="cancelRequest(request.id)"
                            [disabled]="isCancelling"
                            type="button"
                            title="Annuler la demande"
                        >
                          ❌ Annuler
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="no-results card" *ngIf="!isLoading && sentRequests.length === 0">
          <div class="card-body text-center">
            <div class="no-results-icon">📭</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Aucune demande envoyée
            </h3>
            <p class="text-gray-600 mb-6">
              Vous n'avez pas encore envoyé de demande d'accès à des patients.
            </p>
            <button
                class="btn btn-primary"
                routerLink="/patient-access"
                type="button"
            >
              Rechercher des patients
            </button>
          </div>
        </div>
      </div>

      <!-- Demandes reçues -->
      <div class="tab-content" *ngIf="activeTab === 'received'">
        <div class="card" *ngIf="!isLoading && receivedRequests.length > 0">
          <div class="card-header">
            <h3 class="card-title">Demandes d'accès reçues ({{ receivedRequests.length }})</h3>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="requests-table">
                <thead>
                  <tr>
                    <th>Code patient</th>
                    <th>Demandeur</th>
                    <th>Structure</th>
                    <th>Date de demande</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let request of receivedRequests">
                    <td>
                      <div class="patient-code">{{ request.patient.codePatient }}</div>
                    </td>
                    <td>
                      <div class="user-info">
                        <div class="user-name">{{ request.requestor.prenom }} {{ request.requestor.nom }}</div>
                        <div class="user-email">{{ request.requestor.email }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="structure-info">
                        <div class="structure-name">{{ request.requestor.structure.nom }}</div>
                        <div class="structure-type">{{ request.requestor.structure.type }}</div>
                      </div>
                    </td>
                    <td>{{ request.dateCreation | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>
                      <span class="status-badge" [ngClass]="getStatusClass(request.status)">
                        {{ getStatusLabel(request.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="actions-menu" *ngIf="request.status === 'PENDING'">
                        <button
                            class="btn btn-sm btn-success"
                            (click)="approveRequest(request.id)"
                            [disabled]="isProcessing"
                            type="button"
                            title="Approuver"
                        >
                          ✅ Approuver
                        </button>
                        <button
                            class="btn btn-sm btn-danger"
                            (click)="rejectRequest(request.id)"
                            [disabled]="isProcessing"
                            type="button"
                            title="Rejeter"
                        >
                          ❌ Rejeter
                        </button>
                      </div>
                      <div *ngIf="request.status !== 'PENDING'">
                        -
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="no-results card" *ngIf="!isLoading && receivedRequests.length === 0">
          <div class="card-body text-center">
            <div class="no-results-icon">📭</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Aucune demande reçue
            </h3>
            <p class="text-gray-600 mb-6">
              Vous n'avez pas encore reçu de demande d'accès à vos patients.
            </p>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Chargement des demandes...</p>
      </div>
    </div>
  `,
  styles: [`
    .access-requests-container {
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

    .tabs-container {
      margin-bottom: var(--spacing-6);
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--gray-200);
    }

    .tab-button {
      padding: var(--spacing-3) var(--spacing-6);
      font-weight: 500;
      color: var(--gray-600);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .tab-button:hover {
      color: var(--primary-600);
    }

    .tab-button.active {
      color: var(--primary-600);
      border-bottom-color: var(--primary-600);
    }

    .tab-content {
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

    .requests-table {
      width: 100%;
      border-collapse: collapse;
    }

    .requests-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .requests-table td {
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

    .user-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .user-name {
      font-weight: 500;
      color: var(--gray-900);
    }

    .user-email {
      font-size: 12px;
      color: var(--gray-600);
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

    .status-badge.pending {
      background-color: var(--warning-100);
      color: var(--warning-700);
    }

    .status-badge.approved {
      background-color: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.rejected {
      background-color: var(--error-100);
      color: var(--error-700);
    }

    .status-badge.cancelled {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }

    .actions-menu {
      display: flex;
      gap: var(--spacing-2);
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

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--gray-200);
      border-top: 3px solid var(--primary-600);
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

      .tabs {
        flex-direction: column;
        border-bottom: none;
      }

      .tab-button {
        border: 1px solid var(--gray-200);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-2);
      }

      .tab-button.active {
        background-color: var(--primary-50);
        border-color: var(--primary-300);
      }

      .requests-table {
        font-size: 14px;
      }

      .requests-table th,
      .requests-table td {
        padding: var(--spacing-3);
      }

      .actions-menu {
        flex-direction: column;
      }
    }
  `]
})
export class AccessRequestsComponent implements OnInit {
  activeTab = 'sent';
  sentRequests: any[] = [];
  receivedRequests: any[] = [];
  isLoading = false;
  isProcessing = false;
  isCancelling = false;

  constructor(
    private patientAccessService: PatientAccessService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadRequests(): void {
    this.isLoading = true;

    // Load sent requests
    this.patientAccessService.getMyRequests().subscribe({
      next: (data) => {
        this.sentRequests = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes envoyées:', error);
        this.isLoading = false;
      }
    });

    // Load received requests
    this.patientAccessService.getReceivedRequests().subscribe({
      next: (data) => {
        this.receivedRequests = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes reçues:', error);
      }
    });
  }

  approveRequest(requestId: number): void {
    this.isProcessing = true;

    this.patientAccessService.approveRequest(requestId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.loadRequests();
      },
      error: (error) => {
        console.error('Erreur lors de l\'approbation de la demande:', error);
        this.isProcessing = false;
      }
    });
  }

  rejectRequest(requestId: number): void {
    this.isProcessing = true;

    this.patientAccessService.rejectRequest(requestId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.loadRequests();
      },
      error: (error) => {
        console.error('Erreur lors du rejet de la demande:', error);
        this.isProcessing = false;
      }
    });
  }

  cancelRequest(requestId: number): void {
    this.isCancelling = true;

    this.patientAccessService.cancelRequest(requestId).subscribe({
      next: () => {
        this.isCancelling = false;
        this.loadRequests();
      },
      error: (error) => {
        console.error('Erreur lors de l\'annulation de la demande:', error);
        this.isCancelling = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      case 'CANCELLED': return 'cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'APPROVED': return 'Approuvée';
      case 'REJECTED': return 'Rejetée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  }
}