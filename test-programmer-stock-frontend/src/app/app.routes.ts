import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'barang',
        loadComponent: () =>
          import('./features/barang/barang.component').then(m => m.BarangComponent),
      },
      {
        path: 'stok-gudang',
        loadComponent: () =>
          import('./features/stok-gudang/stok-gudang.component').then(m => m.StokGudangComponent),
      },
      {
        path: 'transaksi-keluar',
        loadComponent: () =>
          import('./features/transaksi-keluar/transaksi-keluar.component').then(m => m.TransaksiKeluarComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
