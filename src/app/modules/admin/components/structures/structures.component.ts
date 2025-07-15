import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { Structure, TypeStructure, Gouvernorat, Ministere } from '../../../../models/user.model';

@Component({
  selector: 'app-structures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="structures-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Gestion des structures</h1>
          <p class="page-description">
            Créer et gérer les structures du système SIDRA
          </p>
        </div>
        <button
            class="btn btn-primary"
            (click)="openCreateModal()"
            type="button"
        >
          <span class="btn-icon">➕</span>
          Nouvelle structure
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
                  placeholder="Nom de la structure..."
                  [(ngModel)]="searchTerm"
                  (input)="filterStructures()"
              >
            </div>

            <div class="filter-group">
              <label class="form-label">Type</label>
              <select class="form-select" [(ngModel)]="selectedType" (change)="filterStructures()">
                <option value="">Tous les types</option>
                <option value="PUBLIQUE">Publique</option>
                <option value="PRIVEE">Privée</option>
                <option value="ONG">ONG</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="form-label">Gouvernorat</label>
              <select class="form-select" [(ngModel)]="selectedGouvernoratId" (change)="filterStructures()">
                <option value="">Tous les gouvernorats</option>
                <option *ngFor="let gouvernorat of gouvernorats" [value]="gouvernorat.id">
                  {{ gouvernorat.nom }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="form-label">Statut</label>
              <select class="form-select" [(ngModel)]="selectedStatus" (change)="filterStructures()">
                <option value="">Tous</option>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des structures -->
      <div class="structures-table-container card">
        <div class="card-header">
          <h3 class="card-title">
            Structures ({{ filteredStructures.length }})
          </h3>
        </div>

        <div class="card-body p-0" *ngIf="!isLoading; else loadingTemplate">
          <div class="table-responsive">
            <table class="structures-table">
              <thead>
              <tr>
                <th>Structure</th>
                <th>Type</th>
                <th>Gouvernorat</th>
                <th>Secteur</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let structure of filteredStructures" class="structure-row">
                <td>
                  <div class="structure-info">
                    <div class="structure-name">{{ structure.nom }}</div>
                    <div class="structure-contact" *ngIf="structure.telephone">
                      📞 {{ structure.telephone }}
                    </div>
                    <div class="structure-address" *ngIf="structure.adresse">
                      📍 {{ structure.adresse }}
                    </div>
                  </div>
                </td>
                <td>
                    <span class="type-badge" [class]="getTypeClass(structure.type)">
                      {{ getTypeLabel(structure.type) }}
                    </span>
                </td>
                <td>
                  <div class="gouvernorat-info">
                    {{ structure.gouvernorat?.nom }}
                  </div>
                </td>
                <td>
                  <div class="secteur-info">
                    {{ structure.secteur }}
                  </div>
                </td>
                <td>
                    <span class="status-badge" [class.active]="structure.actif" [class.inactive]="!structure.actif">
                      {{ structure.actif ? 'Actif' : 'Inactif' }}
                    </span>
                </td>
                <td>
                  <div class="actions-menu">
                    <button
                        class="btn btn-sm btn-secondary"
                        (click)="openEditModal(structure)"
                        type="button"
                        title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                        class="btn btn-sm"
                        [class.btn-danger]="structure.actif"
                        [class.btn-secondary]="!structure.actif"
                        (click)="toggleStructureStatus(structure)"
                        type="button"
                        [title]="structure.actif ? 'Désactiver' : 'Activer'"
                    >
                      {{ structure.actif ? '🚫' : '✅' }}
                    </button>
                    <button
                        class="btn btn-sm btn-danger"
                        (click)="confirmDelete(structure)"
                        type="button"
                        title="Supprimer"
                        *ngIf="structure.actif"
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
            <h3 class="modal-title">
              {{ isEditMode ? 'Modifier la structure' : 'Nouvelle structure' }}
            </h3>
            <button class="modal-close" (click)="closeModal()" type="button">✕</button>
          </div>

          <form (ngSubmit)="saveStructure()" #structureForm="ngForm" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Nom de la structure</label>
                <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="currentStructure.nom"
                    name="nom"
                    required
                    [disabled]="isSaving"
                    placeholder="Ex: Hôpital Charles Nicolle"
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Type</label>
                <select
                    class="form-select"
                    [(ngModel)]="currentStructure.type"
                    name="type"
                    required
                    [disabled]="isSaving"
                    (change)="onTypeChange()"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="PUBLIQUE">Publique</option>
                  <option value="PRIVEE">Privée</option>
                  <option value="ONG">ONG</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Gouvernorat</label>
                <select
                    class="form-select"
                    [(ngModel)]="currentStructure.gouvernoratId"
                    name="gouvernoratId"
                    required
                    [disabled]="isSaving"
                >
                  <option value="">Sélectionner un gouvernorat</option>
                  <option *ngFor="let gouvernorat of gouvernorats" [value]="gouvernorat.id">
                    {{ gouvernorat.nom }}
                  </option>
                </select>
              </div>

              <div class="form-group" *ngIf="currentStructure.type === 'PUBLIQUE'">
                <label class="form-label required">Ministère</label>
                <select
                    class="form-select"
                    [(ngModel)]="currentStructure.ministereId"
                    name="ministereId"
                    required
                    [disabled]="isSaving"
                >
                  <option value="">Sélectionner un ministère</option>
                  <option *ngFor="let ministere of ministeres" [value]="ministere.id">
                    {{ ministere.nom }}
                  </option>
                </select>
                <div *ngIf="showValidationErrors && currentStructure.type === 'PUBLIQUE' && !currentStructure.ministereId" class="form-error">
                  Le ministère est obligatoire pour les structures publiques
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input
                    type="tel"
                    class="form-input"
                    [(ngModel)]="currentStructure.telephone"
                    name="telephone"
                    [disabled]="isSaving"
                    placeholder="Ex: 71663000"
                >
              </div>

              <div class="form-group full-width">
                <label class="form-label">Adresse</label>
                <textarea
                    class="form-input"
                    [(ngModel)]="currentStructure.adresse"
                    name="adresse"
                    [disabled]="isSaving"
                    rows="3"
                    placeholder="Adresse complète de la structure"
                ></textarea>
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
                  [disabled]="!structureForm.valid || isSaving"
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
              Êtes-vous sûr de vouloir supprimer la structure
              <strong>{{ structureToDelete?.nom }}</strong> ?
            </p>
            <p class="text-sm text-error">
              Cette action désactivera la structure et elle ne sera plus accessible.
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
                (click)="deleteStructure()"
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
        <p>Chargement des structures...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .structures-container {
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

    .structures-table-container {
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

    .structures-table {
      width: 100%;
      border-collapse: collapse;
    }

    .structures-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .structures-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .structure-row:hover {
      background-color: var(--gray-50);
    }

    .structure-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .structure-name {
      font-weight: 600;
      color: var(--gray-900);
    }

    .structure-contact,
    .structure-address {
      font-size: 12px;
      color: var(--gray-600);
    }

    .type-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-badge.publique {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }

    .type-badge.privee {
      background-color: var(--error-700);
      color: var(--error-600);
    }

    .type-badge.ong {
      background-color: var(--success-500);
      color: var(--success-600);
    }

    .gouvernorat-info,
    .secteur-info {
      font-size: 14px;
      color: var(--gray-900);
    }

    .status-badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: var(--success-600);
      color: var(--success-500);
    }

    .status-badge.inactive {
      background-color: var(--gray-100);
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
      max-width: 700px;
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

    .form-group.full-width {
      grid-column: 1 / -1;
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

      .structures-table {
        font-size: 14px;
      }

      .structures-table th,
      .structures-table td {
        padding: var(--spacing-3);
      }

      .modal-content {
        margin: var(--spacing-2);
        max-width: none;
      }
    }
  `]
})
export class StructuresComponent implements OnInit {
  structures: Structure[] = [];
  filteredStructures: Structure[] = [];
  gouvernorats: Gouvernorat[] = [];
  ministeres: Ministere[] = [];

  // Filtres
  searchTerm = '';
  selectedType = '';
  selectedGouvernoratId = '';
  selectedStatus = '';

  // Modal
  showModal = false;
  isEditMode = false;
  currentStructure: Partial<Structure> = {};
  showValidationErrors = false;

  // États
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  errorMessage = '';

  // Suppression
  showDeleteModal = false;
  structureToDelete: Structure | null = null;

  constructor(
      private userService: UserService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStructures();
    this.loadGouvernorats();
    this.loadMinisteres();
  }

  private loadStructures(): void {
    this.isLoading = true;

    this.userService.getStructures().subscribe({
      next: (structures) => {
        this.structures = structures;
        this.filterStructures();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des structures:', error);
        this.isLoading = false;
      }
    });
  }

  private loadGouvernorats(): void {
    this.userService.getGouvernorats().subscribe({
      next: (gouvernorats) => {
        this.gouvernorats = gouvernorats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des gouvernorats:', error);
      }
    });
  }

  private loadMinisteres(): void {
    this.userService.getMinisteres().subscribe({
      next: (ministeres) => {
        this.ministeres = ministeres;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ministères:', error);
      }
    });
  }

  filterStructures(): void {
    this.filteredStructures = this.structures.filter(structure => {
      const matchesSearch = !this.searchTerm ||
          structure.nom.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || structure.type === this.selectedType;

      const matchesGouvernorat = !this.selectedGouvernoratId ||
          structure.gouvernorat?.id?.toString() === this.selectedGouvernoratId;

      const matchesStatus = this.selectedStatus === '' ||
          structure.actif?.toString() === this.selectedStatus;

      return matchesSearch && matchesType && matchesGouvernorat && matchesStatus;
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentStructure = {};
    this.showValidationErrors = false;
    this.errorMessage = '';
    this.showModal = true;
  }

  openEditModal(structure: Structure): void {
    this.isEditMode = true;
    this.currentStructure = { ...structure };
    this.showValidationErrors = false;
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentStructure = {};
    this.errorMessage = '';
  }

  saveStructure(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.showValidationErrors = true;

    // Validation côté client
    if (this.currentStructure.type === 'PUBLIQUE' && !this.currentStructure.ministereId) {
      this.errorMessage = 'Un ministère est obligatoire pour les structures publiques';
      this.isSaving = false;
      return;
    }

    const operation = this.isEditMode
        ? this.userService.updateStructure(this.currentStructure.id!, this.currentStructure)
        : this.userService.createStructure(this.currentStructure);

    operation.subscribe({
      next: (structure) => {
        this.isSaving = false;
        this.closeModal();
        this.loadStructures();
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue';
      }
    });
  }

  toggleStructureStatus(structure: Structure): void {
    this.userService.toggleStructureStatus(structure.id).subscribe({
      next: (updatedStructure) => {
        const index = this.structures.findIndex(s => s.id === structure.id);
        if (index !== -1) {
          this.structures[index] = updatedStructure;
          this.filterStructures();
        }
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut:', error);
      }
    });
  }

  confirmDelete(structure: Structure): void {
    this.structureToDelete = structure;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.structureToDelete = null;
  }

  deleteStructure(): void {
    if (!this.structureToDelete) return;

    this.isDeleting = true;

    this.userService.deleteStructure(this.structureToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadStructures();
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Erreur lors de la suppression:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
      }
    });
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

  getTypeClass(type: TypeStructure): string {
    switch (type) {
      case TypeStructure.PUBLIQUE:
        return 'publique';
      case TypeStructure.PRIVEE:
        return 'privee';
      case TypeStructure.ONG:
        return 'ong';
      default:
        return '';
    }
  }

  onTypeChange(): void {
    // Réinitialiser le ministère si le type n'est pas PUBLIQUE
    if (this.currentStructure.type !== 'PUBLIQUE') {
      this.currentStructure.ministereId = undefined;
      // Définir automatiquement le secteur en fonction du type
      if (this.currentStructure.type === 'PRIVEE') {
        this.currentStructure.secteur = 'Secteur Privé';
      } else if (this.currentStructure.type === 'ONG') {
        this.currentStructure.secteur = 'ONG';
      }
    } else {
      // Pour les structures publiques, définir le secteur par défaut
      this.currentStructure.secteur = 'Secteur Public';
    }
  }
}
