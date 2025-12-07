import { Directive, ElementRef, Signal } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ standalone: true })
export abstract class FormFieldControl<T> {
  elementRef: ElementRef<any>;
  ngControl?: NgControl | null;

  value: Signal<T | null>;
  disabled: Signal<boolean>;
}
