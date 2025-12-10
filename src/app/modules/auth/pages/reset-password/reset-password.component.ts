import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '@shared/components/toast/toast.service';
import { EmailFormComponent } from '@modules/auth/pages/reset-password/email-form/email-form.component';
import { PasswordFormComponent } from '@modules/auth/pages/reset-password/password-form/password-form.component';
import { ConfirmEmailFormComponent } from '@modules/auth/components/confirm-email-form/confirm-email-form.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TranslocoDirective } from '@jsverse/transloco';

export enum ResetPasswordSteps {
  EMAIL = 'email',
  CONFIRM = 'confirm',
  PASSWORD = 'password',
  FINISH = 'finish'
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
    TranslocoDirective
  ]
})
export class ResetPasswordComponent {
  toastService = inject(ToastService);
  steps = ResetPasswordSteps;

  loading = signal<boolean>(false);
  email = signal<string | null>(null);
  currentStep = signal<ResetPasswordSteps>(this.steps.EMAIL);

  changeStep(event: any, step: ResetPasswordSteps) {
    if (step == ResetPasswordSteps.CONFIRM) this.email.set(event);
    this.currentStep.set(step);
  }

  // TODO: remove test promise
  async onFinish() {
    this.loading.set(true);

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 2000)
      })

      this.currentStep.set(this.steps.FINISH);
      this.toastService.showToast('success', 'Password changed successfully', 'check')
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }
}
