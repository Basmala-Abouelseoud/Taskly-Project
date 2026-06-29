import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
 {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },

  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component')
      .then(m => m.LoginPageComponent),
          title: 'Welcome Back! | Taskly',

  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up-page/sign-up-page.component')
      .then(m => m.SignUpPageComponent),
    title: 'Create your workspace | Taskly',
  },
];