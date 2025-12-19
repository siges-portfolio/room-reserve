import { InjectionToken } from '@angular/core';

export const USER_REGION = new InjectionToken<string>('region', {
  factory: () => {
    const language = navigator.language;
    const locale = new Intl.Locale(language);

    return locale.region ? locale.region.toUpperCase() : 'US';
  }
});
