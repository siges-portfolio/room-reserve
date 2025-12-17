import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'section-header',
  templateUrl: './section-header.component.html',
  imports: [ButtonComponent, MatIcon],
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent {
  // TODO: Back button event
}
