import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance()

export function phoneValidator(region: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value.length) return null;

    const number = phoneUtil.parse(control.value, region);
    const isValidNumber = phoneUtil.isValidNumber(number);

    return isValidNumber ? null : { phone: true };
  }
}
