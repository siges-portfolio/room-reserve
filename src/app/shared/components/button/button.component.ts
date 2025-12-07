import { Component, ElementRef, inject, input, OnInit, ViewEncapsulation } from '@angular/core';

type RSButtonColor = 'primary' | 'warning' | 'light' | 'gray' | 'dark';
type RSButtonSize = 'sm' | 'md' | 'lg' | 'xs';

@Component({
  standalone: true,
  selector: 'a[rs-button], a[rs-button-filled], a[rs-button-outlined], a[rs-button-icon], button[rs-button], button[rs-button-filled], button[rs-button-outlined], button[rs-button-icon]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'rs-button',
    '[class.loading]': 'loading()'
  }
})
export class ButtonComponent implements OnInit {
  elementRef: ElementRef = inject(ElementRef);

  color = input<RSButtonColor>('primary');
  size = input<RSButtonSize>('md');
  loading = input<boolean>(false);

  ngOnInit() {
    const element = this.elementRef.nativeElement;

    element.classList.add(
      ...this.getButtonClass(element),
      this.color() ? `rs-button--${this.color()}` : 'rs-button--primary',
      this.size() ? `rs-button--${this.size()}` : 'rs-button--md'
    );
  }

  getButtonClass(button: HTMLButtonElement | HTMLLinkElement): string[] {
    let buttonClass: string[] = [];

    if (button.hasAttribute('rs-button-icon')) {
      buttonClass.push('icon');
    }

    if (button.hasAttribute('rs-button')) {
      buttonClass.push('flat');
    }

    if (button.hasAttribute('rs-button-filled')) {
      buttonClass.push('filled');
    }

    if (button.hasAttribute('rs-button-outlined')) {
      buttonClass.push('outlined');
    }

    return buttonClass;
  }
}
