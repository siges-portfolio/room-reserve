import { environment } from '@environment';
import { getBrowserLang } from '@jsverse/transloco';

export const currentLanguage = () => {
  const defaultLocale = getBrowserLang() || environment.DEFAULT_LANGUAGE;
  if (environment.AVAILABLE_LANGUAGES.includes(defaultLocale)) {
    return defaultLocale;
  }
  return environment.DEFAULT_LANGUAGE;
};
