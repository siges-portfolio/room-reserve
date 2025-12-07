import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChildren
} from '@angular/core';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type CodeInputItem = { key: number; value: string };

@Component({
  standalone: true,
  selector: 'code-input',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  providers: [
    {
      provide: FormFieldControl,
      useExisting: CodeComponent
    }
  ]
})
export class CodeComponent implements ControlValueAccessor, FormFieldControl<string> {
  ngControl = inject(NgControl, { self: true, optional: true })!;
  elementRef = inject(ElementRef);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  inputs = viewChildren('itemInput');

  value = signal<string>('');
  count = signal<number>(6);
  disabled = signal<boolean>(false);
  items = computed<CodeInputItem[]>(() => {
    return this.count() ? this.getItemsArray() : [];
  });

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  getItemsArray(): CodeInputItem[] {
    return Array.from({ length: this.count() }, (_, index) => {
      return { key: index, value: '' };
    });
  }

  getItem(index: number): CodeInputItem {
    return this.items()[index];
  }

  getValue() {
    return this.items().reduce((acc, item) => {
      acc += item.value;
      return acc;
    }, '');
  }

  updateValue() {
    this.value.set(this.getValue());
    this.onChange(this.getValue());
  }

  async onPaste(event: ClipboardEvent | null = null) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        for(let i = 0; i <= this.items().length; i++) {
          const item = this.getItem(i);
          const char = text.charAt(i)

          if (item && this.isAllowedSymbol(char)) item.value = char;
        }
      }

      this.focusInput(this.items().length - 1);
      this.updateValue();
    } catch (error) {
      console.error('[Code input]: ', error);
    }
  }

  async onKeydown(e: KeyboardEvent, itemIndex: number) {
    const item = this.items()[itemIndex];

    if (e.ctrlKey && e.key === 'v') await this.onPaste();

    switch (e.code) {
      case 'Backspace':
        e.preventDefault();
        item.value = '';
        this.focusInput(itemIndex - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.focusInput(itemIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.focusInput(itemIndex + 1);
        break;
      case 'Tab':
        break;
      default:
        e.preventDefault();
        if (this.isAllowedSymbol(e.key)) {
          item.value = e.key;
          this.focusInput(itemIndex + 1);
        }
    }

    this.updateValue()
  }

  onBlur() {
    this.onTouched()
  }

  focusInput(index: number) {
    if (index === -1) return

    const input = this.inputs().at(index) as ElementRef;
    if (input) input.nativeElement.focus();
  }

  isAllowedSymbol(key: string) {
    return /^[A-Za-z0-9]$/.test(key);
  }

  writeValue(value: any): void {
    this.value.set(value);

    for (let i = 0; i < this.items().length; i++) {
      const char = value.charAt(i);
      this.items()[i].value = this.isAllowedSymbol(char) ? char : '';
    }
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
}
