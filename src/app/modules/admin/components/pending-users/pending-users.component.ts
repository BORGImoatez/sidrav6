import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { UserRole } from '../../../../models/user.model';
import { WebSocketService } from '../../../../services/websocket.service';

@Component({
  selector: 'app-pending-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pending-users-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Demandes d'inscription</h1>
          <p class="page-description">
            Gérer les demandes d'inscription des nouveaux utilisateurs
          </p>
        </div>
      </div>

      <!-- Filtres -->
      <div class="filters-section card">
        <div class="card-body">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="form-label">Rechercher</label>
              <input
                  type="text"
                  class="form-input"
                  placeholder="Nom, prénom ou email..."
                  [(ngModel)]="searchTerm"
                  (input)="filterUsers()"
              >
            </div>

            <div class="filter-group" *ngIf="isSuperAdmin()">
              <label class="form-label">Structure</label>
              <select class="form-select" [(ngModel)]="selectedStructureId" (change)="filterUsers()">
                <option value="">Toutes les structures</option>
                <option *ngFor="let structure of structures" [value]="structure.id">
                  {{ structure.nom }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des utilisateurs en attente -->
      <div class="users-table-container card">
        <div class="card-header">
          <h3 class="card-title">
            Utilisateurs en attente d'activation ({{ filteredUsers.length }})
          </h3>
        </div>

        <div class="card-body p-0" *ngIf="!isLoading; else loadingTemplate">
          <div class="table-responsive">
            <table class="users-table">
              <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <ng-container *ngIf="isSuperAdmin()">
                  <th>Structure</th>
                </ng-container>
                <th>Date de demande</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let user of filteredUsers" class="user-row">
                <td>
                  <div class="user-info">
                    <div class="user-avatar">
                      {{ getUserInitials(user) }}
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ user.prenom }} {{ user.nom }}</div>
                      <div class="user-id">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <div class="email">{{ user.email }}</div>
                    <div class="phone" *ngIf="user.telephone">{{ user.telephone }}</div>
                  </div>
                </td>
                <ng-container *ngIf="isSuperAdmin()">
                  <td>
                    <div class="structure-info" *ngIf="user.structure">
                      <div class="structure-name">{{ user.structure.nom }}</div>
                      <div class="structure-type">{{ user.structure.type }}</div>
                    </div>
                    <span class="text-gray-500" *ngIf="!user.structure">-</span>
                  </td>
                </ng-container>
                <td>
                  <div class="date-info">
                    {{ user.dateCreation | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                </td>
                <td>
                  <div class="actions-menu">
                    <button
                        class="btn btn-sm btn-success"
                        (click)="confirmApprove(user)"
                        type="button"
                        title="Approuver"
                    >
                      ✅
                    </button>
                    <button
                        class="btn btn-sm btn-danger"
                        (click)="confirmReject(user)"
                        type="button"
                        title="Rejeter"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Message si aucun utilisateur en attente -->
      <div class="no-results card" *ngIf="!isLoading && filteredUsers.length === 0">
        <div class="card-body text-center">
          <div class="no-results-icon">🔍</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Aucune demande d'inscription en attente
          </h3>
          <p class="text-gray-600 mb-6">
            Il n'y a actuellement aucune demande d'inscription à traiter.
          </p>
        </div>
      </div>

      <!-- Modal de confirmation d'approbation -->
      <div class="modal-overlay" *ngIf="showApproveModal" (click)="closeApproveModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Confirmer l'approbation</h3>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir approuver la demande d'inscription de
              <strong>{{ userToApprove?.prenom }} {{ userToApprove?.nom }}</strong> ?
            </p>
            <p class="text-sm text-success">
              Le compte sera activé et l'utilisateur pourra se connecter.
            </p>
          </div>
          <div class="modal-actions">
            <button
                type="button"
                class="btn btn-secondary"
                (click)="closeApproveModal()"
                [disabled]="isProcessing"
            >
              Annuler
            </button>
            <button
                type="button"
                class="btn btn-success"
                (click)="approveUser()"
                [disabled]="isProcessing"
            >
              <span *ngIf="!isProcessing">Approuver</span>
              <span *ngIf="isProcessing" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Approbation...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation de rejet -->
      <div class="modal-overlay" *ngIf="showRejectModal" (click)="closeRejectModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Confirmer le rejet</h3>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir rejeter la demande d'inscription de
              <strong>{{ userToReject?.prenom }} {{ userToReject?.nom }}</strong> ?
            </p>
            <p class="text-sm text-error">
              Cette action est irréversible. Le compte sera supprimé.
            </p>
          </div>
          <div class="modal-actions">
            <button
                type="button"
                class="btn btn-secondary"
                (click)="closeRejectModal()"
                [disabled]="isProcessing"
            >
              Annuler
            </button>
            <button
                type="button"
                class="btn btn-danger"
                (click)="rejectUser()"
                [disabled]="isProcessing"
            >
              <span *ngIf="!isProcessing">Rejeter</span>
              <span *ngIf="isProcessing" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Rejet...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Chargement des demandes d'inscription...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .pending-users-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-6);
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

    .filters-section {
      margin-bottom: var(--spacing-6);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-4);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .users-table-container {
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

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .users-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .user-row:hover {
      background-color: var(--gray-50);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background-color: var(--primary-500);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .user-name {
      font-weight: 600;
      color: var(--gray-900);
    }

    .user-id {
      font-size: 12px;
      color: var(--gray-500);
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .email {
      font-weight: 500;
      color: var(--gray-900);
    }

    .phone {
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

    .date-info {
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

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
    }

    .no-results {
      max-width: 600px;
      margin: 0 auto;
    }

    .no-results-icon {
      font-size: 64px;
      margin-bottom: var(--spacing-6);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-6);
      border-bottom: 1px solid var(--gray-200);
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .modal-body {
      padding: var(--spacing-6);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      border-top: 1px solid var(--gray-200);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-12);
      gap: var(--spacing-4);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .filters-grid {
        grid-template-columns: 1fr;
      }

      .users-table {
        font-size: 14px;
      }

      .users-table th,
      .users-table td {
        padding: var(--spacing-3);
      }

      .modal-content {
        margin: var(--spacing-2);
        max-width: none;
      }
    }
  `]
})
export class PendingUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  structures: any[] = [];

  // Filtres
  searchTerm = '';
  selectedStructureId = '';

  // États
  isLoading = false;
  isProcessing = false;

  // Modals
  showApproveModal = false;
  showRejectModal = false;
  userToApprove: any = null;
  userToReject: any = null;

  constructor(
      private userService: UserService,
      private authService: AuthService,
      private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.loadPendingUsers();
    this.loadStructures();
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    this.webSocketService.connect().subscribe(connected => {
      if (connected) {
        this.webSocketService.subscribe('/topic/admin/notifications', (message) => {
          if (message && message.type === 'NEW_USER_SIGNUP') {
            // Recharger la liste des utilisateurs en attente
            this.loadPendingUsers();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Se désabonner des WebSockets lors de la destruction du composant
    this.webSocketService.unsubscribe('/topic/admin/notifications');
  }

  private loadPendingUsers(): void {
    this.isLoading = true;

    this.userService.getPendingUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs en attente:', error);
        this.isLoading = false;
      }
    });
  }

  private loadStructures(): void {
    this.userService.getStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des structures:', error);
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
          user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStructure = !this.selectedStructureId ||
          user.structureId?.toString() === this.selectedStructureId;

      return matchesSearch && matchesStructure;
    });
  }

  confirmApprove(user: any): void {
    this.userToApprove = user;
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.userToApprove = null;
  }

  approveUser(): void {
    if (!this.userToApprove) return;

    this.isProcessing = true;

    this.userService.approveUser(this.userToApprove.id).subscribe({
      next: () => {
        this.isProcessing = false;
        this.closeApproveModal();
        this.loadPendingUsers();
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Erreur lors de l\'approbation:', error);
      }
    });
  }

  confirmReject(user: any): void {
    this.userToReject = user;
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.userToReject = null;
  }

  rejectUser(): void {
    if (!this.userToReject) return;

    this.isProcessing = true;

    this.userService.rejectUser(this.userToReject.id).subscribe({
      next: () => {
        this.isProcessing = false;
        this.closeRejectModal();
        this.loadPendingUsers();
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Erreur lors du rejet:', error);
      }
    });
  }

  getUserInitials(user: any): string {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole(UserRole.SUPER_ADMIN);
  }
}
