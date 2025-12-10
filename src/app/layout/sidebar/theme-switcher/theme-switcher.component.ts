import { Component, inject, OnDestroy } from '@angular/core';
import { ThemeService } from '@core/services/theme';
import { SwitchComponent } from '@shared/components/switch/switch.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  imports: [SwitchComponent, ReactiveFormsModule, TranslocoDirective]
})
export class ThemeSwitcherComponent implements OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  themeService = inject(ThemeService);

  switchControl = new FormControl();

  themes = {
    dark: 'dark_mode',
    light: 'light_mode',
  };

  constructor() {
    const currentTheme = this.themeService.themeSignal();

    if (currentTheme) this.switchControl.setValue(currentTheme);
    this.switchControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.themeService.changeTheme(value)
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
