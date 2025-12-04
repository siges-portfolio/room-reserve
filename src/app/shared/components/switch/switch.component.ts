import { Component, ElementRef, forwardRef, Input, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

export type SwitchValues = Record<string, string>

@Component({
  standalone: true,
  selector: 'rs-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  imports: [MatIconModule, NgClass],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
  }]
})
export class SwitchComponent implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  value: string | null;
  activeIndex: number = 0;

  _values: { key: string, value: string }[] | null = null;
  @Input()
  set values(value: SwitchValues) {
    if (!value) return;

    this._values = Object.entries(value).map(([key, value]) => {
      return { key, value }
    });
  }

  get values(): { key: string, value: string }[] | null {
    return this._values;
  }

  _name: string = '';
  @Input()
  set name(value: string) {
    this._name = value;
  }

  get name() {
    return this._name;
  }

  _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled() {
    return this._disabled;
  }

  handleChangeEvent(itemKey: string) {
    this.onChange(itemKey);
    this.value = itemKey;
    this.setActiveIndex();
  }

  setActiveIndex() {
    if (!this.values || !this.value) this.activeIndex = 0;

    const itemIndex = this.values?.findIndex(item => item.key === this.value);
    this.activeIndex = itemIndex ? (itemIndex === -1 ? 0 : itemIndex) : 0;
  }

  writeValue(value: string): void {
    this.value = value;
    this.setActiveIndex();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
