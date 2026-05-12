import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Barang } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class BarangService {
  private apiUrl = `${environment.apiUrl}/barang`;

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<ApiResponse<Barang[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<Barang[]>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Barang>> {
    return this.http.get<ApiResponse<Barang>>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<Barang> & { stok_awal: number; stok_minimum: number }): Observable<ApiResponse<Barang>> {
    return this.http.post<ApiResponse<Barang>>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Barang> & { stok_minimum?: number }): Observable<ApiResponse<Barang>> {
    return this.http.put<ApiResponse<Barang>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
