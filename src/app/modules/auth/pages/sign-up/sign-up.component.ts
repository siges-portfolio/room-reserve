import { Component, OnDestroy, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { CompanyFormComponent } from '@modules/auth/pages/sign-up/company-form/company-form.component';
import { UserFormComponent } from '@modules/auth/pages/sign-up/user-form/user-form.component';
import { ConfirmEmailFormComponent } from '@modules/auth/pages/sign-up/confirm-email-form/confirm-email-form.component';
import { SignUpFinishComponent } from '@modules/auth/pages/sign-up/sign-up-finish/sign-up-finish.component';

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
    SignUpFinishComponent
  ]
})
export class SignUpComponent implements OnDestroy {
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

  async onFinish(event: boolean) {
    this.loading.set(true);

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 2000)
      })

      this.currentStep.set(this.steps.FINISH);
      console.log(this.data())
    } catch (error) {
      console.log(error);
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
