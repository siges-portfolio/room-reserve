import { Component, effect, input, output } from '@angular/core';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SignUpFormData } from '@modules/auth/pages/sign-up/sign-up.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'company-form',
  templateUrl: './company-form.component.html',
  host: {
    class: 'auth-content__content',
  },
  imports: [
    FormFieldComponent,
    InputComponent,
    MatIconModule,
    ReactiveFormsModule,
    ButtonComponent,
    TranslocoDirective
  ]
})
export class CompanyFormComponent {
  data = input<SignUpFormData>({});
  loading = input<boolean>(false);

  back = output<SignUpFormData>();
  continue = output<SignUpFormData>();

  form: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required, Validators.maxLength(32), Validators.minLength(3)] }),
    description: new FormControl('', { validators: [Validators.maxLength(256)] })
  });

  constructor() {
    effect(() => {
      if (this.data().hasOwnProperty('company')) {
        const data = this.data()['company'];
        this.form.patchValue(data);
      }
    });
  }

  onAction(action: 'back' | 'submit') {
    const value = this.form.value;

    switch (action) {
      case 'back':
        this.back.emit({ company: value })
        break
      case 'submit':
        this.continue.emit({ company: value })
        break
    }
  }
}
