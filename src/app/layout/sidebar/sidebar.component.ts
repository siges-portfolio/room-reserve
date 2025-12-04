import { Component, Input } from '@angular/core';
import { SidebarNavigation } from '@core/models/navigation';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '@shared/components/button/button.component';


@Component({
  standalone: true,
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    ButtonComponent
  ],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() navigation: SidebarNavigation;
}
