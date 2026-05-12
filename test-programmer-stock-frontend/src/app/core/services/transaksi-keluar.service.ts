import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, TransaksiKeluar } from '../../shared/models';

export interface TransaksiKeluarPayload {
  tanggal: string;
  keperluan: string;
  catatan?: string;
  items: { barang_id: number; jumlah: number }[];
}

@Injectable({ providedIn: 'root' })
export class TransaksiKeluarService {
  private apiUrl = `${environment.apiUrl}/transaksi-keluar`;

  constructor(private http: HttpClient) {}

  getAll(params?: { search?: string; tanggal_dari?: string; tanggal_sampai?: string }): Observable<ApiResponse<TransaksiKeluar[]>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.tanggal_dari) httpParams = httpParams.set('tanggal_dari', params.tanggal_dari);
    if (params?.tanggal_sampai) httpParams = httpParams.set('tanggal_sampai', params.tanggal_sampai);
    return this.http.get<ApiResponse<TransaksiKeluar[]>>(this.apiUrl, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<TransaksiKeluar>> {
    return this.http.get<ApiResponse<TransaksiKeluar>>(`${this.apiUrl}/${id}`);
  }

  create(data: TransaksiKeluarPayload): Observable<ApiResponse<TransaksiKeluar>> {
    return this.http.post<ApiResponse<TransaksiKeluar>>(this.apiUrl, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
