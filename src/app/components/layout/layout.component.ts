import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.sidebar-collapsed]="isSidebarCollapsed">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <h2 class="text-lg font-bold text-white">SIDRA</h2>
            <p class="text-xs text-blue-200" *ngIf="!isSidebarCollapsed">
              Système d'Information<br>Drogue et Addiction
            </p>
          </div>
          <button 
            class="sidebar-toggle"
            (click)="toggleSidebar()"
            type="button"
          >
            <span class="toggle-icon" [class.rotated]="isSidebarCollapsed">
              ‹
            </span>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title" *ngIf="!isSidebarCollapsed">Navigation</h3>
            
            <a 
              routerLink="/dashboard" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Tableau de bord' : ''"
            >
              <span class="nav-icon">📊</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Tableau de bord</span>
            </a>

            <a 
              routerLink="/formulaire" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Nouveau formulaire' : ''"
              *ngIf="!isExterne()"

            >
              <span class="nav-icon">📝</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Nouveau formulaire</span>
            </a>

            <a 
              routerLink="/mes-formulaires" 
              routerLinkActive="active"
              class="nav-item"
              *ngIf="!isExterne()"
              [title]="isSidebarCollapsed ? 'Mes formulaires' : ''"
            >
              <span class="nav-icon">📋</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Mes formulaires</span>
            </a>

            <a 
              routerLink="/offre-drogues" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Indicateurs offre de drogues' : ''"
            >
              <span class="nav-icon">📊</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">
                {{ isExterne() ? 'Mes indicateurs' : 'Offre de drogues' }}
              </span>
            </a>
          </div>

          <div class="nav-section" *ngIf="canAccessAdmin()">
            <h3 class="nav-section-title" *ngIf="!isSidebarCollapsed">Administration</h3>
            
            <a 
              routerLink="/admin/utilisateurs" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Gestion des utilisateurs' : ''"
            >
              <span class="nav-icon">👥</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Utilisateurs</span>
            </a>

            <a 
              routerLink="/admin/structures" 
              routerLinkActive="active"
              class="nav-item"
              *ngIf="isSuperAdmin()"
              [title]="isSidebarCollapsed ? 'Gestion des structures' : ''"
            >
              <span class="nav-icon">🏢</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Structures</span>
            </a>

            <a 
              routerLink="/admin/rapports" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Rapports et statistiques' : ''"
            >
              <span class="nav-icon">📈</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Rapports</span>
            </a>

            <a 
              routerLink="/admin/pending-users" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Demandes d\'inscription' : ''"
            >
              <span class="nav-icon">🔔</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Demandes d'inscription</span>
            </a>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title" *ngIf="!isSidebarCollapsed">Support</h3>
            
            <a 
              routerLink="/aide" 
              routerLinkActive="active"
              class="nav-item"
              [title]="isSidebarCollapsed ? 'Guide d utilisation' : ''"
            >
              <span class="nav-icon">❓</span>
              <span class="nav-label" *ngIf="!isSidebarCollapsed">Aide</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" *ngIf="currentUser && !isSidebarCollapsed">
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
            <div class="user-details">
              <div class="user-name">{{ currentUser.prenom }} {{ currentUser.nom }}</div>
              <div class="user-role">{{ getUserRoleLabel() }}</div>
              <div class="user-structure" *ngIf="currentUser.structure">
                {{ currentUser.structure.nom }}
              </div>
            </div>
          </div>
          
          <button 
            class="logout-btn"
            (click)="logout()"
            type="button"
            [title]="isSidebarCollapsed ? 'Se déconnecter' : ''"
          >
            <span class="nav-icon">🚪</span>
            <span class="nav-label" *ngIf="!isSidebarCollapsed">Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content" [class.main-content-expanded]="isSidebarCollapsed">
        <header class="main-header">
          <div class="header-left">
            <button 
              class="mobile-menu-btn"
              (click)="toggleSidebar()"
              type="button"
            >
              ☰
            </button>
            <h1 class="page-title">{{ getPageTitle() }}</h1>
          </div>
          
          <div class="header-right">
            <div class="user-menu" *ngIf="currentUser">
              <div class="user-avatar-sm">{{ getUserInitials() }}</div>
              <div class="user-info-sm">
                <div class="user-name-sm">{{ currentUser.prenom }} {{ currentUser.nom }}</div>
                <div class="user-role-sm">{{ getUserRoleLabel() }}</div>
              </div>
            </div>
          </div>
        </header>

        <div class="main-content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      background-color: var(--gray-50);
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, var(--primary-600), var(--primary-800));
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease-in-out;
      position: relative;
      box-shadow: var(--shadow-lg);
      z-index: 100;
    }

    .sidebar-collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: var(--spacing-6) var(--spacing-4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .sidebar-logo h2 {
      margin: 0;
      font-size: 20px;
    }

    .sidebar-logo p {
      margin: var(--spacing-1) 0 0 0;
      opacity: 0.8;
      line-height: 1.2;
    }

    .sidebar-toggle {
      position: absolute;
      top: 50%;
      right: -12px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background: var(--primary-500);
      border: 2px solid white;
      border-radius: 50%;
      color: white;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;
    }

    .sidebar-toggle:hover {
      background: var(--primary-300);
      transform: translateY(-50%) scale(1.1);
    }

    .toggle-icon {
      transition: transform 0.3s ease-in-out;
      display: inline-block;
    }

    .toggle-icon.rotated {
      transform: rotate(180deg);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--spacing-4) 0;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: var(--spacing-6);
    }

    .nav-section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 var(--spacing-3) var(--spacing-4);
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-3) var(--spacing-4);
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s ease-in-out;
      border-left: 3px solid transparent;
      gap: var(--spacing-3);
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .nav-item.active {
      background-color: rgba(255, 255, 255, 0.15);
      border-left-color: white;
      color: white;
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }

    .sidebar-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: var(--spacing-4);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
      padding: var(--spacing-3);
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-300);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-structure {
      font-size: 11px;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Main content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s ease-in-out;
    }

    .main-content-expanded {
      margin-left: 0;
    }

    .main-header {
      background: white;
      padding: var(--spacing-4) var(--spacing-6);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-200);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .mobile-menu-btn {
      display: none;
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: var(--spacing-2);
      border-radius: var(--radius-sm);
      color: var(--gray-600);
    }

    .mobile-menu-btn:hover {
      background-color: var(--gray-100);
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .user-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-500);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
      color: white;
    }

    .user-info-sm {
      display: flex;
      flex-direction: column;
    }

    .user-name-sm {
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-900);
    }

    .user-role-sm {
      font-size: 12px;
      color: var(--gray-500);
    }

    .main-content-area {
      flex: 1;
      padding: var(--spacing-6);
      overflow-y: auto;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -280px;
        top: 0;
        height: 100vh;
        z-index: 1000;
      }

      .sidebar.sidebar-open {
        left: 0;
      }

      .sidebar-collapsed {
        left: -80px;
      }

      .main-content {
        margin-left: 0;
        width: 100%;
      }

      .mobile-menu-btn {
        display: block;
      }

      .user-info-sm {
        display: none;
      }

      .main-content-area {
        padding: var(--spacing-4);
      }
    }

    @media (max-width: 480px) {
      .main-header {
        padding: var(--spacing-3) var(--spacing-4);
      }

      .page-title {
        font-size: 20px;
      }

      .main-content-area {
        padding: var(--spacing-3);
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  isSidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  canAccessAdmin(): boolean {
    return this.authService.canAccessAdmin();
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole(UserRole.SUPER_ADMIN);
  }

  isExterne(): boolean {
    return this.authService.hasRole(UserRole.EXTERNE);
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const initials = `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`;
    return initials.toUpperCase();
  }

  getUserRoleLabel(): string {
    if (!this.currentUser) return '';
    
    switch (this.currentUser.role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Administrateur';
      case UserRole.ADMIN_STRUCTURE:
        return 'Admin Structure';
      case UserRole.UTILISATEUR:
        return 'Utilisateur';
      default:
        return '';
    }
  }

  getPageTitle(): string {
    const url = this.router.url;
    
    if (url.includes('/dashboard')) return 'Tableau de bord';
    if (url.includes('/formulaire')) return 'Nouveau formulaire';
    if (url.includes('/mes-formulaires')) return 'Mes formulaires';
    if (url.includes('/admin/utilisateurs')) return 'Gestion des utilisateurs';
    if (url.includes('/admin/structures')) return 'Gestion des structures';
    if (url.includes('/admin/rapports')) return 'Rapports et statistiques';
    if (url.includes('/admin/pending-users')) return 'Demandes d\'inscription';
    if (url.includes('/aide')) return 'Guide d\'utilisation';
    
    return 'SIDRA';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}