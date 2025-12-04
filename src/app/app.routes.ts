import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'authorization',
    loadComponent: () => import('@layout/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'admin',
    loadComponent: () => import('@layout/base-layout/base-layout.component').then((m) => m.BaseLayoutComponent),
    loadChildren: () => import('@modules/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '',
    loadComponent: () => import('@layout/base-layout/base-layout.component').then((m) => m.BaseLayoutComponent),
    loadChildren: () => import('@modules/client/client.module').then((m) => m.ClientModule),
  },
];
