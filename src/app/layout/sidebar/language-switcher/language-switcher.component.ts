import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { OptionComponent } from '@shared/components/option/option.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '@core/services/localization';

@Component({
  standalone: true,
  selector: 'language-switcher',
  imports: [
    FormFieldComponent,
    OptionComponent,
    SelectComponent,
    ReactiveFormsModule,
    UpperCasePipe,
    TranslocoDirective
  ],
  templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent implements OnDestroy {
  localizationService = inject(LocalizationService);
  translocoService = inject(TranslocoService);

  destroy$: Subject<void> = new Subject();
  control = new FormControl('');

  availableLangs = signal<string[]>([]);
  selectedLang = signal<string>(this.translocoService.getActiveLang());

  constructor() {
    this.availableLangs.set(this.translocoService.getAvailableLangs().map((lang) => (typeof lang === "string") ? lang : lang.label))

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      if (!lang) return;

      this.selectedLang.set(lang);
      this.localizationService.changeLanguage(lang)
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
