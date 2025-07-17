import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/patient-search/patient-search.component').then(m => m.PatientSearchComponent)
  },
  {
    path: 'requests',
    loadComponent: () => import('./components/access-requests/access-requests.component').then(m => m.AccessRequestsComponent)
  }
];