import { Component, inject, input, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthorizationService } from '@core/services/authorization';

const RESEND_TIMER_DURATION = 60;

@Component({
  standalone: true,
  selector: 'confirm-email-form',
  templateUrl: './confirm-email-form.component.html',
  styleUrls: ['./confirm-email-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'auth-content__content',
  },
  imports: [ReactiveFormsModule, ButtonComponent, TranslocoDirective],
})
export class ConfirmEmailFormComponent implements OnInit, OnDestroy {
  authService = inject(AuthorizationService);

  destroy$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  email = input.required<string>();
  type = input<'sign-up' | 'reset-password'>('sign-up');
  loading = input<boolean>(false);
  resendActive = signal<boolean>(false);
  resendLoading = signal<boolean>(false);
  timer = signal<number>(RESEND_TIMER_DURATION);

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.timer.set(RESEND_TIMER_DURATION);
    this.resendActive.set(false);

    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    this.timerSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.timer() === 1) {
            this.resendActive.set(true);
            return;
          }

          this.timer.set(this.timer() - 1);
        },
        complete: () => {
          this.timerSubscription.unsubscribe();
        },
      });
  }

  resendConfirmation() {
    this.resendLoading.set(true);

    const query =
      this.type() === 'sign-up'
        ? this.authService.resendConfirmation(this.email())
        : this.authService.resetPassword(this.email());

    query.subscribe({
      next: () => {
        this.startTimer();
        this.resendLoading.set(false);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
