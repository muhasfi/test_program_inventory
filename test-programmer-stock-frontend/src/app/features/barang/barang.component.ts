import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarangService } from '../../core/services/barang.service';
import { Barang } from '../../shared/models';

@Component({
  selector: 'app-barang',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barang.component.html',
})
export class BarangComponent implements OnInit {
  barangList: Barang[] = [];
  loading = true;
  search = '';

  showModal = false;
  isEdit = false;
  formLoading = false;
  formError = '';
  selectedId: number | null = null;

  form = {
    nama_barang: '',
    satuan: '',
    deskripsi: '',
    stok_awal: 0,
    stok_minimum: 0,
    is_active: true,
  };

  showDeleteModal = false;
  deleteLoading = false;
  deleteError = '';
  barangToDelete: Barang | null = null;

  constructor(private barangService: BarangService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.barangService.getAll(this.search).subscribe({
      next: (res) => {
        this.barangList = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getStokBadgeClass(b: Barang): string {
    const stok = b.stok_gudang?.stok ?? 0;
    const min = b.stok_gudang?.stok_minimum ?? 0;
    if (stok === 0) return 'badge-danger';
    if (stok <= min) return 'badge-warning';
    return 'badge-success';
  }

  openCreate(): void {
    this.isEdit = false;
    this.selectedId = null;
    this.form = {
      nama_barang: '',
      satuan: '',
      deskripsi: '',
      stok_awal: 0,
      stok_minimum: 0,
      is_active: true,
    };
    this.formError = '';
    this.showModal = true;
  }

  openEdit(b: Barang): void {
    this.isEdit = true;
    this.selectedId = b.id;
    this.form = {
      nama_barang: b.nama_barang,
      satuan: b.satuan,
      deskripsi: b.deskripsi || '',
      stok_awal: b.stok_gudang?.stok || 0,
      stok_minimum: b.stok_gudang?.stok_minimum || 0,
      is_active: b.is_active,
    };
    this.formError = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveForm(): void {
    if (!this.form.nama_barang || !this.form.satuan) {
      this.formError = 'Nama barang dan satuan wajib diisi.';
      return;
    }
    this.formLoading = true;
    this.formError = '';

    const obs = this.isEdit
      ? this.barangService.update(this.selectedId!, {
          nama_barang: this.form.nama_barang,
          satuan: this.form.satuan,
          deskripsi: this.form.deskripsi,
          stok_minimum: this.form.stok_minimum,
          is_active: this.form.is_active,
        })
      : this.barangService.create(this.form);

    obs.subscribe({
      next: () => {
        this.formLoading = false;
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        this.formLoading = false;
        this.formError = err.error?.message || 'Gagal menyimpan data.';
      },
    });
  }

  confirmDelete(b: Barang): void {
    this.barangToDelete = b;
    this.deleteError = '';
    this.showDeleteModal = true;
  }

  executeDelete(): void {
    if (!this.barangToDelete) return;
    this.deleteLoading = true;
    this.deleteError = '';

    this.barangService.delete(this.barangToDelete.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.showDeleteModal = false;
        this.barangToDelete = null;
        this.loadData();
      },
      error: (err) => {
        this.deleteLoading = false;
        this.deleteError = err.error?.message || 'Gagal menghapus barang.';
      },
    });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
      this.showDeleteModal = false;
    }
  }
}
