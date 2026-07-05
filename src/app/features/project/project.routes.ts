import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'project',
    children: [
      {
        path: '', 
        loadComponent: () => import('./pages/project-page/project-page.component')
          .then(m => m.ProjectPageComponent),
        title: 'your workspace | Taskly',
      },
      {
        path: 'add', 
        loadComponent: () => import('./pages/add-project/add-project.component')
          .then(m => m.AddProjectComponent),
        title: 'add project | Taskly',
      },
      
      {
        path: ':projectId',
        loadComponent: () => import('../../../app/core/layout/project-layout/project-layout.component')
          .then(m => m.ProjectLayoutComponent),
        children: [
          {
            path: 'epics',
            loadComponent: () => import('./pages/project-epics/project-epics.component')
              .then(m => m.ProjectEpicsComponent)
          },
          {
            path: 'tasks',
            loadComponent: () => import('./pages/project-tasks/project-tasks.component')
              .then(m => m.ProjectTasksComponent)
          },
          {
            path: 'members',
            loadComponent: () => import('./pages/project-members/project-members.component')
              .then(m => m.ProjectMembersComponent)
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/edit-project/edit-project.component')
              .then(m => m.EditProjectComponent)
          },
          // { path: '', redirectTo: 'epics', pathMatch: 'full' }
        ]
      }
    ]
  }
];