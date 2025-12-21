import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberFormat, PhoneNumberType, PhoneNumberUtil } from 'google-libphonenumber';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'phone-input',
  templateUrl: './phone-input.component.html',
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: FormFieldControl,
      useExisting: PhoneInputComponent,
    },
  ],
})
export class PhoneInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor, FormFieldControl<string>
{
  ngControl = inject(NgControl, { self: true, optional: true })!;
  elementRef = inject(ElementRef);

  destroy$: Subject<void> = new Subject();
  phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  control = new FormControl('', { nonNullable: true });

  countryCode = input<number | null>(null);
  value = signal<string>('');
  disabled = signal<boolean>(false);
  placeholder = signal<string>('');

  constructor() {
    effect(() => {
      if (this.countryCode()) this.transformPhoneData(this.control.value, this.countryCode());
    });

    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.transformPhoneData(value, this.countryCode()));
  }

  transformPhoneData(phoneNumber: string, countryCode: number | null) {
    if (!countryCode) return;
    phoneNumber = phoneNumber.replace(/[^0-9]*/g, '');

    const regionCode = this.phoneUtil.getRegionCodeForCountryCode(countryCode),
      exampleNumber = this.phoneUtil.getExampleNumberForType(regionCode, PhoneNumberType.MOBILE),
      exampleNumberNational = exampleNumber.getNationalNumberOrDefault(),
      exampleNumberFormatted = this.phoneUtil.format(exampleNumber, PhoneNumberFormat.INTERNATIONAL);

    this.placeholder.set(exampleNumberFormatted.replace(`+${countryCode} `, ''));

    if (phoneNumber.length <= 1) {
      this.onChange('');
      return;
    }

    const number = this.phoneUtil.parse(phoneNumber, regionCode),
      numberNational = number.getNationalNumberOrDefault(),
      numberFormatted = this.phoneUtil
        .format(number, PhoneNumberFormat.INTERNATIONAL)
        .replace(`+${countryCode} `, '');

    if (numberNational.toString().length <= exampleNumberNational.toString().length) {
      this.control.setValue(numberFormatted, { emitEvent: false });
      this.value.set(numberFormatted);
    } else {
      this.control.setValue(this.value(), { emitEvent: false });
    }

    const value = this.phoneUtil.parseAndKeepRawInput(this.value(), regionCode);

    if (numberNational) this.onChange(`${value.getNationalNumberOrDefault()}`);
  }

  writeValue(value: string): void {
    if (!value) return;

    const number = this.phoneUtil.parse(value),
      formattedNumber = this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL);

    this.control.setValue(formattedNumber, { emitEvent: false });
    this.value.set(formattedNumber);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
