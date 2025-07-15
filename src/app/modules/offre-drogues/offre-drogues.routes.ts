import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/liste-offre-drogues/liste-offre-drogues.component').then(m => m.ListeOffreDroguesComponent)
  },
  {
    path: 'nouveau',
    loadComponent: () => import('./components/saisie-offre-drogues/saisie-offre-drogues.component').then(m => m.SaisieOffreDroguesComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./components/detail-offre-drogues/detail-offre-drogues.component').then(m => m.DetailOffreDroguesComponent)
  },
  {
    path: 'modifier/:id',
    loadComponent: () => import('./components/saisie-offre-drogues/saisie-offre-drogues.component').then(m => m.SaisieOffreDroguesComponent)
  }
];