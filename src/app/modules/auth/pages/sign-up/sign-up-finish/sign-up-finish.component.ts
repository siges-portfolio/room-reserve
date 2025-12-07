import { Component } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  standalone: true,
  selector: 'sign-up-finish',
  templateUrl: './sign-up-finish.component.html',
  host: {
    class: 'sign-up__content'
  },
  imports: [
    ButtonComponent
  ]
})
export class SignUpFinishComponent {
}
