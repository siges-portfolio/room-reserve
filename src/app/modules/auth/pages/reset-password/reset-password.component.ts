import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '@shared/components/toast/toast.service';
import { EmailFormComponent } from '@modules/auth/pages/reset-password/email-form/email-form.component';
import { PasswordFormComponent } from '@modules/auth/pages/reset-password/password-form/password-form.component';
import { ConfirmEmailFormComponent } from '@modules/auth/components/confirm-email-form/confirm-email-form.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthorizationService } from '@core/services/authorization';
import { Subject, takeUntil } from 'rxjs';

export enum ResetPasswordSteps {
  EMAIL = 'email',
  CONFIRM_EMAIL = 'confirm',
  PASSWORD = 'password',
  FINISH = 'finish',
}

@Component({
  standalone: true,
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    EmailFormComponent,
    ConfirmEmailFormComponent,
    PasswordFormComponent,
    ButtonComponent,
    TranslocoDirective,
  ],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  authService = inject(AuthorizationService);
  toastService = inject(ToastService);
  steps = ResetPasswordSteps;

  destroy$: Subject<void> = new Subject();

  loading = signal<boolean>(false);
  email = signal<string>('');
  currentStep = signal<ResetPasswordSteps>(this.steps.EMAIL);

  session: { accessToken: string; refreshToken: string };

  async ngOnInit() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      this.session = { accessToken, refreshToken };

      this.currentStep.set(ResetPasswordSteps.PASSWORD);
    }
  }

  changeStep(event: any, step: ResetPasswordSteps) {
    if (step === ResetPasswordSteps.CONFIRM_EMAIL) {
      this.email.set(event);
      this.authService.resetPassword(this.email()).pipe(takeUntil(this.destroy$)).subscribe();
    }

    this.currentStep.set(step);
  }

  onFinish(password: string) {
    this.loading.set(true);

    this.authService
      .updatePassword(password, this.session)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.currentStep.set(this.steps.FINISH);
          this.toastService.showToast('success', 'Password changed successfully', 'check');
          this.loading.set(false);
        },
        error: (error) => {
          switch (error.code) {
            case 'same_password':
              this.toastService.showToast(
                'error',
                'The new password must be different from the previous one',
                'close',
              );
              break;
            default:
              this.toastService.showToast('error', 'Unexpected error', 'check');
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
