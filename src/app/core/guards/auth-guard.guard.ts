// import { CanActivateFn, Router } from '@angular/router';
// import { STORED_KEYS } from '../constants/storedKeys';
// import { inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from '../../features/auth/services/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//     const authService = inject(AuthService);
//   const platform = inject(PLATFORM_ID); //InjectionToken

//   if (isPlatformBrowser(platform)) {
//     const token = localStorage.getItem(STORED_KEYS.USER_TOKEN);
//     if (token && authService.decodeToken(token)) {
//       return true;
//     }
//   }

//   return router.parseUrl('/login');
// };