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
export class GuestGuard implements CanActivate {
  authService = inject(AuthorizationService);
  router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.authService.authState$.pipe(
      filter((state) => !state.isLoading),
      map((state) => {
        console.log('[Guest Guard] State: ', state);
        if (state.session && !state.isRecovery) {
          void this.router.navigate(['/dashboard']);
          return false;
        } else {
          return true;
        }
      }),
    );
  }
}
