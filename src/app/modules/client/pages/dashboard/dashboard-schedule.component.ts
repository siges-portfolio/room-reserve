import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneInputComponent } from '@shared/components/phone-input/phone-input.component';

@Component({
  standalone: true,
  selector: 'dashboard-schedule',
  templateUrl: './dashboard-schedule.component.html',
  imports: [
    ReactiveFormsModule,
    PhoneInputComponent,
  ],
  styleUrls: ['./dashboard-schedule.component.scss'],
})
export class DashboardScheduleComponent {}
