import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/project-page/project-page.component')
      .then(m => m.ProjectPageComponent),
    title: 'your workspace | Taskly',
  },
];