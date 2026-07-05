import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.error?.message === 'JWT expired') {
        console.warn('Token expired, logging out...');
        authService.clearSession();
        window.location.href = '/login'; 
      }
      return throwError(() => error);
    })
  );
};