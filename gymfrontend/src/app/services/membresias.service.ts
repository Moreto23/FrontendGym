import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://webgym-frontend.onrender.com/api/membresias';

@Injectable({ providedIn: 'root' })
export class MembresiasService {

  private readonly base = API_BASE;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any[]>(this.base);
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  adquirir(id: number, usuarioId: number, monto?: number) {
    return this.http.post<any>(`${this.base}/${id}/adquirir`, null, {
      params: toHttpParams({ usuarioId, monto })
    });
  }
}
