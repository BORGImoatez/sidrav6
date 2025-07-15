import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User, UserRole, Structure, TypeStructure } from '../../../../models/user.model';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="utilisateurs-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Gestion des utilisateurs</h1>
          <p class="page-description">
            Créer et gérer les comptes utilisateurs {{ isSuperAdmin() ? 'de toutes les structures' : 'de votre structure' }}
          </p>
        </div>
        <button 
          class="btn btn-primary"
          (click)="openCreateModal()"
          type="button"
        >
          <span class="btn-icon">➕</span>
          Nouvel utilisateur
        </button>
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
            
            <div class="filter-group">
              <label class="form-label">Rôle</label>
              <select class="form-select" [(ngModel)]="selectedRole" (change)="filterUsers()">
                <option value="">Tous les rôles</option>
                <option value="SUPER_ADMIN" *ngIf="isSuperAdmin()">Super Administrateur</option>
                <option value="ADMIN_STRUCTURE">Administrateur Structure</option>
                <option value="UTILISATEUR">Utilisateur</option>
                <option value="PENDING">En attente d'activation</option>
              </select>
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

            <div class="filter-group">
              <label class="form-label">Statut</label>
              <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterUsers()">
                <option value="">Tous</option>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des utilisateurs -->
      <div class="users-table-container card">
        <div class="card-header">
          <h3 class="card-title">
            Utilisateurs ({{ filteredUsers.length }})
          </h3>
        </div>
        
        <div class="card-body p-0" *ngIf="!isLoading; else loadingTemplate">
          <div class="table-responsive">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Contact</th>
                  <th>Rôle</th>
                  <ng-container *ngIf="isSuperAdmin()">
                    <th>Structure</th>
                  </ng-container>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
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
                  <td>
                    <span class="role-badge" [class]="getRoleClass(user.role)">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <ng-container *ngIf="isSuperAdmin()">
                    <td>
                      <div class="structure-info" *ngIf="user.structure">
                        <div class="structure-name">{{ user.structure.nom }}</div>
                        <div class="structure-type">{{ getTypeLabel(user.structure.type) }}</div>
                      </div>
                      <span class="text-gray-500" *ngIf="!user.structure">-</span>
                    </td>
                  </ng-container>
                  <td>
                    <span class="status-badge" [class.active]="user.actif" [class.inactive]="!user.actif">
                      {{ user.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <div class="last-login" *ngIf="user.derniereConnexion">
                      {{ user.derniereConnexion | date:'dd/MM/yyyy HH:mm' }}
                    </div>
                    <span class="text-gray-500" *ngIf="!user.derniereConnexion">Jamais</span>
                  </td>
                  <td>
                    <div class="actions-menu">
                      <button 
                        class="btn btn-sm btn-secondary"
                        (click)="openEditModal(user)"
                        type="button"
                      >
                        ✏️
                      </button>
                      <button 
                        class="btn btn-sm"
                        [class.btn-danger]="user.actif"
                        [class.btn-secondary]="!user.actif"
                        (click)="toggleUserStatus(user)"
                        type="button"
                      >
                        {{ user.actif ? '🚫' : '✅' }}
                      </button>
                      <button 
                        class="btn btn-sm btn-danger"
                        (click)="confirmDelete(user)"
                        type="button"
                        *ngIf="canDeleteUser(user)"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de création/édition -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 *ngIf="isEditMode" class="modal-title">
              Modifier l'utilisateur       
            </h3>
            <h3 *ngIf="!isEditMode" class="modal-title">
              Nouvel utilisateur            </h3>
            
            <button class="modal-close" (click)="closeModal()" type="button">✕</button>
          </div>

          <form (ngSubmit)="saveUser()" #userForm="ngForm" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Prénom</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="currentUser.prenom"
                  name="prenom"
                  required
                  [disabled]="isSaving"
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Nom</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="currentUser.nom"
                  name="nom"
                  required
                  [disabled]="isSaving"
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Email</label>
                <input
                  type="email"
                  class="form-input"
                  [(ngModel)]="currentUser.email"
                  name="email"
                  placeholder="exemple@email.com"
                  required
                  [disabled]="isSaving"
                >
              </div>

              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input
                  type="tel"
                  class="form-input"
                  [(ngModel)]="currentUser.telephone"
                  name="telephone"
                  placeholder="21612345678"
                  [disabled]="isSaving"
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Rôle</label>
                <select
                  class="form-select"
                  [(ngModel)]="currentUser.role"
                  name="role"
                  required
                  [disabled]="isSaving"
                  (change)="onRoleChange()"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="SUPER_ADMIN" *ngIf="isSuperAdmin()">Super Administrateur</option>
                  <option value="ADMIN_STRUCTURE">Administrateur Structure</option>
                  <option value="UTILISATEUR">Utilisateur</option>
                  <option value="EXTERNE" *ngIf="isSuperAdmin()">Utilisateur Externe</option>
                </select>
              </div>

              <div class="form-group" *ngIf="currentUser.role && currentUser.role !== 'SUPER_ADMIN'">
                <label class="form-label required">Structure</label>
                <select
                  class="form-select"
                  [(ngModel)]="currentUser.structureId"
                  name="structureId"
                  required
                  [disabled]="isSaving || (!isSuperAdmin() && !isEditMode)"
                >
                  <option value="">Sélectionner une structure</option>
                  <option *ngFor="let structure of availableStructures" [value]="structure.id">
                    {{ structure.nom }} ({{ getTypeLabel(structure.type) }})
                  </option>
                </select>
              </div>
              
              <div class="form-group" *ngIf="!isEditMode">
                <label class="form-label required">Mot de passe</label>
                <input
                  type="password"
                  class="form-input"
                  [(ngModel)]="currentUser.motDePasse"
                  name="motDePasse"
                  required
                  [disabled]="isSaving"
                  placeholder="Mot de passe initial"
                >
              </div>
            </div>

            <div class="form-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="modal-actions">
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="closeModal()"
                [disabled]="isSaving"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!userForm.valid || isSaving"
              >
                <span *ngIf="!isSaving">{{ isEditMode ? 'Modifier' : 'Créer' }}</span>
                <span *ngIf="isSaving" class="flex items-center gap-2">
                  <div class="loading-spinner-sm"></div>
                  {{ isEditMode ? 'Modification...' : 'Création...' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Confirmer la suppression</h3>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir supprimer l'utilisateur 
              <strong>{{ userToDelete?.prenom }} {{ userToDelete?.nom }}</strong> ?
            </p>
            <p class="text-sm text-error">
              Cette action est irréversible.
            </p>
          </div>
          <div class="modal-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="closeDeleteModal()"
              [disabled]="isDeleting"
            >
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              (click)="deleteUser()"
              [disabled]="isDeleting"
            >
              <span *ngIf="!isDeleting">Supprimer</span>
              <span *ngIf="isDeleting" class="flex items-center gap-2">
                <div class="loading-spinner-sm"></div>
                Suppression...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .utilisateurs-container {
      max-width: 1400px;
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

    .btn-icon {
      font-size: 14px;
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

    .role-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-badge.super-admin {
      background-color: var(--error-100);
      color: var(--error-700);
    }

    .role-badge.admin-structure {
      background-color: var(--warning-100);
      color: var(--warning-700);
    }

    .role-badge.utilisateur {
      background-color: var(--success-100);
      color: var(--success-700);
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

    .status-badge.active {
      background-color: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.inactive {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }

    .last-login {
      font-size: 14px;
      color: var(--gray-900);
    }

    .actions-menu {
      display: flex;
      gap: var(--spacing-2);
    }

    .actions-menu .btn {
      padding: var(--spacing-2);
      min-width: 32px;
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
      max-width: 600px;
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

    .modal-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--gray-500);
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
    }

    .modal-close:hover {
      background-color: var(--gray-100);
      color: var(--gray-700);
    }

    .modal-body {
      padding: var(--spacing-6);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-6);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-3);
      padding-top: var(--spacing-4);
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
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filters-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
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
export class UtilisateursComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  structures: Structure[] = [];
  availableStructures: Structure[] = [];
  
  // Filtres
  searchTerm = '';
  selectedRole = '';
  selectedStructureId = '';
  selectedStatus = '';
  
  // Modal
  showModal = false;
  isEditMode = false;
  currentUser: Partial<User> = {};
  
  // États
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';
  
  // Suppression
  showDeleteModal = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStructures();
  }

  private loadUsers(): void {
    this.isLoading = true;
    
    const structureId = this.isSuperAdmin() ? undefined : this.getCurrentUserStructureId();
    
    this.userService.getUsers(structureId).subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.isLoading = false;
      }
    });
  }

  private loadStructures(): void {
    this.userService.getStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
        this.updateAvailableStructures();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des structures:', error);
      }
    });
  }

  private updateAvailableStructures(): void {
    if (this.isSuperAdmin()) {
      this.availableStructures = this.structures;
    } else {
      const currentUserStructureId = this.getCurrentUserStructureId();
      this.availableStructures = this.structures.filter(s => s.id === currentUserStructureId);
    }
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      const matchesStructure = !this.selectedStructureId || 
        user.structureId?.toString() === this.selectedStructureId;
      
      const matchesStatus = this.selectedStatus === '' || 
        user.actif.toString() === this.selectedStatus;
      
      return matchesSearch && matchesRole && matchesStructure && matchesStatus;
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentUser = {
      role: UserRole.UTILISATEUR,
      structureId: this.isSuperAdmin() ? undefined : this.getCurrentUserStructureId()
    };
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.currentUser = { ...user };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentUser = {};
    this.errorMessage = '';
  }

  onRoleChange(): void {
    if (this.currentUser.role === UserRole.SUPER_ADMIN) {
      this.currentUser.structureId = undefined;
    } else if (!this.isSuperAdmin() && !this.isEditMode && !this.currentUser.structureId) {
      this.currentUser.structureId = this.getCurrentUserStructureId();
    }
  }

  saveUser(): void {
    this.isSaving = true;
    this.errorMessage = '';

    // Validation côté client
    if (this.currentUser.role !== UserRole.SUPER_ADMIN && !this.currentUser.structureId) {
      this.errorMessage = 'Une structure est obligatoire pour ce rôle';
      this.isSaving = false;
      return;
    }

    if (!this.isEditMode && !this.currentUser.motDePasse) {
      this.errorMessage = 'Le mot de passe est obligatoire';
      this.isSaving = false;
      return;
    }
    const operation = this.isEditMode 
      ? this.userService.updateUser(this.currentUser.id!, this.currentUser)
      : this.userService.createUser(this.currentUser);

    operation.subscribe({
      next: (user) => {
        this.isSaving = false;
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Une erreur est survenue';
      }
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filterUsers();
        }
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut:', error);
      }
    });
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.isDeleting = true;
    
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

  canDeleteUser(user: User): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id !== user.id; // Ne peut pas se supprimer soi-même
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole(UserRole.SUPER_ADMIN);
  }

  private getCurrentUserStructureId(): number | undefined {
    return this.authService.getCurrentUser()?.structureId;
  }

  getUserInitials(user: User): string {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.ADMIN_STRUCTURE:
        return 'Admin Structure';
      case UserRole.UTILISATEUR:
        return 'Utilisateur';
      case UserRole.EXTERNE:
        return 'Externe';
      case 'PENDING':
        return 'En attente';
      default:
        return role;
    }
  }

  getRoleClass(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'super-admin';
      case UserRole.ADMIN_STRUCTURE:
        return 'admin-structure';
      case UserRole.UTILISATEUR:
        return 'utilisateur';
      case 'PENDING':
        return 'pending';
      case UserRole.EXTERNE:
        return 'externe';
      default:
        return '';
    }
  }

  getTypeLabel(type: TypeStructure): string {
    switch (type) {
      case TypeStructure.PUBLIQUE:
        return 'Publique';
      case TypeStructure.PRIVEE:
        return 'Privée';
      case TypeStructure.ONG:
        return 'ONG';
      default:
        return type;
    }
  }
}
