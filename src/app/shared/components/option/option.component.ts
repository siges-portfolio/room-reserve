import {
  Component,
  effect, ElementRef,
  HostListener,
  inject,
  InjectionToken,
  Input,
  input,
  OnInit,
  Signal,
  signal, ViewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

interface OptionParentComponent {
  multiple: Signal<boolean>,
  value: Signal<string | string[]>,
  selectOption: (value: string) => {}
}

export const OPTION_PARENT_COMPONENT = new InjectionToken<OptionParentComponent>('OPTION_PARENT_COMPONENT');

@Component({
  standalone: true,
  selector: 'rs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  imports: [
    NgClass,
    MatIcon
  ]
})
export class OptionComponent implements OnInit {
  parent = inject(OPTION_PARENT_COMPONENT)

  value = input<string>('');
  multiple = signal(false);

  _label: string;
  @ViewChild('label')
  set label(value: ElementRef<HTMLElement>) {
    this._label = value.nativeElement.textContent;
  }

  get label(): string {
    return this._label;
  }

  _selected: boolean = false;
  @Input()
  set selected(value: boolean) {
    this._selected = value
  }

  get selected() {
    return this._selected;
  }

  @HostListener('click')
  selectedOption() {
    this.parent.selectOption(this.value())
  }

  constructor() {
    effect(() => {
      const value = this.parent.value();
      this._selected = Array.isArray(value)
        ? value.includes(this.value())
        : value === this.value();
    });
  }

  ngOnInit() {
    this.multiple.set(this.parent.multiple())
    if (this.selected) this.selectedOption();
  }
}
