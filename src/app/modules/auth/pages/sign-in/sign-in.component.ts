import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import {
  DEFAULT_PASSWORD_VALIDATIONS,
  emailValidator,
} from '@core/validators/auth.validator';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ToastService } from '@shared/components/toast/toast.service';
import { AuthorizationService } from '@core/services/authorization';
import { Subject, take, takeUntil } from 'rxjs';
import { SupabaseService } from '@core/services/supabase';

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
    CheckboxComponent,
    TranslocoDirective,
  ],
})
export class SignInComponent implements OnDestroy {
  authService = inject(AuthorizationService);
  translocoService = inject(TranslocoService);
  router = inject(Router);
  toasts = inject(ToastService);

  destroy$: Subject<void> = new Subject();

  loading = signal<boolean>(false);

  form: FormGroup = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, emailValidator()] }),
    password: new FormControl('', {
      validators: [Validators.required, ...DEFAULT_PASSWORD_VALIDATIONS],
    }),
    remember: new FormControl(false),
  });

  submit() {
    this.loading.set(true);
    const { email, password } = this.form.value;

    if (this.authService.authState$)
      this.authService
        .signIn(email, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            void this.router.navigate(['/dashboard']);
            this.loading.set(false);
          },
          error: (error) => {
            switch (error.code) {
              case 'invalid_credentials':
                this.toasts.showToast(
                  'error',
                  this.translocoService.translate('authorization.errors.invalid-credentials'),
                  'error',
                );
                break;
              default:
                this.toasts.showToast(
                  'error',
                  this.translocoService.translate('authorization.errors.unexpected-error'),
                  'error',
                );
            }

            this.loading.set(false);
          },
        });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
