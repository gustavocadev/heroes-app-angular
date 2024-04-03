import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

const checkAuthStatus = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    tap((isAuth) => {
      if (isAuth) {
        // redirect to the home page
        router.navigateByUrl('/heroes/list');
      }
    }),
    // at this point the user is not authenticated
    map((isAuth) => !isAuth)
  );
};

export const canActiveGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = (route, segments) => {
  return checkAuthStatus();
};
