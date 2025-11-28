import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://webgym-frontend.onrender.com/api/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private base = API_BASE;

  constructor(private http: HttpClient) {}

  resumen(usuarioId: number) {
    return this.http.get<any>(`${this.base}/${usuarioId}`);
  }
}
