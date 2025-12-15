import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CompanyFormComponent } from '@modules/auth/pages/sign-up/company-form/company-form.component';
import { UserFormComponent } from '@modules/auth/pages/sign-up/user-form/user-form.component';
import { ConfirmEmailFormComponent } from '@modules/auth/components/confirm-email-form/confirm-email-form.component';
import { TranslocoDirective } from '@jsverse/transloco'
import { AuthorizationService } from '@core/services/authorization';
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
  ],
})
export class SignUpComponent implements OnInit, OnDestroy {
  authService = inject(AuthorizationService);
  router = inject(Router);

  destroy$: Subject<void> = new Subject<void>();

  steps = SignUpSteps;

  data = signal<SignUpFormData>({});
  loading = signal<boolean>(false);
  currentStep = signal<SignUpSteps>(SignUpSteps.USER);
  email = computed(() => {
    return this.data()['user']['email'];
  });

  ngOnInit() {
    const hash = window.location.hash;
    if (hash) this.currentStep.set(SignUpSteps.FINISH);
  }

  async changeStep(step: SignUpSteps, formData?: SignUpFormData) {
    if (formData)
      this.data.update((lastValue) => {
        return { ...lastValue, ...formData };
      });

    switch (step) {
      case SignUpSteps.USER:
      case SignUpSteps.COMPANY:
      case SignUpSteps.FINISH:
        this.currentStep.set(step);
        break;
      case SignUpSteps.CONFIRM_EMAIL:
        this.onSubmit();
    }
  }

  onSubmit() {
    this.loading.set(true);

    const { user, company } = this.data();

    // TODO: company create implementation

    this.authService
      .signUp(user['email'], user['password'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.currentStep.set(SignUpSteps.CONFIRM_EMAIL);
        },
        error: (error) => {
          console.error(error);
          // TODO: error toasts
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
