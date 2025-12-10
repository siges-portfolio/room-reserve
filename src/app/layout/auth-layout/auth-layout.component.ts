import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  imports: [RouterOutlet, MatIcon, ToastContainerComponent, TranslocoDirective],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
}
