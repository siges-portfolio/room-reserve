import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance()

export function phoneValidator(
  phoneNumberField = 'phoneNumber',
  phoneCountryCodeField = 'phoneCountryCode',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value,
      phoneNumber = value[phoneNumberField],
      countryCode = value[phoneCountryCodeField],
      phoneNumberControl = control.get(phoneNumberField);

    if (phoneNumber.length <= 1 && phoneNumber.length !== 0) {
      phoneNumberControl?.setErrors({ phone: true });
      return null;
    } else if (phoneNumber.length === 0) {
      return null;
    } else {
      const regionCode = phoneUtil.getRegionCodeForCountryCode(countryCode);

      const number = phoneUtil.parse(phoneNumber, regionCode);
      const isValidNumber = phoneUtil.isValidNumber(number);

      if (!isValidNumber) phoneNumberControl?.setErrors({ phone: true });
    }

    return null;
  };
}
