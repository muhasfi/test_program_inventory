export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Barang {
  id: number;
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  deskripsi?: string;
  is_active: boolean;
  stok_gudang?: StokGudang;
  created_at: string;
  updated_at: string;
}

export interface StokGudang {
  id: number;
  barang_id: number;
  stok: number;
  stok_minimum: number;
  barang?: Barang;
}

export interface TransaksiKeluar {
  id: number;
  no_transaksi: string;
  tanggal: string;
  keperluan: string;
  catatan?: string;
  user_id: number;
  user?: User;
  details?: TransaksiKeluarDetail[];
  created_at: string;
}

export interface TransaksiKeluarDetail {
  id: number;
  transaksi_keluar_id: number;
  barang_id: number;
  jumlah: number;
  stok_sebelum: number;
  stok_sesudah: number;
  barang?: Barang;
}

export interface DashboardData {
  ringkasan_barang: { total: number; aktif: number; nonaktif: number };
  ringkasan_stok: { total_stok: number; stok_habis: number; stok_menipis: number };
  ringkasan_transaksi: { total: number; hari_ini: number; bulan_ini: number };
  barang_menipis: StokGudang[];
  transaksi_terbaru: TransaksiKeluar[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}
