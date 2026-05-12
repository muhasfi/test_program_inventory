import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaksiKeluarService } from '../../core/services/transaksi-keluar.service';
import { BarangService } from '../../core/services/barang.service';
import { TransaksiKeluar, Barang } from '../../shared/models';

interface FormItem {
  barang_id: number | null;
  jumlah: number;
}

@Component({
  selector: 'app-transaksi-keluar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaksi-keluar.component.html',
})
export class TransaksiKeluarComponent implements OnInit {
  transaksiList: TransaksiKeluar[] = [];
  barangList: Barang[] = [];
  loading = true;

  filterSearch = '';
  filterDari = '';
  filterSampai = '';

  showModal = false;
  formLoading = false;
  formErrors: string[] = [];
  form = {
    tanggal: new Date().toISOString().split('T')[0],
    keperluan: '',
    catatan: '',
  };
  items: FormItem[] = [{ barang_id: null, jumlah: 1 }];

  showDetail = false;
  selectedTransaksi: TransaksiKeluar | null = null;

  showBatalModal = false;
  batalLoading = false;
  batalError = '';
  transaksiToBatal: TransaksiKeluar | null = null;

  constructor(
    private transaksiService: TransaksiKeluarService,
    private barangService: BarangService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadBarang();
  }

  loadData(): void {
    this.loading = true;
    this.transaksiService
      .getAll({
        search: this.filterSearch,
        tanggal_dari: this.filterDari,
        tanggal_sampai: this.filterSampai,
      })
      .subscribe({
        next: (res) => {
          this.transaksiList = res.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadBarang(): void {
    this.barangService.getAll().subscribe({
      next: (res) => {
        this.barangList = res.data.filter((b) => b.is_active);
      },
    });
  }

  resetFilter(): void {
    this.filterSearch = '';
    this.filterDari = '';
    this.filterSampai = '';
    this.loadData();
  }

  openCreate(): void {
    this.form = { tanggal: new Date().toISOString().split('T')[0], keperluan: '', catatan: '' };
    this.items = [{ barang_id: null, jumlah: 1 }];
    this.formErrors = [];
    this.showModal = true;
  }

  addItem(): void {
    this.items.push({ barang_id: null, jumlah: 1 });
  }

  removeItem(i: number): void {
    if (this.items.length > 1) this.items.splice(i, 1);
  }

  getStok(id: number | null): number {
    return id ? (this.barangList.find((b) => b.id === id)?.stok_gudang?.stok ?? 0) : 0;
  }

  getSatuan(id: number | null): string {
    return id ? (this.barangList.find((b) => b.id === id)?.satuan ?? '') : '';
  }

  saveForm(): void {
    this.formErrors = [];
    if (!this.form.keperluan) {
      this.formErrors.push('Keperluan wajib diisi.');
      return;
    }
    if (this.items.some((i) => !i.barang_id)) {
      this.formErrors.push('Pilih barang untuk semua item.');
      return;
    }
    if (this.items.some((i) => i.jumlah < 1)) {
      this.formErrors.push('Jumlah minimal 1.');
      return;
    }

    this.formLoading = true;
    this.transaksiService
      .create({
        tanggal: this.form.tanggal,
        keperluan: this.form.keperluan,
        catatan: this.form.catatan,
        items: this.items.map((i) => ({ barang_id: i.barang_id!, jumlah: i.jumlah })),
      })
      .subscribe({
        next: () => {
          this.formLoading = false;
          this.showModal = false;
          this.loadData();
          this.loadBarang();
        },
        error: (err) => {
          this.formLoading = false;
          this.formErrors = err.error?.errors ?? [
            err.error?.message ?? 'Gagal menyimpan transaksi.',
          ];
        },
      });
  }

  viewDetail(t: TransaksiKeluar): void {
    this.transaksiService.getById(t.id).subscribe({
      next: (res) => {
        this.selectedTransaksi = res.data;
        this.showDetail = true;
      },
    });
  }

  confirmBatal(t: TransaksiKeluar): void {
    this.transaksiToBatal = t;
    this.batalError = '';
    this.showBatalModal = true;
  }

  executeBatal(): void {
    if (!this.transaksiToBatal) return;
    this.batalLoading = true;
    this.batalError = '';

    this.transaksiService.delete(this.transaksiToBatal.id).subscribe({
      next: () => {
        this.batalLoading = false;
        this.showBatalModal = false;
        this.transaksiToBatal = null;
        this.loadData();
        this.loadBarang();
      },
      error: (err) => {
        this.batalLoading = false;
        this.batalError = err.error?.message || 'Gagal membatalkan transaksi.';
      },
    });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showModal = false;
      this.showDetail = false;
      this.showBatalModal = false;
    }
  }
}
