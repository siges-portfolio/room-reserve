import { Component, ElementRef, forwardRef, Input, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'rs-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  imports: [MatIconModule, NgClass],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor {
  inputElement = viewChild<ElementRef<HTMLInputElement>>('input');

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  value: boolean | null = false;

  _checked: boolean = false;
  @Input()
  set checked(value: boolean) {
    this._checked = value;
  }

  get checked() {
    return this._checked;
  }

  _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
  }

  get disabled() {
    return this._disabled;
  }

  handleChangeEvent() {
    this.checked = !this.checked;

    const inputElement = this.inputElement()
    if (inputElement) inputElement.nativeElement.checked = this.checked;

    this.onChange(this.checked);
  }

  writeValue(value: any): void {
    this._checked = !!value;
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
