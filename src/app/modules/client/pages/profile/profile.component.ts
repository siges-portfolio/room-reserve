import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
import { Router } from '@angular/router';
import { PhoneInputComponent } from '@shared/components/phone-input/phone-input.component';
import { RegionSelectComponent } from '@shared/components/region-select/region-select.component';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { USER_REGION } from '@shared/tokens/user-region.token';
import { phoneValidator } from '@core/validators/phone.validator';

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
    PhoneInputComponent,
    RegionSelectComponent,
  ],
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  authService = inject(AuthorizationService);
  toastService = inject(ToastService);
  router = inject(Router);
  defaultRegionCode = inject(USER_REGION);

  phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
  defaultCountryCode = this.phoneUtil.getCountryCodeForRegion(this.defaultRegionCode);

  destroy$: Subject<void> = new Subject<void>();

  userState$ = toSignal(this.authService.authState$);

  saveLoading = signal<boolean>(false);
  user = computed(() => this.userState$()?.user);
  userDisplayName = computed(() => {
    const userMetadata = this.user()?.user_metadata;

    if (userMetadata && (userMetadata['firstName'] || userMetadata['lastName'])) {
      return `${userMetadata['firstName']} ${userMetadata['lastName']}`;
    } else {
      return 'Anonymous';
    }
  });

  form = new FormGroup(
    {
      firstName: new FormControl('', {
        validators: [Validators.minLength(3), Validators.maxLength(32)],
      }),
      lastName: new FormControl('', {
        validators: [Validators.minLength(3), Validators.maxLength(32)],
      }),
      phoneCountryCode: new FormControl(this.defaultCountryCode, { nonNullable: true }),
      phoneNumber: new FormControl('', { nonNullable: true }),
      birthDate: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
      about: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    },
    { validators: [phoneValidator()] },
  );

  get phoneCountryCode() {
    return this.form.get('phoneCountryCode')?.value ?? this.defaultCountryCode;
  }

  ngOnInit() {
    const user = this.userState$()?.user?.user_metadata;
    if (!user) return;

    const phoneNumber = user['phone'],
      phoneCountryCode = user['phone']
        ? this.phoneUtil.parse(user['phone']).getCountryCodeOrDefault()
        : null;

    this.form.patchValue({
      ...user,
      phoneNumber,
      ...(phoneCountryCode ? { phoneCountryCode } : null),
    });
  }

  saveChanges() {
    this.saveLoading.set(true);

    const data = this.form.value;
    const phone = `+${data.phoneCountryCode}${data.phoneNumber}`;

    this.authService
      .updateUser({
        ...{ phone: data.phoneNumber ? phone : '' },
        ...{ firstName: data.firstName ?? '' },
        ...{ lastName: data.lastName ?? '' },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_) => {
          this.toastService.showToast('success', 'Profile updated successfully.', 'check');
        },
        error: (error) => {
          this.toastService.showToast('error', 'Unexpected error.', 'close');
          console.error(error);
        },
        complete: () => {
          this.saveLoading.set(false);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
