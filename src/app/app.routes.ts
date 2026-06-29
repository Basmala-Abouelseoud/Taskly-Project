import { LayoutComponent } from './core/layout/main-layout/main-layout.component';
import { PROJECT_ROUTES } from './features/project/project.routes';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'project', loadComponent: () => import('./features/project/pages/project-page/project-page.component').then(m => m.ProjectPageComponent) },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];