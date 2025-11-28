import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class SuscripcionesService {
  private base = `${API_BASE}/api/suscripciones`;

  constructor(private http: HttpClient) {}

  crear(body: {
    membresiaId?: number;
    planSuscripcionId?: number;
    metodoPago?: string;
    monto?: number;
    comprobanteUrl?: string;
  }) {
    return this.http.post<any>(`${this.base}`, body);
  }

  mias() {
    return this.http.get<any[]>(`${this.base}/mias`);
  }
}
