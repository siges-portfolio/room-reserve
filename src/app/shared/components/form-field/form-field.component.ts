import {
  Component,
  computed, contentChild,
  effect, input,
  OnDestroy,
  signal, ViewEncapsulation
} from '@angular/core';
import { TouchedChangeEvent, ValidationErrors } from '@angular/forms';
import { TooltipDirective } from '@shared/components/tooltip/tooltip.directive';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { InputComponent } from '@shared/components/input/input.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthValidatorMessages } from '@core/validators/auth.validator';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';

@Component({
  standalone: true,
  selector: 'form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  host: {
    class: 'form-field',
    '[class.touched]': 'isTouched()',
    '[class.disabled]': 'field()?.disabled',
    '[class.error]': 'hasErrors'
  },
  encapsulation: ViewEncapsulation.None,
  imports: [MatIcon, NgTemplateOutlet, TooltipDirective]
})
export class FormFieldComponent implements OnDestroy {
  #destroy$: Subject<void> = new Subject();
  #initialized: boolean = false;

  hideValidation = input<boolean>(false);
  isTouched = signal<boolean>(false);
  isPassword = signal<boolean>(false);
  validationErrors = signal<ValidationErrors | null>(null);
  messages = computed<{ key: string; value: any }[] | null>(() => {
    const { touched, validation } = { touched: this.isTouched(), validation: this.validationErrors() };
    if (!touched || !validation) return null;

    const required = Object(validation).hasOwnProperty('required');
    if (required) return [{ key: 'required', value: true }];

    return Object.entries(validation).map(([key, value]) => {
      return { key, value };
    });
  });

  field = contentChild<FormFieldControl<any>>(FormFieldControl);
  fieldType = signal<string | null>(null);

  constructor() {
    effect(() => {
      const field = this.field();
      if (!field || this.#initialized) return;

      this.isPassword.set(field.elementRef.nativeElement.type === 'password');
      this.fieldType.set(field.elementRef.nativeElement.type);

      const control = field.ngControl?.control;
      if (!control || this.hideValidation()) return;

      control.events.pipe(takeUntil(this.#destroy$)).subscribe((event) => {
        if (event instanceof TouchedChangeEvent) this.isTouched.set(event.touched);
        this.validationErrors.set(control.errors);
      });

      this.#initialized = true;
    });
  }

  get hasErrors(): boolean {
    return !!this.validationErrors();
  }

  togglePasswordVisibility() {
    const element = this.field();
    if (!element) return;

    const elementRef = element.elementRef.nativeElement;
    const type = elementRef.getAttribute('type') === 'password' ? 'text' : 'password';
    this.fieldType.set(type);
    elementRef.setAttribute('type', type);
  }

  ngOnDestroy() {
    this.#destroy$.next();
    this.#destroy$.complete();
  }
}
