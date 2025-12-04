import { Directive, ElementRef, inject, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';

@Directive({
  standalone: true,
  selector: 'input[rs-input], textarea[rs-input]',
  host: {
    class: 'rs-input',
    '[disabled]': 'disabled'
  },
  providers: [{ provide: FormFieldControl, useExisting: InputComponent }]
})
export class InputComponent implements FormFieldControl<string> {
  ngControl = inject(NgControl);
  elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef)

  value: string = '';

  _type: string;
  @Input()
  set type(value: string) {
    this._type = value || 'text';

    (this.elementRef.nativeElement as HTMLInputElement).type = this._type;
  }

  get type() {
    return this._type;
  }

  _disabled: boolean;
  @Input()
  set disabled(value: boolean) {
    this._disabled = value
  }

  get disabled() {
    return this._disabled;
  }
}
