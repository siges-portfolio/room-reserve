import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ standalone: true })
export abstract class FormFieldControl<T> {
  elementRef: ElementRef<any>;
  ngControl: NgControl | null;

  value: T | null;
  disabled: boolean;
}
