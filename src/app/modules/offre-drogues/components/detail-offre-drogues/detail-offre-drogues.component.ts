import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { OffreDroguesService } from '../../../../services/offre-drogues.service';
import { AuthService } from '../../../../services/auth.service';
import { OffreDrogues } from '../../../../models/offre-drogues.model';
import { UserRole } from '../../../../models/user.model';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-detail-offre-drogues',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="detail-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Détail des indicateurs - Offre de drogues</h1>
          <p class="page-description" *ngIf="data">
            Saisie du {{ data.dateSaisie | date:'dd/MM/yyyy' }}
            <span *ngIf="data.structure"> - {{ data.structure.nom }}</span>
          </p>
        </div>
        <div class="header-actions">
          <button
              *ngIf="isExterne() && canEdit()"
              class="btn btn-secondary"
              [routerLink]="['/offre-drogues/modifier', data?.id]"
              type="button"
          >
            ✏️ Modifier
          </button>
          <button
              class="btn btn-secondary"
              (click)="goBack()"
              type="button"
          >
            ← Retour
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>

      <div *ngIf="!isLoading && data" class="detail-content">
        <!-- Informations générales -->
        <div class="info-section card">
          <div class="card-header">
            <h3 class="section-title">Informations générales</h3>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Date de saisie de l'offre du drogues</span>
                <span class="info-value">{{ data.dateSaisie | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="info-item" *ngIf="data.structure">
                <span class="info-label">Structure</span>
                <span class="info-value">{{ data.structure.nom }}</span>
              </div>
              <div class="info-item" *ngIf="data.structure">
                <span class="info-label">Type de structure</span>
                <span class="info-value">{{ data.structure.type }}</span>
              </div>
              <div class="info-item" *ngIf="data.utilisateur">
                <span class="info-label">Saisi par</span>
                <span class="info-value">{{ data.utilisateur.prenom }} {{ data.utilisateur.nom }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date de création</span>
                <span class="info-value">{{ data.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="info-item" *ngIf="data.dateModification && data.dateModification !== data.dateCreation">
                <span class="info-label">Dernière modification</span>
                <span class="info-value">{{ data.dateModification | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphique comparatif -->
        <div class="data-section card" *ngIf="lastEntry">
          <div class="card-header">
            <h3 class="section-title">Comparaison avec la dernière saisie</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="comparisonChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Section 1: Quantité de drogues saisies -->
        <div class="data-section card">
          <div class="card-header">
            <h3 class="section-title">1. Quantité de drogues saisies selon la substance (avec cumul)</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="detail-table">
                <thead>
                <tr>
                  <th>Nature de la substance saisie</th>
                  <th>Quantité saisie</th>
                  <th>Dernière saisie ({{ lastEntry?.dateSaisie | date:'dd/MM/yyyy' }})</th>
                  <th>Cumul</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Cannabis (kg)</td>
                  <td>{{ data.quantitesDrogues.cannabis || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.cannabis || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.cannabis, lastEntry?.quantitesDrogues?.cannabis) }}</td>
                </tr>
                <tr>
                  <td>Comprimés Tableau A</td>
                  <td>{{ data.quantitesDrogues.comprimesTableauA || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.comprimesTableauA || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.comprimesTableauA, lastEntry?.quantitesDrogues?.comprimesTableauA) }}</td>
                </tr>
                <tr>
                  <td>Ecstasy (comprimé)</td>
                  <td>{{ data.quantitesDrogues.ecstasyComprime || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.ecstasyComprime || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.ecstasyComprime, lastEntry?.quantitesDrogues?.ecstasyComprime) }}</td>
                </tr>
                <tr>
                  <td>Ecstasy (poudre ; en g)</td>
                  <td>{{ data.quantitesDrogues.ecstasyPoudre || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.ecstasyPoudre || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.ecstasyPoudre, lastEntry?.quantitesDrogues?.ecstasyPoudre) }}</td>
                </tr>
                <tr>
                  <td>Subutex (comprimé)</td>
                  <td>{{ data.quantitesDrogues.subutex || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.subutex || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.subutex, lastEntry?.quantitesDrogues?.subutex) }}</td>
                </tr>
                <tr>
                  <td>Cocaïne (g)</td>
                  <td>{{ data.quantitesDrogues.cocaine || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.cocaine || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.cocaine, lastEntry?.quantitesDrogues?.cocaine) }}</td>
                </tr>
                <tr>
                  <td>Héroïne (g)</td>
                  <td>{{ data.quantitesDrogues.heroine || '-' }}</td>
                  <td>{{ lastEntry?.quantitesDrogues?.heroine || '-' }}</td>
                  <td>{{ getCumulativeValue(data.quantitesDrogues.heroine, lastEntry?.quantitesDrogues?.heroine) }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Section 2: Répartition des personnes inculpées -->
        <div class="data-section card">
          <div class="card-header">
            <h3 class="section-title">2. Répartition des personnes inculpées selon la nature d'accusation</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="detail-table">
                <thead>
                <tr>
                  <th>Nature d'accusation</th>
                  <th>Nombre</th>
                  <th>%</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Consommateur</td>
                  <td>{{ data.personnesInculpees.consommateur.nombre || '-' }}</td>
                  <td>{{ data.personnesInculpees.consommateur.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td>Vendeur</td>
                  <td>{{ data.personnesInculpees.vendeur.nombre || '-' }}</td>
                  <td>{{ data.personnesInculpees.vendeur.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td>Trafiquant</td>
                  <td>{{ data.personnesInculpees.trafiquant.nombre || '-' }}</td>
                  <td>{{ data.personnesInculpees.trafiquant.pourcentage || '-' }}%</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Section 3: Caractéristiques sociodémographiques -->
        <div class="data-section card">
          <div class="card-header">
            <h3 class="section-title">3. Répartition des personnes inculpées selon les caractéristiques sociodémographiques</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="detail-table">
                <thead>
                <tr>
                  <th>Caractéristiques sociodémographiques</th>
                  <th>Nombre</th>
                  <th>%</th>
                </tr>
                </thead>
                <tbody>
                <!-- Genre -->
                <tr class="category-header">
                  <td colspan="3"><strong>Genre</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Masculin</td>
                  <td>{{ data.caracteristiquesSociodemographiques.genre.masculin.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.genre.masculin.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Féminin</td>
                  <td>{{ data.caracteristiquesSociodemographiques.genre.feminin.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.genre.feminin.pourcentage || '-' }}%</td>
                </tr>

                <!-- Age -->
                <tr class="category-header">
                  <td colspan="3"><strong>Age</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">&lt;12 ans</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.moins12ans.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.moins12ans.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">&lt;18 ans</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.moins18ans.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.moins18ans.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">18-40</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.entre18et40.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.entre18et40.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">&gt; 40</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.plus40ans.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.age.plus40ans.pourcentage || '-' }}%</td>
                </tr>

                <!-- Nationalité -->
                <tr class="category-header">
                  <td colspan="3"><strong>Nationalité</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Tunisienne</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.tunisienne.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.tunisienne.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Maghrébine</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.maghrebine.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.maghrebine.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Autres</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.autres.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.nationalite.autres.pourcentage || '-' }}%</td>
                </tr>

                <!-- État civil -->
                <tr class="category-header">
                  <td colspan="3"><strong>État civil</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Célibataire</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.celibataire.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.celibataire.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Marié</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.marie.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.marie.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Divorcé</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.divorce.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.divorce.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Veuf</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.veuf.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatCivil.veuf.pourcentage || '-' }}%</td>
                </tr>

                <!-- État professionnel -->
                <tr class="category-header">
                  <td colspan="3"><strong>État professionnel</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Élève</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.eleve.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.eleve.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Étudiant</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Ouvrier</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">Fonctionnaire</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.pourcentage || '-' }}%</td>
                </tr>

                <!-- Niveau socioéconomique -->
                <tr class="category-header">
                  <td colspan="3"><strong>Niveau socioéconomique selon carnet du CNAM</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Carte d'indigent 1 ou 2 ou carte AMEN</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de santé publique</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de médecine de famille</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.pourcentage || '-' }}%</td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de remboursement</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.nombre || '-' }}</td>
                  <td>{{ data.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.pourcentage || '-' }}%</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Dernière saisie et cumul -->
      <div *ngIf="!isLoading && data && lastEntry" class="info-section card">
        <div class="card-header">
          <h3 class="section-title">Comparaison avec la dernière saisie</h3>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Dernière saisie</span>
              <span class="info-value">{{ lastEntry.dateSaisie | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item" *ngIf="lastEntry.structure">
              <span class="info-label">Structure</span>
              <span class="info-value">{{ lastEntry.structure.nom }}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !data" class="error-container">
        <div class="error-message">
          <h3>Données non trouvées</h3>
          <p>Les données demandées n'ont pas pu être trouvées.</p>
          <button class="btn btn-primary" (click)="goBack()">Retour à la liste</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
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

    .header-actions {
      display: flex;
      gap: var(--spacing-3);
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .chart-container {
      height: 400px;
      position: relative;
      margin-top: var(--spacing-4);
    }

    .info-section,
    .data-section {
      margin-bottom: var(--spacing-6);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .info-grid {
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

    .table-responsive {
      overflow-x: auto;
    }

    .detail-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-4);
    }

    .detail-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
    }

    .detail-table td {
      padding: var(--spacing-3);
      border: 1px solid var(--gray-200);
      vertical-align: middle;
      font-size: 14px;
    }

    .category-header td {
      background-color: var(--primary-50);
      font-weight: 600;
      color: var(--primary-800);
    }

    .subcategory {
      padding-left: var(--spacing-6) !important;
      font-style: italic;
      color: var(--gray-700);
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

    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-12);
    }

    .error-message {
      text-align: center;
      max-width: 400px;
    }

    .error-message h3 {
      font-size: 24px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-4) 0;
    }

    .error-message p {
      color: var(--gray-600);
      margin: 0 0 var(--spacing-6) 0;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-actions {
        justify-content: flex-end;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .detail-table {
        font-size: 12px;
      }

      .detail-table th,
      .detail-table td {
        padding: var(--spacing-2);
      }

      .chart-container {
        height: 300px;
      }
    }
  `]
})
export class DetailOffreDroguesComponent implements OnInit {
  data: any = null;
  isLoading = false;
  itemId: number | null = null;
  lastEntry: any = null;
  comparisonChart: Chart | null = null;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private offreDroguesService: OffreDroguesService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itemId = +params['id'];
      if (this.itemId) {
        this.loadData();
      }
    });
  }

  private loadData(): void {
    if (!this.itemId) return;

    this.isLoading = true;

    this.offreDroguesService.getById(this.itemId).subscribe({
      next: (data) => {
        this.data = data;
        this.isLoading = false;

        // Charger la dernière saisie pour comparaison
        this.loadLastEntry();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      }
    });
  }

  private loadLastEntry(): void {
    if (!this.data || !this.data.dateSaisie) return;

    // Récupérer la dernière saisie avant celle-ci
    this.offreDroguesService.getLastEntryBefore(this.data.dateSaisie, this.data.id).subscribe({
      next: (lastEntry) => {
        this.lastEntry = lastEntry;

        // Créer le graphique de comparaison
        setTimeout(() => {
          this.createComparisonChart();
        }, 100);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la dernière saisie:', error);
      }
    });
  }

  private createComparisonChart(): void {
    if (!this.data || !this.lastEntry) return;

    const ctx = document.getElementById('comparisonChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.comparisonChart) {
      this.comparisonChart.destroy();
    }

    // Préparer les données pour le graphique
    const substances = [
      'Cannabis', 'Comprimés Tableau A', 'Ecstasy (comprimé)',
      'Ecstasy (poudre)', 'Subutex', 'Cocaïne', 'Héroïne'
    ];

    const currentData = [
      this.data.quantitesDrogues.cannabis || 0,
      this.data.quantitesDrogues.comprimesTableauA || 0,
      this.data.quantitesDrogues.ecstasyComprime || 0,
      this.data.quantitesDrogues.ecstasyPoudre || 0,
      this.data.quantitesDrogues.subutex || 0,
      this.data.quantitesDrogues.cocaine || 0,
      this.data.quantitesDrogues.heroine || 0
    ];

    const lastData = [
      this.lastEntry.quantitesDrogues?.cannabis || 0,
      this.lastEntry.quantitesDrogues?.comprimesTableauA || 0,
      this.lastEntry.quantitesDrogues?.ecstasyComprime || 0,
      this.lastEntry.quantitesDrogues?.ecstasyPoudre || 0,
      this.lastEntry.quantitesDrogues?.subutex || 0,
      this.lastEntry.quantitesDrogues?.cocaine || 0,
      this.lastEntry.quantitesDrogues?.heroine || 0
    ];

    this.comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: substances,
        datasets: [
          {
            label: `Saisie actuelle (${this.formatDate(this.data.dateSaisie)})`,
            data: currentData,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          },
          {
            label: `Dernière saisie (${this.formatDate(this.lastEntry.dateSaisie)})`,
            data: lastData,
            backgroundColor: 'rgba(107, 114, 128, 0.7)',
            borderColor: 'rgba(107, 114, 128, 1)',
            borderWidth: 1
          }
        ]
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

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  getCumulativeValue(current: number | null, previous: number | null): string {
    if (current === null && previous === null) return '-';

    const currentValue = current || 0;
    const previousValue = previous || 0;
    const sum = currentValue + previousValue;

    return sum.toString();
  }

  isExterne(): boolean {
    return this.authService.hasRole(UserRole.EXTERNE);
  }

  canEdit(): boolean {
    if (!this.data || !this.isExterne()) {
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.data.utilisateurId;
  }

  goBack(): void {
    this.router.navigate(['/offre-drogues']);
  }
}
