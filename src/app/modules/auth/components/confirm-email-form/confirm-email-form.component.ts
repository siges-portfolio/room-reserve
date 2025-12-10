import { Component, input, OnDestroy, OnInit, output, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { CodeComponent } from '@shared/components/code/code.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

const RESEND_TIMER_DURATION = 60;

@Component({
  standalone: true,
  selector: 'confirm-email-form',
  templateUrl: './confirm-email-form.component.html',
  styleUrls: ['./confirm-email-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'auth-content__content'
  },
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    CodeComponent,
    FormFieldComponent,
    TranslocoDirective
  ]
})
export class ConfirmEmailFormComponent implements OnInit, OnDestroy {
  submit = output<boolean>();

  destroy$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  type = input<'reset' | 'sign-up'>('sign-up')
  loading = input<boolean>(false);
  resendActive = signal<boolean>(false);
  timer = signal<number>(RESEND_TIMER_DURATION);

  codeControl = new FormControl('', { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)] });

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.timer.set(RESEND_TIMER_DURATION);
    this.resendActive.set(false)

    if (this.timerSubscription) this.timerSubscription.unsubscribe();
    this.timerSubscription = interval(1000).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        if (this.timer() === 1) {
          this.resendActive.set(true)
          return;
        }

        this.timer.set(this.timer() - 1);
      },
      complete: () => {
        this.timerSubscription.unsubscribe()
      }
    });
  }

  onSubmit() {
    this.submit.emit(true)
  }

  resendCode() {
    this.startTimer()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
