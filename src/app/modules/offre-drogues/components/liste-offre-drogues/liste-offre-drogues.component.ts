import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OffreDroguesService } from '../../../../services/offre-drogues.service';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../../../services/auth.service';
import { UserRole } from '../../../../models/user.model';
import {OffreDroguesListItem} from "../../../../models/offre-drogues.model";

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-liste-offre-drogues',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  template: `
    <div class="liste-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Indicateurs de l'offre de drogues</h1>
          <p *ngIf="isExterne()" class="page-description">
            Gérer vos saisies d'indicateurs


          </p>
          <p *ngIf="!isExterne()" class="page-description">
            Consulter les indicateurs saisis par les structures

          </p>
        </div>
        <button
            *ngIf="isExterne()"
            class="btn btn-primary"
            routerLink="/offre-drogues/nouveau"
            type="button"
        >
          <span class="btn-icon">➕</span>
          Nouvelle saisie
        </button>
      </div>

      <!-- Filtres -->
      <div class="filters-section card" *ngIf="!isExterne()">
        <div class="card-body">
          <div class="filters-grid mb-4">
            <div class="filter-group">
              <label class="form-label">Rechercher</label>
              <input
                  type="text"
                  class="form-input"
                  placeholder="Structure, utilisateur..."
                  [(ngModel)]="searchTerm"
                  (input)="filterData()"
              >
            </div>

            <div class="filter-group">
              <label class="form-label">Date de saisie de l'offre de drogue</label>
              <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="selectedDate"
                  (change)="filterData()"
              >
            </div>

            <div class="filter-group">
              <label class="form-label">Période</label>
              <select class="form-select" [(ngModel)]="selectedPeriod" (change)="filterData()">
                <option value="">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>

          <div class="filters-grid">
            <div class="filter-group">
              <label class="form-label">Période personnalisée</label>
              <div class="date-range-picker">
                <div class="date-input-group">
                  <label class="date-label">Du</label>
                  <input
                      type="date"
                      class="form-input"
                      [(ngModel)]="startDate"
                      (change)="filterByCustomPeriod()"
                  >
                </div>
                <div class="date-input-group">
                  <label class="date-label">Au</label>
                  <input
                      type="date"
                      class="form-input"
                      [(ngModel)]="endDate"
                      (change)="filterByCustomPeriod()"
                  >
                </div>
                <button
                    class="btn btn-sm btn-primary"
                    (click)="filterByCustomPeriod()"
                    type="button"
                >
                  Filtrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="charts-section">
        <div class="card mb-4">
          <div class="card-header">
            <h3 class="card-title">Évolution des saisies par mois de l'année {{ selectedYear }}</h3>
            <div class="filter-controls">
              <div class="year-filter">
                <label class="form-label">Année</label>
                <select class="form-select" [(ngModel)]="selectedYear" (change)="filterChartByYear()">
                  <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="monthlyChart"></canvas>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quantités saisies par substance pour l'année {{ selectedYear }}</h3>
            <div class="filter-controls">
              <div class="year-filter">
                <label class="form-label">Année</label>
                <select class="form-select" [(ngModel)]="selectedYear" (change)="filterChartByYear()">
                  <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="substancesChart"></canvas>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Évolution mensuelle des substances pour {{ availableMonths[selectedMonth].label }} {{ selectedYear }}</h3>
            <div class="filter-controls">
              <div class="year-filter">
                <label class="form-label">Année</label>
                <select class="form-select" [(ngModel)]="selectedYear" (change)="filterMonthlySubstancesChart()">
                  <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
                </select>
              </div>
              <div class="month-filter">
                <label class="form-label">Mois</label>
                <select class="form-select" [(ngModel)]="selectedMonth" (change)="filterMonthlySubstancesChart()">
                  <option *ngFor="let month of availableMonths" [value]="month.value">{{ month.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="monthlySubstancesChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau des données -->
      <div class="data-table-container card">
        <div class="card-header">
          <h3 class="card-title">
            {{ isExterne() ? 'Mes saisies' : 'Toutes les saisies' }} ({{ filteredData.length }})
          </h3>
        </div>

        <div class="card-body p-0" *ngIf="!isLoading; else loadingTemplate">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
              <tr>
                <th>Date de saisie de l'offre de drogues</th>
                <th *ngIf="!isExterne()">Structure</th>
                <th *ngIf="!isExterne()">Utilisateur</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let item of filteredData" class="data-row">
                <td>
                  <div class="date-info">
                    <div class="date-value">{{ item.dateSaisie | date:'dd/MM/yyyy' }}</div>
                    <div class="date-day">{{ item.dateSaisie | date:'EEEE' }}</div>
                  </div>
                </td>
                <td *ngIf="!isExterne()">
                  <div class="structure-info">
                    <div class="structure-name">{{ item.structure.nom }}</div>
                    <div class="structure-type">{{ item.structure.type }}</div>
                  </div>
                </td>
                <td *ngIf="!isExterne()">
                  <div class="user-info">
                    <div class="user-name">{{ item.utilisateur.prenom }} {{ item.utilisateur.nom }}</div>
                  </div>
                </td>
                <td>
                  <div class="creation-date">
                    {{ item.dateCreation | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                </td>
                <td>
                  <div class="actions-menu">
                    <button
                        class="btn btn-sm btn-secondary"
                        [routerLink]="['/offre-drogues/detail', item.id]"
                        type="button"
                        title="Voir les détails"
                    >
                      👁️
                    </button>
                    <button
                        *ngIf="isExterne()"
                        class="btn btn-sm btn-secondary"
                        [routerLink]="['/offre-drogues/modifier', item.id]"
                        type="button"
                        title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                        *ngIf="isExterne()"
                        class="btn btn-sm btn-danger"
                        (click)="confirmDelete(item)"
                        type="button"
                        title="Supprimer"
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

      <!-- Modal de confirmation de suppression -->
      <div class="modal-overlay" *ngIf="showDeleteModal" (click)="closeDeleteModal()">
        <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Confirmer la suppression</h3>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir supprimer la saisie du
              <strong>{{ itemToDelete?.dateSaisie | date:'dd/MM/yyyy' }}</strong> ?
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
                (click)="deleteItem()"
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
        <p>Chargement des données...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .liste-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .charts-section {
      margin-bottom: var(--spacing-6);
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-6);
    }

    .chart-container {
      height: 400px;
      position: relative;
    }

    .filter-controls {
      display: flex;
      gap: var(--spacing-4);
      align-items: flex-end;
      margin-top: var(--spacing-2);
    }

    .year-filter {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .month-filter {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .year-filter .form-select {
      width: 120px;
    }

    .month-filter .form-select {
      width: 120px;
    }

    .mb-4 {
      margin-bottom: var(--spacing-4);
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

    .date-range-picker {
      display: flex;
      gap: var(--spacing-3);
      align-items: flex-end;
    }

    .date-label {
      font-size: 12px;
      color: var(--gray-600);
      margin-bottom: var(--spacing-1);
      display: block;
    }

    .mb-4 {
      margin-bottom: var(--spacing-4);
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

    .data-table-container {
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

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border-bottom: 1px solid var(--gray-200);
    }

    .data-table td {
      padding: var(--spacing-4);
      border-bottom: 1px solid var(--gray-100);
      vertical-align: middle;
    }

    .data-row:hover {
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

    .user-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .user-name {
      font-weight: 500;
      color: var(--gray-900);
    }

    .creation-date {
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
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .data-table {
        font-size: 14px;
      }

      .data-table th,
      .data-table td {
        padding: var(--spacing-3);
      }

      .modal-content {
        margin: var(--spacing-2);
        max-width: none;
      }

      .date-range-picker {
        flex-direction: column;
        gap: var(--spacing-2);
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .chart-container {
        height: 300px;
      }
    }
  `]
})
export class ListeOffreDroguesComponent implements OnInit {
  data: any[] = [];
  filteredData: OffreDroguesListItem[] = [];

  // Filtres
  searchTerm = '';
  selectedDate = '';
  startDate = '';
  endDate = '';
  selectedPeriod = '';
  selectedMonth = new Date().getMonth();
  
  // Propriétés pour les graphiques
  monthlyChart: Chart | null = null;
  substancesChart: Chart | null = null;
  monthlySubstancesChart: Chart | null = null;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  availableMonths: { value: number, label: string }[] = [
    { value: 0, label: 'Janvier' },
    { value: 1, label: 'Février' },
    { value: 2, label: 'Mars' },
    { value: 3, label: 'Avril' },
    { value: 4, label: 'Mai' },
    { value: 5, label: 'Juin' },
    { value: 6, label: 'Juillet' },
    { value: 7, label: 'Août' },
    { value: 8, label: 'Septembre' },
    { value: 9, label: 'Octobre' },
    { value: 10, label: 'Novembre' },
    { value: 11, label: 'Décembre' }
  ];
  chartData: any[] = [];

  // États
  isLoading = false;
  isDeleting = false;

  // Suppression
  showDeleteModal = false;
  itemToDelete: OffreDroguesListItem | null = null;

  constructor(
      private offreDroguesService: OffreDroguesService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initializeYears();
  }

  private loadData(): void {
    this.isLoading = true;

    this.offreDroguesService.getAll().subscribe({
      next: (data) => {
        this.data = data;
        this.filterData();
        this.chartData = data;
        this.isLoading = false;
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      }
    });
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.availableYears.push(year);
    }
  }

  private initializeCharts(): void {
    this.createMonthlyChart();
    this.createSubstancesChart();
    this.createMonthlySubstancesChart();
  }

  private createMonthlyChart(): void {
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Préparer les données par mois pour l'année sélectionnée
    const monthlyData = this.prepareMonthlyData(this.selectedYear);

    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Nombre de saisies',
          data: monthlyData.data,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  private createMonthlySubstancesChart(): void {
    if (this.monthlySubstancesChart) {
      this.monthlySubstancesChart.destroy();
    }

    const ctx = document.getElementById('monthlySubstancesChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Récupérer les données mensuelles des substances
    this.offreDroguesService.getMonthlySubstancesData(this.selectedYear, this.selectedMonth).subscribe(data => {
      const labels = data.map(item => item.day);
      
      // Créer un dataset pour chaque substance
      const datasets = [
        {
          label: 'Cannabis (kg)',
          data: data.map(item => item.cannabis || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Comprimés Tableau A',
          data: data.map(item => item.comprimesTableauA || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Ecstasy (comprimé)',
          data: data.map(item => item.ecstasyComprime || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Cocaïne (g)',
          data: data.map(item => item.cocaine || 0),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: 'Héroïne (g)',
          data: data.map(item => item.heroine || 0),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          tension: 0.3
        }
      ];

      this.monthlySubstancesChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            },
            legend: {
              position: 'top',
            }
          }
        }
      });
    });
  }

  private createSubstancesChart(): void {
    if (this.substancesChart) {
      this.substancesChart.destroy();
    }

    const ctx = document.getElementById('substancesChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Préparer les données par substance
    const substancesData = this.prepareSubstancesData(this.selectedYear);

    this.substancesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: substancesData.labels,
        datasets: [{
          label: 'Quantités saisies',
          data: substancesData.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  private prepareMonthlyData(year: number): { labels: string[], data: number[] } {
    // Créer un tableau pour chaque mois de l'année en cours
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthlyCounts = new Array(12).fill(0);

    // Compter les saisies par mois pour l'année sélectionnée
    this.data.forEach(item => {
      const date = new Date(item.dateSaisie);
      if (date.getFullYear() === year) {
        monthlyCounts[date.getMonth()]++;
      }
    });

    return {
      labels: months,
      data: monthlyCounts
    };
  }

  private prepareSubstancesData(year: number): { labels: string[], data: number[] } {
    // Définir les substances à afficher
    const substances = [
      { name: 'Cannabis (kg)', key: 'cannabis' },
      { name: 'Comprimés Tableau A', key: 'comprimesTableauA' },
      { name: 'Ecstasy (comprimé)', key: 'ecstasyComprime' },
      { name: 'Ecstasy (poudre)', key: 'ecstasyPoudre' },
      { name: 'Subutex', key: 'subutex' },
      { name: 'Cocaïne (g)', key: 'cocaine' },
      { name: 'Héroïne (g)', key: 'heroine' }
    ];

    // Filtrer les données par année
    const filteredData = this.offreDroguesService.getDetailedDataForYear(year);

    // Initialiser les totaux à zéro
    const totals = substances.map(() => 0);

    // Calculer les totaux pour chaque substance
    filteredData.subscribe(data => {
      data.forEach(item => {
        substances.forEach((substance, index) => {
          if (item.quantitesDrogues && item.quantitesDrogues[substance.key] !== null) {
            totals[index] += item.quantitesDrogues[substance.key] || 0;
          }
        });
      });

      // Mettre à jour le graphique avec les nouvelles données
      if (this.substancesChart) {
        this.substancesChart.data.datasets[0].data = totals;
        this.substancesChart.update();
      }
    });

    return {
      labels: substances.map(s => s.name),
      data: totals
    };
  }

  filterChartByYear(): void {
    this.createSubstancesChart();
    this.createMonthlyChart();
    this.filterMonthlySubstancesChart();
  }

  filterMonthlySubstancesChart(): void {
    this.createMonthlySubstancesChart();
  }

  filterByCustomPeriod(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }

    this.isLoading = true;

    this.offreDroguesService.getByPeriod(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.data = data;
        this.filterData();
        this.chartData = data;
        this.isLoading = false;
        this.initializeCharts();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données par période:', error);
        this.isLoading = false;
      }
    });
  }

  filterData(): void {
    this.filteredData = this.data.filter(item => {
      const matchesSearch = !this.searchTerm ||
          item.structure.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          `${item.utilisateur.prenom} ${item.utilisateur.nom}`.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesDate = !this.selectedDate ||
          item.dateSaisie.toISOString().split('T')[0] === this.selectedDate;

      const matchesPeriod = this.matchesPeriod(item.dateSaisie);

      return matchesSearch && matchesDate && matchesPeriod;
    });
  }

  private matchesPeriod(date: Date): boolean {
    if (!this.selectedPeriod) return true;

    const now = new Date();
    const itemDate = new Date(date);

    switch (this.selectedPeriod) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      case 'month':
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        const itemQuarter = Math.floor(itemDate.getMonth() / 3);
        return itemQuarter === quarter && itemDate.getFullYear() === now.getFullYear();
      case 'year':
        return itemDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  }

  isExterne(): boolean {
    return this.authService.hasRole(UserRole.EXTERNE);
  }

  confirmDelete(item: OffreDroguesListItem): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  deleteItem(): void {
    if (!this.itemToDelete) return;

    this.isDeleting = true;

    this.offreDroguesService.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDeleteModal();
        this.loadData();
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }
}
