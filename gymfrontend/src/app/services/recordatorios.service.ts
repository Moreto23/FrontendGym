import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class RecordatoriosService {
  private base = `${API_BASE}/api/recordatorios`;

  constructor(private http: HttpClient) {}

  enviar(usuarioId: number) {
    return this.http.post<any>(`${this.base}/${usuarioId}`, {});
  }
}
