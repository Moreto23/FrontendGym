import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private base = `${API_BASE}/api/reservas`;

  constructor(private http: HttpClient) {}

  filtrosUso() {
    return this.http.get<string[]>(`${this.base}/filtros/uso`);
  }

  productosReservables(p: {
    q?: string;
    categoria?: string;
    soloConStock?: boolean;
    page?: number;
    size?: number;
  }) {
    return this.http.get<any>(`${this.base}/productos`, {
      params: toHttpParams(p)
    });
  }

  // Versión que recibe usuarioId (por si la sigues usando en algún lado)
  crear(dto: { usuarioId: number; productoId: number; fecha: string; duracionMinutos?: number }) {
    return this.http.post<any>(`${this.base}`, dto);
  }

  // Versión "Me" basada en JWT (sin usuarioId)
  crearMe(dto: { productoId: number; fecha: string; duracionMinutos?: number }) {
    return this.http.post<any>(`${this.base}`, dto);
  }

  mias(days?: number) {
    return this.http.get<any[]>(`${this.base}/mias`, {
      params: toHttpParams({ days })
    });
  }

  semana(desde: string, productoId?: number) {
    return this.http.get<any[]>(`${this.base}/semana`, {
      params: toHttpParams({ desde, productoId })
    });
  }

  cancelar(id: number) {
    return this.http.post<any>(`${this.base}/${id}/cancelar`, {});
  }

  eliminar(id: number) {
    return this.http.delete<any>(`${this.base}/${id}`);
  }

  // ===== Admin / Trabajador =====
  adminList(p: { page?: number; size?: number; estado?: string }) {
    return this.http.get<any>(`${this.base}/admin`, {
      params: toHttpParams(p)
    });
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.post<any>(`${this.base}/${id}/estado`, { estado });
  }
}
