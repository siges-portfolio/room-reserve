import { Component, computed, forwardRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { OptionComponent } from '@shared/components/option/option.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { USER_REGION } from '@shared/tokens/user-region.token';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'region-select',
  templateUrl: './region-select.component.html',
  styleUrls: ['./region-select.component.scss'],
  imports: [FormsModule, OptionComponent, ReactiveFormsModule, SelectComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RegionSelectComponent),
      multi: true,
    },
  ],
})
export class RegionSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

  defaultRegionCode = inject(USER_REGION);
  defaultCountryCode = this.phoneUtil.getCountryCodeForRegion(this.defaultRegionCode);
  destroy$: Subject<void> = new Subject();

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  control = new FormControl(this.defaultCountryCode, { nonNullable: true });

  value = signal<number>(this.defaultCountryCode);
  disabled = signal<boolean>(false);
  supportedRegions = signal<{ countryCode: number; regionCode: string, label: string }[]>([]);
  regionCode = computed(() => {
    return this.phoneUtil.getRegionCodeForCountryCode(this.value());
  });

  ngOnInit() {
    this.supportedRegions.set(this.getSupportedRegions());

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.onChange(value);
      this.value.set(value);
    });
  }

  getSupportedRegions() {
    return this.phoneUtil.getSupportedRegions().map((regionCode) => {
      const countryCode = this.phoneUtil.getCountryCodeForRegion(regionCode);
      return { countryCode, regionCode, label: `${this.getCountryName(regionCode)} +${countryCode}` };
    });
  }

  getCountryName(regionCode: string): string {
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    return names.of(regionCode) || regionCode;
  }

  writeValue(value: number): void {
    if (!value) return;

    this.control.setValue(value);
    this.value.set(value);
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
