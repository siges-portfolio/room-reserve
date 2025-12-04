import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-schedule.component').then((m) => m.DashboardScheduleComponent),
  },
  {
    path: 'booking',
    children: [
      {
        path: 'items',
        loadComponent: () => import('./pages/booking-list/booking-list.component').then((m) => m.BookingListComponent),
      },
      {
        path: 'item/:id',
        loadComponent: () => import('./pages/booking-item/booking-item.component').then((m) => m.BookingItemComponent),
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: []
})
export class ClientModule { }
