import { Component, inject, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastService } from '@shared/components/toast/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CompanyFormComponent } from '@modules/auth/pages/sign-up/company-form/company-form.component';
import { UserFormComponent } from '@modules/auth/pages/sign-up/user-form/user-form.component';
import { ConfirmEmailFormComponent } from '@modules/auth/components/confirm-email-form/confirm-email-form.component';
import { TranslocoDirective } from '@jsverse/transloco';

enum SignUpSteps {
  USER = 'USER',
  COMPANY = 'COMPANY',
  CONFIRM_EMAIL = 'CONFIRM EMAIL',
  FINISH = 'FINISH',
}

export type SignUpFormData = Record<string, { [key: string]: any }>;

@Component({
  standalone: true,
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink,
    CompanyFormComponent,
    UserFormComponent,
    ConfirmEmailFormComponent,
    ButtonComponent,
    TranslocoDirective,
  ]
})
export class SignUpComponent implements OnDestroy {
  toastService = inject(ToastService);

  destroy$: Subject<void> = new Subject<void>();
  steps = SignUpSteps;

  data = signal<SignUpFormData>({});
  loading = signal<boolean>(false);
  currentStep = signal<SignUpSteps>(SignUpSteps.USER);

  async changeStep(step: SignUpSteps, formData: SignUpFormData) {
    switch (step) {
      case SignUpSteps.COMPANY:
      case SignUpSteps.USER:
      case SignUpSteps.CONFIRM_EMAIL:
        this.data.update((lastValue) => {
          return { ...lastValue, ...formData };
        });

        this.currentStep.set(step);
        break;
    }
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
      this.toastService.showToast('success', 'Account created successfully', 'check')
      console.log(this.data())
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
