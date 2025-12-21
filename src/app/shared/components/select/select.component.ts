import {
  AfterContentInit,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormFieldControl } from '@shared/components/form-field/form-field-control';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';
import {
  OPTION_PARENT_COMPONENT,
  OptionComponent,
} from '@shared/components/option/option.component';

const SELECT_POSITION_STRATEGY: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    panelClass: 'bottom-right',
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'top-right',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: 'bottom-left',
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'top-left',
  },
];

@Component({
  standalone: true,
  selector: 'rs-select',
  templateUrl: './select.component.html',
  imports: [ButtonComponent, MatIcon, NgClass, NgTemplateOutlet],
  providers: [
    { provide: FormFieldControl, useExisting: SelectComponent },
    { provide: OPTION_PARENT_COMPONENT, useExisting: SelectComponent },
  ],
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent
  implements FormFieldControl<any>, ControlValueAccessor, OnDestroy, AfterContentInit
{
  destroy$: Subject<void> = new Subject();
  ngControl = inject(NgControl, { self: true, optional: true })!;
  elementRef = inject(ElementRef);
  overlay = inject(Overlay);
  viewContainer = inject(ViewContainerRef);

  #overlayRef: OverlayRef | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  positionStrategy = SELECT_POSITION_STRATEGY;
  trigger = viewChild<ButtonComponent>('trigger');
  optionsTemplate = viewChild<TemplateRef<any>>('optionsTemplate');
  options = contentChildren(OptionComponent);

  label = input<string | TemplateRef<any> | null>(null);
  multiple = input<boolean>(false);
  value = signal<string | number>('');
  disabled = signal<boolean>(false);
  opened = signal<boolean>(false);
  selectedOption = signal<OptionComponent | null>(null);

  get stringLabel() {
    return typeof this.label() === 'string' && this.label();
  }

  get templateLabel() {
    return this.label() instanceof TemplateRef && this.label() as TemplateRef<any>;
  }

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngAfterContentInit() {
    this.setSelectedOptionLabel();
  }

  selectOption(value: string | number) {
    // TODO: muptiple select
    if (this.multiple()) {
      return;
    } else {
      this.value.set(value);
      this.onChange(value);
    }

    this.setSelectedOptionLabel();
    this.closeSelect();
  }

  setSelectedOptionLabel() {
    // TODO: muptiple select
    if (this.multiple()) return;

    const selectedOption = this.options().find((option) => option.value() === this.value());
    if (selectedOption) this.selectedOption.set(selectedOption);
  }

  openSelect(event: MouseEvent): void {
    if (!this.#overlayRef?.hasAttached()) this.attachSelect(event.target);
  }

  closeSelect() {
    if (this.#overlayRef && this.#overlayRef?.hasAttached()) {
      this.#overlayRef.detach();
      this.opened.set(false);
    }
  }

  attachSelect(target: EventTarget | null) {
    const triggerWidth = this.trigger()?.elementRef.nativeElement.getBoundingClientRect().width;
    const template = this.optionsTemplate();

    if (!template) return;

    const positionStrategy = this.getPositionStrategy();
    this.#overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'rs-select__options',
      minWidth: triggerWidth ?? '120px',
    });

    this.#overlayRef
      ?.outsidePointerEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (target && target !== event.target) this.closeSelect();
      });

    const templateRef = new TemplatePortal(template, this.viewContainer);
    this.#overlayRef.attach(templateRef);

    this.opened.set(true);
  }

  private getPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef.nativeElement)
      .withPositions(this.positionStrategy);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: any): void {
    this.setSelectedOptionLabel();
    this.value.set(value);
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
