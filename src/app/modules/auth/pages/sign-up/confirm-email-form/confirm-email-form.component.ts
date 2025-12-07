import { Component, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { CodeComponent } from '@shared/components/code/code.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'confirm-email-form',
  templateUrl: './confirm-email-form.component.html',
  host: {
    class: 'sign-up__content'
  },
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    CodeComponent,
    FormFieldComponent
  ]
})
export class ConfirmEmailFormComponent implements OnInit, OnDestroy {
  submit = output<boolean>();

  destroy$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  resendActive = signal<boolean>(false);
  timer = signal<number>(60);
  loading = input<boolean>(false);

  codeControl = new FormControl('', { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)] });

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
