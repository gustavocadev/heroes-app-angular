import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

const checkAuthStatus = () => {
  const autService = inject(AuthService);
  const router = inject(Router);

  return autService.checkAuthStatus().pipe(
    tap((status) => console.log('Auth: ', status)),
    tap((isAuth) => {
      if (!isAuth) {
        router.navigate(['/auth/login']);
      }
    })
  );
};

export const canActivatedGuard: CanActivateFn = (route, state) => {
  console.log('canActivatedGuard', route, state);

  return checkAuthStatus();
};

export const canMatchGuard: CanMatchFn = (route, segments) => {
  console.log('canMatchGuard', route, segments);
  return checkAuthStatus();
};
