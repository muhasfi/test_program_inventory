import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData, StokGudang } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  error = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getData().subscribe({
      next: (res) => {
        this.data = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Gagal memuat data.';
        this.loading = false;
      },
    });
  }

  getStokPercent(s: StokGudang): number {
    if (!s.stok_minimum || s.stok_minimum === 0) return 0;
    return Math.min(100, Math.round((s.stok / (s.stok_minimum * 2)) * 100));
  }
}
