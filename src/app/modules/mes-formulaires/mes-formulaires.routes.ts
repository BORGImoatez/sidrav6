import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/mes-formulaires/mes-formulaires.component').then(m => m.MesFormulairesComponent)
  },
  {
    path: 'patient/:id',
    loadComponent: () => import('./components/patient-formulaires/patient-formulaires.component').then(m => m.PatientFormulairesComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./components/formulaire-detail/formulaire-detail.component').then(m => m.FormulaireDetailComponent)
  }
];

