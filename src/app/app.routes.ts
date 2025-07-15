import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'otp',
    loadComponent: () => import('./components/otp/otp.component').then(m => m.OtpComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'formulaire',
        loadChildren: () => import('./modules/formulaire/formulaire.routes').then(m => m.routes)
      },
      {
        path: 'mes-formulaires',
        loadChildren: () => import('./modules/mes-formulaires/mes-formulaires.routes').then(m => m.routes)
      },
      {
        path: 'offre-drogues',
        loadChildren: () => import('./modules/offre-drogues/offre-drogues.routes').then(m => m.routes)
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes)
      },
      {
        path: 'aide',
        loadChildren: () => import('./modules/aide/aide.routes').then(m => m.routes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];