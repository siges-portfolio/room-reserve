import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreLayoutComponent } from '../core-layout/core-layout.component';
import { SidebarComponent } from '@layout/sidebar/sidebar.component';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';

@Component({
  standalone: true,
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  imports: [RouterOutlet, SidebarComponent, ToastContainerComponent],
  styleUrls: ['./base-layout.component.scss'],
})
export class BaseLayoutComponent extends CoreLayoutComponent {}
