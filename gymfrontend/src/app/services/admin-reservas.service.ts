import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class AdminReservasService {
  // Endpoint ADMIN
  private readonly base = `${API_BASE}/api/admin/reservas`;

  constructor(private http: HttpClient) {}

  semana(p: { desde: string; productoId?: number; membresiaId?: number }) {
    const params: any = { desde: p.desde };
    if (p.productoId) params.productoId = p.productoId;
    if (p.membresiaId) params.membresiaId = p.membresiaId;

    return this.http.get<any[]>(`${this.base}/semana`, {
      params: toHttpParams(params),
    });
  }
}
