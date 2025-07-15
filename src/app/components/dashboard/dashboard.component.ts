import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <div class="welcome-card card">
          <div class="card-body">
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              Bienvenue {{ currentUser?.prenom }} {{ currentUser?.nom }}
            </h2>
            <p class="text-gray-600 mb-4">
              {{ getWelcomeMessage() }}
            </p>
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-label">Dernière connexion</span>
                <span class="stat-value">{{ getLastLoginDisplay() }}</span>
              </div>
              <div class="stat-item" *ngIf="currentUser?.structure">
                <span class="stat-label">Structure</span>
                <span class="stat-value">{{ currentUser?.structure?.nom }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid" *ngIf="statistics">
        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-header">
              <h3 class="stat-title">Utilisateurs actifs</h3>
              <div class="stat-icon">👥</div>
            </div>
            <div class="stat-number text-primary">{{ statistics.activeUsers }}</div>
            <div class="stat-subtitle">sur {{ statistics.totalUsers }} total</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-header">
              <h3 class="stat-title">Structures actives</h3>
              <div class="stat-icon">🏢</div>
            </div>
            <div class="stat-number text-success">{{ statistics.activeStructures }}</div>
            <div class="stat-subtitle">sur {{ statistics.totalStructures }} total</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-header">
              <h3 class="stat-title">Formulaires</h3>
              <div class="stat-icon">📝</div>
            </div>
            <div class="stat-number text-warning">0</div>
            <div class="stat-subtitle">en cours de traitement</div>
          </div>
        </div>

        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-header">
              <h3 class="stat-title">Rapports</h3>
              <div class="stat-icon">📊</div>
            </div>
            <div class="stat-number text-secondary">0</div>
            <div class="stat-subtitle">générés ce mois</div>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="actions-card card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Actions rapides</h3>
          </div>
          <div class="card-body">
            <div class="actions-grid">
              <a href="/formulaire" class="action-item">
                <div class="action-icon">📝</div>
                <div class="action-content">
                  <h4 class="action-title">Nouveau formulaire</h4>
                  <p class="action-description">Saisir les données d'un nouvel usager SPA</p>
                </div>
              </a>

              <a href="/mes-formulaires" class="action-item">
                <div class="action-icon">📋</div>
                <div class="action-content">
                  <h4 class="action-title">Mes formulaires</h4>
                  <p class="action-description">Consulter et modifier mes saisies</p>
                </div>
              </a>

              <a href="/admin/utilisateurs" class="action-item" *ngIf="canAccessAdmin()">
                <div class="action-icon">👥</div>
                <div class="action-content">
                  <h4 class="action-title">Gestion utilisateurs</h4>
                  <p class="action-description">Créer et gérer les comptes utilisateurs</p>
                </div>
              </a>

              <a href="/admin/rapports" class="action-item" *ngIf="canAccessAdmin()">
                <div class="action-icon">📈</div>
                <div class="action-content">
                  <h4 class="action-title">Rapports</h4>
                  <p class="action-description">Générer des statistiques et rapports</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="recent-activity-card card" *ngIf="recentUsers && recentUsers.length > 0">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div class="activity-item" *ngFor="let user of recentUsers.slice(0, 5)">
                <div class="activity-avatar">
                  {{ getUserInitials(user) }}
                </div>
                <div class="activity-content">
                  <div class="activity-text">
                    <strong>{{ user.prenom }} {{ user.nom }}</strong>
                    <span class="text-gray-600">s'est connecté</span>
                  </div>
                  <div class="activity-time">
                    {{ getRelativeTime(user.derniereConnexion) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section" *ngIf="!canAccessAdmin()">
        <div class="info-card card">
          <div class="card-body">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Guide d'utilisation
            </h3>
            <div class="guide-steps">
              <div class="guide-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4 class="step-title">Créer un nouveau formulaire</h4>
                  <p class="step-description">
                    Cliquez sur "Nouveau formulaire" pour saisir les données d'un usager SPA
                  </p>
                </div>
              </div>
              <div class="guide-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4 class="step-title">Remplir les informations</h4>
                  <p class="step-description">
                    Suivez les 6 étapes du formulaire pour compléter toutes les données nécessaires
                  </p>
                </div>
              </div>
              <div class="guide-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4 class="step-title">Valider et enregistrer</h4>
                  <p class="step-description">
                    Vérifiez les informations et validez pour générer l'IUN automatiquement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: var(--spacing-8);
    }

    .welcome-card {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      border: none;
    }

    .welcome-card .card-body {
      padding: var(--spacing-8);
    }

    .quick-stats {
      display: flex;
      gap: var(--spacing-6);
      margin-top: var(--spacing-6);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-weight: 600;
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4);
    }

    .stat-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-600);
      margin: 0;
    }

    .stat-icon {
      font-size: 24px;
      opacity: 0.7;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: var(--spacing-1);
    }

    .stat-subtitle {
      font-size: 12px;
      color: var(--gray-500);
    }

    .dashboard-actions {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-6);
      margin-bottom: var(--spacing-8);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-4);
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      padding: var(--spacing-4);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--gray-900);
      transition: all 0.2s ease-in-out;
    }

    .action-item:hover {
      border-color: var(--primary-300);
      background-color: var(--primary-50);
      transform: translateY(-1px);
    }

    .action-icon {
      font-size: 32px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--gray-100);
      border-radius: var(--radius-md);
    }

    .action-content {
      flex: 1;
    }

    .action-title {
      font-weight: 600;
      font-size: 16px;
      margin: 0 0 var(--spacing-1) 0;
      color: var(--gray-900);
    }

    .action-description {
      font-size: 14px;
      color: var(--gray-600);
      margin: 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .activity-avatar {
      width: 32px;
      height: 32px;
      background-color: var(--primary-500);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      font-size: 14px;
      margin-bottom: var(--spacing-1);
    }

    .activity-time {
      font-size: 12px;
      color: var(--gray-500);
    }

    .info-section {
      margin-bottom: var(--spacing-8);
    }

    .guide-steps {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .guide-step {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-4);
    }

    .step-number {
      width: 32px;
      height: 32px;
      background-color: var(--primary-500);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
    }

    .step-title {
      font-weight: 600;
      font-size: 16px;
      margin: 0 0 var(--spacing-1) 0;
      color: var(--gray-900);
    }

    .step-description {
      font-size: 14px;
      color: var(--gray-600);
      margin: 0;
    }

    @media (max-width: 768px) {
      .dashboard-actions {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-stats {
        flex-direction: column;
        gap: var(--spacing-3);
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-4);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  statistics: any = null;
  recentUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadStatistics();
    this.loadRecentActivity();
  }

  private loadStatistics(): void {
    this.userService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  private loadRecentActivity(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.recentUsers = users
          .filter(u => u.derniereConnexion)
          .sort((a, b) => {
            const dateA = a.derniereConnexion ? new Date(a.derniereConnexion).getTime() : 0;
            const dateB = b.derniereConnexion ? new Date(b.derniereConnexion).getTime() : 0;
            return dateB - dateA;
          });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'activité récente:', error);
      }
    });
  }

  getWelcomeMessage(): string {
    if (!this.currentUser) return '';

    const hour = new Date().getHours();
    let greeting = 'Bonne journée';
    
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }

    switch (this.currentUser.role) {
      case UserRole.SUPER_ADMIN:
        return `${greeting} ! Vous avez accès à toutes les fonctionnalités d'administration de SIDRA.`;
      case UserRole.ADMIN_STRUCTURE:
        return `${greeting} ! Gérez les utilisateurs de votre structure et consultez les données.`;
      case UserRole.UTILISATEUR:
        return `${greeting} ! Utilisez SIDRA pour saisir et consulter les données des usagers SPA.`;
      default:
        return `${greeting} ! Bienvenue sur SIDRA.`;
    }
  }

  getLastLoginDisplay(): string {
    if (!this.currentUser?.derniereConnexion) {
      return 'Première connexion';
    }

    const lastLogin = new Date(this.currentUser.derniereConnexion);
    const now = new Date();
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Aujourd\'hui à ' + lastLogin.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Hier à ' + lastLogin.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return lastLogin.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  canAccessAdmin(): boolean {
    return this.authService.canAccessAdmin();
  }

  getUserInitials(user: User): string {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }

  getRelativeTime(date: Date | undefined): string {
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'À l\'instant';
    } else if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  }
}