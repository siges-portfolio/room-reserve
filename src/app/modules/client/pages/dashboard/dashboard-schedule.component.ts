import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'dashboard-schedule',
  templateUrl: './dashboard-schedule.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./dashboard-schedule.component.scss'],
})
export class DashboardScheduleComponent {}
