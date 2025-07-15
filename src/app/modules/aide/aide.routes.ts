import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/aide/aide.component').then(m => m.AideComponent)
  }
];