import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/input/input.component';
import {
  DEFAULT_PASSWORD_VALIDATIONS,
  digit,
  lowercase,
  symbol,
  uppercase,
  confirmPasswordValidation,
  emailValidator
} from '@core/validators/auth.validator';
import { MatIconModule } from '@angular/material/icon';
import { SwitchComponent, SwitchValues } from '@shared/components/switch/switch.component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    ButtonComponent,
    FormFieldComponent,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    MatIconModule,
    SwitchComponent,
    RouterLink
  ],
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  roles: SwitchValues = {
    member: 'Member',
    owner: 'Owner',
  }

  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', { validators: [Validators.required, emailValidator()] }),
      password: new FormControl('', { validators: [...DEFAULT_PASSWORD_VALIDATIONS, uppercase(), lowercase(), digit(), symbol()] }),
      confirmPassword: new FormControl('', { validators: [Validators.required] }),
      role: new FormControl('member', { validators: [Validators.required] })
    },
    { validators: [confirmPasswordValidation()] }
  );
}
