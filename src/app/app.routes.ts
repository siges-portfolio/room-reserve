import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { AuthGuard } from '@core/guards/auth.guard';
import { GuestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'authorization',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('@layout/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@modules/auth/auth.module').then((m) => m.AuthModule),
    providers: [provideTranslocoScope('authorization')],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('@layout/base-layout/base-layout.component').then((m) => m.BaseLayoutComponent),
    loadChildren: () => import('@modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('@layout/base-layout/base-layout.component').then((m) => m.BaseLayoutComponent),
    loadChildren: () => import('@modules/client/client.module').then((m) => m.ClientModule),
    providers: [provideTranslocoScope()],
  },
];
