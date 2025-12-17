import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '@shared/components/button/button.component';
import { AuthorizationService } from '@core/services/authorization';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { InputComponent } from '@shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  standalone: true,
  selector: 'profile',
  templateUrl: './profile.component.html',
  imports: [
    TranslocoDirective,
    SectionHeaderComponent,
    MatIcon,
    ButtonComponent,
    DatePipe,
    FormFieldComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  authService = inject(AuthorizationService);
  toastService = inject(ToastService)
  destroy$: Subject<void> = new Subject<void>;

  userState$ = toSignal(this.authService.authState$);

  loading = signal<boolean>(false);
  user = computed(() => this.userState$()?.user);
  userDisplayName = computed(() => {
    const userMetadata = this.user()?.user_metadata.data;

    if (userMetadata && (userMetadata['firstName'].length || userMetadata['lastName'].length)) {
      return `${userMetadata['firstName']} ${userMetadata['lastName']}`;
    } else {
      return 'Anonymous';
    }
  });

  constructor() {
    effect(() => {
      const user = this.userState$()?.user;
      if (!user) return;

      this.form.patchValue({
        ...user.user_metadata.data,
        phone: this.userState$()?.user?.phone,
      });
    });
  }

  form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(32)],
    }),
    lastName: new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(32)],
    }),
    phone: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    birthDate: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    about: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
  });

  saveChanges() {
    const data = this.form.value;
    this.loading.set(true);

    this.authService
      .updateUser({ data: { phone: data.phone, data } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastService.showToast('success', 'Profile updated successfully.', 'check');
        },
        error: (error) => {
          this.toastService.showToast('error', 'Unexpected error.', 'close');
          console.error(error);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
