import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'overview',
    loadComponent: () => import('./pages/admin-overview/admin-overview.component').then(m => m.AdminOverviewComponent),
  },
  {
    path: 'rooms',
    loadComponent: () => import('./pages/admin-rooms/admin-rooms.component').then(m => m.AdminRoomsComponent),
  },
  {
    path: 'room/:id',
    loadComponent: () => import('./pages/admin-room/admin-room.component').then(m => m.AdminRoomComponent),
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./pages/admin-user/admin-user.component').then(m => m.AdminUserComponent),
  },
  { path: '**', redirectTo: 'overview' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: []
})
export class AdminModule { }
