import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import {
  DEFAULT_PASSWORD_VALIDATIONS,
  emailValidator,
} from '@core/validators/auth.validator';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';

@Component({
  standalone: true,
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    RouterLink,
    MatIconModule,
    CheckboxComponent
  ],
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, emailValidator()] }),
    password: new FormControl('', { validators: [Validators.required, ...DEFAULT_PASSWORD_VALIDATIONS] }),
    remember: new FormControl(false)
  });
}
