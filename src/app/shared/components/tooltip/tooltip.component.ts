import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, InjectionToken, TemplateRef } from "@angular/core";

export type TooltipData = string | TemplateRef<void>;
export const TOOLTIP_DATA = new InjectionToken<TooltipData>('Data to display in tooltip');

@Component({
  standalone: true,
  selector: "app-tooltip",
  templateUrl: "./tooltip.component.html",
  styleUrls: ["./tooltip.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class TooltipContainerComponent {
  get string(): string | false {
    return typeof this.tooltipData === "string" ? this.tooltipData : false;
  }

  get template(): TemplateRef<void> | false {
    return this.tooltipData instanceof TemplateRef ? this.tooltipData : false;
  }

  constructor(@Inject(TOOLTIP_DATA) public tooltipData: TooltipData) {}
}
