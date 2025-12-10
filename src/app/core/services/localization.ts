import { DOCUMENT, inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { currentLanguage } from '@core/languages';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  document = inject(DOCUMENT);
  translocoService = inject(TranslocoService);

  #language = new BehaviorSubject<string>(this.translocoService.getDefaultLang());
  language = toSignal(this.#language);

  constructor() {
    this.#language.pipe(skip(1), distinctUntilChanged()).subscribe({
      next: (lang) => {
        localStorage.setItem('language', lang);
        this.translocoService.setActiveLang(lang);
        this.document.documentElement.setAttribute('lang', lang);
      }
    })
  }

  initializeLocalization() {
    const language = localStorage.getItem('language') || currentLanguage();
    this.#language.next(language);
  }

  changeLanguage(lang: string): void {
    this.#language.next(lang);
  }
}
