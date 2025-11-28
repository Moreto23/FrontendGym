import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://webgym-frontend.onrender.com/api/carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private readonly base = API_BASE;

  constructor(private http: HttpClient) {}

  // --- Carrito con usuarioId explícito ---
  get(usuarioId: number) {
    return this.http.get<any>(this.base, { params: toHttpParams({ usuarioId }) });
  }

  agregar(usuarioId: number, productoId: number, cantidad = 1) {
    return this.http.post<any>(this.base, null, { params: toHttpParams({ usuarioId, productoId, cantidad }) });
  }

  actualizar(itemId: number, cantidad: number) {
    return this.http.patch<any>(`${this.base}/${itemId}`, null, { params: toHttpParams({ cantidad }) });
  }

  eliminar(itemId: number) {
    return this.http.delete<void>(`${this.base}/${itemId}`);
  }

  vaciar(usuarioId: number) {
    return this.http.delete<void>(this.base, { params: toHttpParams({ usuarioId }) });
  }

  // --- Con JWT (sin usuarioId en query) ---
  agregarConToken(productoId: number, cantidad = 1) {
    return this.http.post<any>(this.base, null, { params: toHttpParams({ productoId, cantidad }) });
  }

  getConToken() {
    return this.http.get<any>(this.base);
  }

  vaciarConToken() {
    return this.http.delete<void>(this.base);
  }
}
