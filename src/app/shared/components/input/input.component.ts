import { Directive, ElementRef, inject, input, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';

@Directive({
  standalone: true,
  selector: 'input[rs-input], textarea[rs-input]',
  host: {
    class: 'rs-input',
    '[disabled]': 'disabled()',
    '[attr.type]': 'type()'
  },
  providers: [{ provide: FormFieldControl, useExisting: InputComponent }]
})
export class InputComponent implements FormFieldControl<string> {
  ngControl = inject(NgControl);
  elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef)

  value = signal<string>('');
  disabled = input<boolean>(false);
  type = input<string>('text');
}
