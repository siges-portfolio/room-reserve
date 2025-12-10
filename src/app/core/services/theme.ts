import { DOCUMENT, inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  document = inject(DOCUMENT);
  renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);

  #theme: BehaviorSubject<Themes> = new BehaviorSubject<Themes>(Themes.DARK);
  themeSignal = toSignal(this.#theme);

  constructor() {
    const theme = localStorage.getItem('theme') as Themes;
    const mobilePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.DARK : Themes.LIGHT;

    this.changeTheme(theme ? theme : mobilePreferred)
  }

  changeTheme(theme: Themes): void {
    const htmlRef= this.document.documentElement;

    htmlRef.classList.remove('dark-theme', 'light-theme');
    this.renderer.addClass(htmlRef, `${ theme }-theme`);

    localStorage.setItem('theme', theme);
    this.#theme.next(theme);
  }
}
