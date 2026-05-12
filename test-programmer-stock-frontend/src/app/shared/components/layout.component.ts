import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../models';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/barang': 'Master Barang',
  '/stok-gudang': 'Stok Gudang',
  '/transaksi-keluar': 'Barang Keluar',
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  currentUser: User | null = null;
  pageTitle = 'Dashboard';
  today = new Date();

  get initials(): string {
    return (
      this.currentUser?.name
        ?.split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase() ?? 'U'
    );
  }

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.currentUser = authService.getCurrentUser();

    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.pageTitle = PAGE_TITLES[e.urlAfterRedirects] ?? 'Sistem Inventory';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
