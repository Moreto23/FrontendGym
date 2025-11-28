import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = '${API_BASE}/api/usuarios';
  constructor(private http: HttpClient) {}
  obtener(id: number) { return this.http.get<any>(`${this.base}/${id}`); }
  actualizar(id: number, data: Partial<{ telefono: string; direccion: string }>) { return this.http.patch<any>(`${this.base}/${id}`, data); }
  me() { return this.http.get<any>(`${this.base}/me`); }
}
