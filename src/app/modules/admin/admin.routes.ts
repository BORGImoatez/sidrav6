import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'utilisateurs',
    pathMatch: 'full'
  },
  {
    path: 'utilisateurs',
    loadComponent: () => import('./components/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent)
  },
  {
    path: 'structures',
    loadComponent: () => import('./components/structures/structures.component').then(m => m.StructuresComponent)
  },
  {
    path: 'rapports',
    loadComponent: () => import('./components/rapports/rapports.component').then(m => m.RapportsComponent)
  },
  {
    path: 'pending-users',
    loadComponent: () => import('./components/pending-users/pending-users.component').then(m => m.PendingUsersComponent)
  }
];
