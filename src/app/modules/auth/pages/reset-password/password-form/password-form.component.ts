import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DEFAULT_PASSWORD_VALIDATIONS,
  confirmPasswordValidation,
  digit,
  lowercase,
  symbol,
  uppercase
} from '@core/validators/auth.validator';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'password-form',
  templateUrl: 'password-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    MatIcon,
    ButtonComponent,
    TranslocoDirective
  ],
  host: {
    class: 'auth-content__content'
  }
})
export class PasswordFormComponent {
  submit = output<void>();

  loading = input<boolean>(false);

  form = new FormGroup({
    password: new FormControl('', { validators: [...DEFAULT_PASSWORD_VALIDATIONS, uppercase(), lowercase(), digit(), symbol()] }),
    confirmPassword: new FormControl('', { validators: Validators.required }),
  }, { validators: [confirmPasswordValidation()] });

  onSubmit() {
    this.submit.emit()
  }
}
