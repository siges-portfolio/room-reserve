import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'auth-type-switcher',
  templateUrl: './auth-type-switcher.component.html',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./auth-type-switcher.component.scss']
})
export class AuthTypeSwitcher {}
