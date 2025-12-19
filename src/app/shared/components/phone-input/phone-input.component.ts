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
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
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
    NgOptimizedImage,
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
  regionCodeLabel = signal<string>('');
  supportedRegions = signal<{ label: string; key: string }[]>([]);

  ngOnInit() {
    this.supportedRegions.set(this.getSupportedRegions());

    const initialFormValue = this.form.value;
    this.transformPhoneData(initialFormValue.phoneNumber, initialFormValue.regionCode);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(50))
      .subscribe((value) => this.transformPhoneData(value.phoneNumber, value.regionCode));
  }

  get phoneControl() {
    return this.form.get('phoneNumber')
  }

  transformPhoneData(phoneNumber: string = '', regionCode?: string) {
    if (!regionCode || !this.phoneControl) return;

    const exampleNumber = this.phoneUtil.getExampleNumber(regionCode),
      exampleNumberLength = exampleNumber.getNationalNumber()?.toString().length,
      formattedExampleNumber = this.phoneUtil.format(exampleNumber, PhoneNumberFormat.NATIONAL),
      countryCode = this.phoneUtil.getCountryCodeForRegion(regionCode);

    this.regionCodeLabel.set(`${regionCode} +${countryCode}`);
    this.placeholder.set(formattedExampleNumber);

    if (phoneNumber.length <= 1) return;
    const number = this.phoneUtil.parse(phoneNumber, regionCode);
    const nationalNumber = number.getNationalNumber();
    const numberLength = number.getNationalNumber()?.toString().length;
    const formattedValue = this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL);

    if (numberLength! <= exampleNumberLength!) {
      this.phoneControl.setValue(formattedValue, { emitEvent: false });
      this.value.set(formattedValue);
    } else {
      this.phoneControl.setValue(this.value(), { emitEvent: false });
    }

    const value = this.phoneUtil.parseAndKeepRawInput(this.value(), regionCode);

    if (nationalNumber) this.onChange(`+${countryCode}${value.getNationalNumber()}`);
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
      regionCode = this.phoneUtil.getRegionCodeForNumber(number),
      formattedNumber = this.phoneUtil.format(number, PhoneNumberFormat.NATIONAL);

    this.form.patchValue({ regionCode, phoneNumber: number.getNationalNumber()?.toString() });
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
