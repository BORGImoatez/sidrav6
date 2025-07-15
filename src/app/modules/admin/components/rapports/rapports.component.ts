import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rapports-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Rapports et statistiques</h1>
          <p class="page-description">
            Générer des rapports et consulter les statistiques du système
          </p>
        </div>
      </div>

      <div class="coming-soon card">
        <div class="card-body text-center">
          <div class="coming-soon-icon">📊</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Module en cours de développement
          </h3>
          <p class="text-gray-600 mb-6">
            Les rapports et statistiques seront disponibles dans une prochaine version.
          </p>
          <div class="features-preview">
            <h4 class="font-semibold text-gray-900 mb-3">Fonctionnalités prévues :</h4>
            <ul class="features-list">
              <li>📈 Statistiques d'utilisation par structure</li>
              <li>📊 Rapports de consommation de SPA</li>
              <li>📋 Export des données en Excel/PDF</li>
              <li>🎯 Tableaux de bord personnalisés</li>
              <li>📅 Rapports périodiques automatiques</li>
              <li>🔍 Analyses comparatives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rapports-container {
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

    .coming-soon {
      max-width: 600px;
      margin: 0 auto;
    }

    .coming-soon-icon {
      font-size: 64px;
      margin-bottom: var(--spacing-6);
    }

    .features-preview {
      text-align: left;
      background-color: var(--gray-50);
      padding: var(--spacing-6);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-6);
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features-list li {
      padding: var(--spacing-2) 0;
      color: var(--gray-700);
    }
  `]
})
export class RapportsComponent {
}