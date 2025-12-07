import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  imports: [RouterOutlet, MatIcon, ToastContainerComponent],
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
}
