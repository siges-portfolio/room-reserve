import {
  ApplicationConfig, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { LocalizationService } from '@core/services/localization';
import { ThemeService } from '@core/services/theme';
import { routes } from './app.routes';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ru', 'uk'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true
      },
      loader: TranslocoHttpLoader
    }),
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(LocalizationService).initializeLocalization();
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
