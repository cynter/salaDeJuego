import { CanActivateFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        console.warn('Usuario no autenticado');
        return router.createUrlTree(['/login']);
      }
    })
  );
};