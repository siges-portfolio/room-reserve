import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthorizationService } from '@core/services/authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthorizationService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.session.pipe(map(session => {
      const token = session?.access_token;

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }))

    return next.handle(req);
  }
}
