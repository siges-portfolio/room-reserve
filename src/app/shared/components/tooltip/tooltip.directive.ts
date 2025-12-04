import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener, inject,
  Injector, input, OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  TOOLTIP_DATA,
  TooltipContainerComponent,
} from './tooltip.component';
import { fromEvent } from 'rxjs';

const DEFAULT_TOOLTIP_POSITION_STRATEGY: ConnectedPosition[] = [
  {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    panelClass: 'top',
  },
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'bottom',
  },
]

@Directive({
  standalone: true,
  selector: '[tooltip]',
})
export class TooltipDirective implements OnInit {
  element = inject<ElementRef<HTMLElement>>(ElementRef);
  overlay = inject(Overlay);
  viewContainer = inject(ViewContainerRef);

  #overlayRef: OverlayRef | null = null;

  tooltip = input<string | TemplateRef<void> | null>();
  tooltipIsFixed = input<boolean>(false);
  tooltipPositionStrategy = input<ConnectedPosition[]>(DEFAULT_TOOLTIP_POSITION_STRATEGY);

  @HostListener('mouseenter')
  showTooltip(): void {
    if (this.#overlayRef?.hasAttached() === true || this.tooltipIsFixed() || !this.tooltip()) {
      return;
    }

    this.attachTooltip();
  }

  @HostListener('mouseleave', ['$event.target'])
  hideTooltip(target: any): void {
    if (
      this.#overlayRef &&
      !this.#overlayRef.overlayElement.contains(target) &&
      this.#overlayRef?.hasAttached() === true &&
      !this.tooltipIsFixed()
    ) {
      this.#overlayRef.detach();
    }
  }

  ngOnInit() {
    if (this.tooltipIsFixed()) this.showTooltip();
  }

  private attachTooltip(): void {
    if (this.#overlayRef === null) {
      const positionStrategy = this.getPositionStrategy();
      this.#overlayRef = this.overlay.create({
        positionStrategy,
        panelClass: 'tooltip-overlay',
      });
    }

    const injector = Injector.create({
      providers: [
        {
          provide: TOOLTIP_DATA,
          useValue: this.tooltip(),
        },
      ],
    });
    const component = new ComponentPortal(
      TooltipContainerComponent,
      this.viewContainer,
      injector
    );
    this.#overlayRef.attach(component);

    if (this.tooltipIsFixed()) return;
    fromEvent<any>(this.#overlayRef.hostElement, 'mouseleave').subscribe(
      () => this.#overlayRef?.detach()
    );
  }

  private getPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions(this.tooltipPositionStrategy());
  }
}
