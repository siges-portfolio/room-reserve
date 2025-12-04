import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  imports: [RouterOutlet, MatIcon],
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
}
