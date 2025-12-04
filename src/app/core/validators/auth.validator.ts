import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;

export enum AuthValidatorMessages {
  required = 'This field is required.',
  minlength = 'Minimum length is <mark>{{ message.value.requiredLength }}</mark> characters, current length: <mark class="actual">{{ message.value.actualLength }}.</mark>',
  maxlength = 'Maximum length is <mark>{{ message.value.requiredLength }}</mark> characters, current length: <mark class="actual">{{ message.value.actualLength }}</mark>.',
  validEmail = 'Email address is invalid.',
  passwordLowercase = 'Password must contain at least one <mark>lowercase</mark> letter.',
  passwordUppercase = 'Password must contain at least one <mark>uppercase</mark> letter.',
  passwordDigit = 'Password must contain at least one <mark>digit</mark>.',
  passwordSymbol = 'Password must contain at least one <mark>special symbol</mark>.',
  passwordMatch = 'Passwords do not match.',
}

export const DEFAULT_PASSWORD_VALIDATIONS = [
  Validators.required,
  Validators.minLength(8),
  Validators.maxLength(32)
];

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return EMAIL_REGEXP.test(control.value) ? null : { validEmail: true };
  };
}

export function lowercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /[a-z]/.test(control.value) ? null : { passwordLowercase: true };
  };
}

export function uppercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /[A-Z]/.test(control.value) ? null : { passwordUppercase: true };
  };
}

export function digit(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /[0-9]/.test(control.value) ? null : { passwordDigit: true };
  };
}

export function symbol(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return /[!#$%&@'*+/=?^_`{|}~-]/.test(control.value) ? null : { passwordSymbol: true };
  };
}

export function confirmPasswordValidation(
  passwordField = 'password',
  confirmPasswordField = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const confirmPassword = control.get(confirmPasswordField);

    if (value[passwordField] !== value[confirmPasswordField]) {
      confirmPassword?.setErrors({ passwordMatch: true });
    }

    return null;
  };
}
