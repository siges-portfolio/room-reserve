import { Component, forwardRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { OptionComponent } from '@shared/components/option/option.component';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { USER_REGION } from '@shared/tokens/user-region.token';

@Component({
  standalone: true,
  selector: 'phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  imports: [
    FormFieldComponent,
    SelectComponent,
    OptionComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  defaultRegion = inject(USER_REGION);

  destroy$: Subject<void> = new Subject();
  phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  form = new FormGroup({
    phoneNumber: new FormControl('', { nonNullable: true }),
    regionCode: new FormControl(this.defaultRegion, { nonNullable: true }),
  });

  value = signal<string>('');
  disabled = signal<boolean>(false);
  placeholder = signal<string>('');
  countryCode = signal<string | null>(null);
  supportedRegions = signal<{ label: string; key: string }[]>([]);

  get phoneControl() {
    return this.form.get('phoneNumber');
  }

  get regionCode() {
    return this.form.get('regionCode')?.value;
  }

  ngOnInit() {
    this.supportedRegions.set(this.getSupportedRegions());

    const initialFormValue = this.form.value;
    this.transformPhoneData(initialFormValue.phoneNumber, initialFormValue.regionCode);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.transformPhoneData(value.phoneNumber, value.regionCode));
  }

  transformPhoneData(phoneNumber: string = '', regionCode?: string) {
    if (!regionCode || !this.phoneControl) return;

    phoneNumber = phoneNumber.replace(/[^0-9]*/g, '');

    const exampleNumber = this.phoneUtil.getExampleNumber(regionCode),
      exampleNumberNational = exampleNumber.getNationalNumberOrDefault(),
      exampleNumberFormatted = this.phoneUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL),
      countryCode = this.phoneUtil.getCountryCodeForRegion(regionCode).toString();

    this.countryCode.set(countryCode);
    this.placeholder.set(exampleNumberFormatted);

    if (phoneNumber.length <= 1) return;

    const number = this.phoneUtil.parse(phoneNumber, regionCode),
      numberNational = number.getNationalNumberOrDefault(),
      numberFormatted = this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL);

    if (numberNational.toString().length <= exampleNumberNational.toString().length) {
      this.phoneControl.setValue(numberFormatted, { emitEvent: false });
      this.value.set(numberFormatted);
    } else {
      this.phoneControl.setValue(this.value(), { emitEvent: false });
    }

    const value = this.phoneUtil.parseAndKeepRawInput(this.value(), regionCode);

    if (numberNational)
      this.onChange(`+${this.countryCode()}${value.getNationalNumberOrDefault()}`);
  }

  getSupportedRegions() {
    return this.phoneUtil.getSupportedRegions().map((region) => {
      const phoneNumberPrefix = this.phoneUtil.getCountryCodeForRegion(region);
      return { label: `${this.getCountryName(region)} +${phoneNumberPrefix}`, key: region };
    });
  }

  getCountryName(regionCode: string): string {
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    return names.of(regionCode) || regionCode;
  }

  writeValue(value: string): void {
    if (!value) return;

    const number = this.phoneUtil.parse(value),
      formattedNumber = this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL),
      regionCode = this.phoneUtil.getRegionCodeForNumber(number);

    this.form.patchValue({
      regionCode,
      phoneNumber: number.getNationalNumberOrDefault().toString(),
    });
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
