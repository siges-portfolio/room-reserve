import { Component, effect, input, output, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwitchComponent } from '@shared/components/switch/switch.component';
import { MatIcon } from '@angular/material/icon';
import {
  DEFAULT_PASSWORD_VALIDATIONS,
  emailValidator,
  confirmPasswordValidation,
  lowercase,
  uppercase,
  digit,
  symbol
} from '@core/validators/auth.validator';
import { SignUpFormData } from '@modules/auth/pages/sign-up/sign-up.component';

@Component({
  standalone: true,
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  host: {
    class: 'sign-up__content',
  },
  imports: [
    ButtonComponent,
    FormFieldComponent,
    InputComponent,
    MatIcon,
    ReactiveFormsModule,
    SwitchComponent
  ]
})
export class UserFormComponent {
  data = input<SignUpFormData>({});
  loading = input<boolean>(false);

  continueUser = output<SignUpFormData>();
  continueCompany = output<SignUpFormData>();

  roles = {
    user: 'Customer',
    company: 'Company Owner'
  }

  form: FormGroup = new FormGroup(
    {
      email: new FormControl('', { validators: [Validators.required, emailValidator()] }),
      password: new FormControl('', { validators: [...DEFAULT_PASSWORD_VALIDATIONS, uppercase(), lowercase(), digit(), symbol()] }),
      confirmPassword: new FormControl('', { validators: [Validators.required] }),
      role: new FormControl('user', { validators: [Validators.required] })
    },
    { validators: [confirmPasswordValidation()] }
  );

  get role() {
    return this.form.get('role')?.value;
  }

  constructor() {
    effect(() => {
      if (this.data().hasOwnProperty('user')) {
        const data = this.data()['user'];
        this.form.patchValue(data);
      }
    });
  }

  submit() {
    const role = this.form.get('role')?.value;

    switch (role) {
      case 'user':
        this.continueUser.emit({ user: this.form.value });
        break;
      case 'company':
        this.continueCompany.emit({ user: this.form.value });
        break;
    }
  }
}
