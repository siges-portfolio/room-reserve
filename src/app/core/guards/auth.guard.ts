import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthorizationService } from '@core/services/authorization';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  authService = inject(AuthorizationService);
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.authService.authState$.pipe(
      filter((state) => !state.isLoading),
      map((state) => {
        if (state.isRecovery) {
          void this.router.navigate(['/authorization/reset-password']);
          return false;
        } else if (state.session) {
          return true;
        } else {
          void this.router.navigate(['/authorization']);
          return false;
        }
      }),
    );
  }
}
