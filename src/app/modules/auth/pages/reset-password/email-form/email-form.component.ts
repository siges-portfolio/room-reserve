import { Component, output } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { emailValidator } from '@core/validators/auth.validator';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
  imports: [
    ButtonComponent,
    FormFieldComponent,
    InputComponent,
    MatIcon,
    ReactiveFormsModule,
    TranslocoDirective
  ],
  host: {
    class: 'auth-content__content'
  }
})
export class EmailFormComponent {
  continue = output<string>();

  emailControl = new FormControl('', { validators: [Validators.required, emailValidator()] });

  onContinue() {
    this.continue.emit(this.emailControl.value ?? '')
  }
}
