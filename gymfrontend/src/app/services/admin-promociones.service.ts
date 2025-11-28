// src/app/services/admin-promociones.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://backendgym-1-id69.onrender.com';

@Injectable({
  providedIn: 'root',
})
export class AdminPromocionesService {
  private base = `${API_BASE}/api/promociones`;

  constructor(private http: HttpClient) {}

  // Lista promociones (puedes ajustar el tipo de retorno según tu backend)
  listar(params?: any) {
    return this.http.get<any>(this.base, {
      params: params ? toHttpParams(params) : undefined,
    });
  }

  // Obtiene una sola promo por id (si la necesitas)
  obtener(id: number) {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  // Crea una promoción
  crear(body: any) {
    return this.http.post<any>(this.base, body);
  }

  // 🔴 ESTA ES LA QUE TE FALTABA: actualizar
  actualizar(id: number, body: any) {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }

  // 🔴 Y ESTA: eliminar
  eliminar(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
