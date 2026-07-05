import { LayoutComponent } from './core/layout/main-layout/main-layout.component';
import { ProjectLayoutComponent } from './core/layout/project-layout/project-layout.component';
import { ProjectEpicsComponent } from './features/project/pages/project-epics/project-epics.component';
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
      {
        path: '', 
        loadChildren: () => import('./features/project/project.routes').then(m => m.PROJECT_ROUTES)
      },
    ]
  },
  {
    path: 'project/:projectId',
  component: ProjectLayoutComponent, 
  children: [
    { path: 'epics', component: ProjectEpicsComponent },
  ]
  }
];