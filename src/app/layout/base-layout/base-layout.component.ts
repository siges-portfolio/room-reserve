import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreLayoutComponent } from '../core-layout/core-layout.component';
import { SidebarComponent } from '@layout/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent extends CoreLayoutComponent {}
