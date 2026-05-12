import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, StokGudang } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class StokGudangService {
  private apiUrl = `${environment.apiUrl}/stok-gudang`;

  constructor(private http: HttpClient) {}

  getAll(search?: string, minim?: boolean): Observable<ApiResponse<StokGudang[]>> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (minim) params = params.set('minim', 'true');
    return this.http.get<ApiResponse<StokGudang[]>>(this.apiUrl, { params });
  }

  update(id: number, data: { stok: number; stok_minimum: number }): Observable<ApiResponse<StokGudang>> {
    return this.http.put<ApiResponse<StokGudang>>(`${this.apiUrl}/${id}`, data);
  }
}
