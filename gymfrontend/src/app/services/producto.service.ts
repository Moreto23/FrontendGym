import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toHttpParams } from './http.util';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly base = `${API_BASE}/api/productos`;

  constructor(private http: HttpClient) {}

  categorias() {
    return this.http.get<string[]>(`${this.base}/categorias`);
  }

  destacados() {
    return this.http.get<any[]>(`${this.base}/destacados`);
  }

  buscar(p: {
    q?: string;
    categoria?: string;
    soloConStock?: boolean;
    page?: number;
    size?: number;
  }) {
    const params = toHttpParams({
      q: p.q ?? '',
      categoria: p.categoria ?? '',
      soloConStock: p.soloConStock ?? false,
      page: p.page ?? 0,
      size: p.size ?? 12,
    });
    return this.http.get<any>(`${this.base}/search`, { params });
  }

  popularidad(id: number) {
    return this.http.post<any>(`${this.base}/${id}/popularidad`, {});
  }
}
