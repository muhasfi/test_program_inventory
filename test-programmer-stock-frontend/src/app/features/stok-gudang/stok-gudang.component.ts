import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StokGudangService } from '../../core/services/stok-gudang.service';
import { StokGudang } from '../../shared/models';

@Component({
  selector: 'app-stok-gudang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stok-gudang.component.html',
})
export class StokGudangComponent implements OnInit {
  stokList: StokGudang[] = [];
  loading = true;
  search = '';
  filterMinim = false;

  showModal = false;
  formLoading = false;
  formError = '';
  selectedStok: StokGudang | null = null;
  form = { stok: 0, stok_minimum: 0 };

  constructor(private stokService: StokGudangService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.stokService.getAll(this.search, this.filterMinim).subscribe({
      next: (res) => {
        this.stokList = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getStokPercent(s: StokGudang): number {
    if (!s.stok_minimum || s.stok_minimum === 0) return s.stok > 0 ? 100 : 0;
    return Math.min(100, Math.round((s.stok / (s.stok_minimum * 2)) * 100));
  }

  openEdit(s: StokGudang): void {
    this.selectedStok = s;
    this.form = { stok: s.stok, stok_minimum: s.stok_minimum };
    this.formError = '';
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  saveForm(): void {
    if (!this.selectedStok) return;
    this.formLoading = true;
    this.stokService.update(this.selectedStok.id, this.form).subscribe({
      next: () => {
        this.formLoading = false;
        this.showModal = false;
        this.loadData();
      },
      error: (err) => {
        this.formLoading = false;
        this.formError = err.error?.message || 'Gagal update stok.';
      },
    });
  }
}
