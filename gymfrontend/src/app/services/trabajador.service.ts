import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'https://webgym-frontend.onrender.com';

@Injectable({ providedIn: 'root' })
export class TrabajadorService {
  private base = `${API_BASE}/api/pagos/trabajador`;

  constructor(private http: HttpClient) {}

  listarPedidos(params?: { estado?: string; estadoPago?: string }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);
    if (params?.estadoPago) httpParams = httpParams.set('estadoPago', params.estadoPago);

    return this.http.get<any[]>(`${this.base}/pedidos`, { params: httpParams });
  }

  descargarComprobantePdf(pedidoId: number): Observable<Blob> {
    return this.http.get(`${this.base}/pedidos/${pedidoId}/comprobante-pdf`, {
      responseType: 'blob'
    });
  }

  confirmarPedido(pedidoId: number, referenciaPago?: string): Observable<any> {
    let params = new HttpParams();
    if (referenciaPago) params = params.set('referenciaPago', referenciaPago);

    return this.http.post<any>(`${this.base}/pedidos/${pedidoId}/confirmar`, null, { params });
  }

  cancelarPedido(pedidoId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/pedidos/${pedidoId}/cancelar`, null);
  }

  rechazarPedido(pedidoId: number, motivo?: string): Observable<any> {
    let params = new HttpParams();
    if (motivo) params = params.set('motivo', motivo);

    return this.http.post<any>(`${this.base}/pedidos/${pedidoId}/rechazar`, null, { params });
  }

  marcarRevisionPedido(pedidoId: number, nota?: string): Observable<any> {
    let params = new HttpParams();
    if (nota) params = params.set('nota', nota);

    return this.http.post<any>(`${this.base}/pedidos/${pedidoId}/revision`, null, { params });
  }

  listarPagos(params?: { estado?: string }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);

    return this.http.get<any[]>(`${this.base}/pagos`, { params: httpParams });
  }

  listarSuscripciones(params?: { estado?: string; tipo?: 'MEMBRESIA' | 'PLAN' }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);
    if (params?.tipo) httpParams = httpParams.set('tipo', params.tipo);

    return this.http.get<any[]>(`${this.base}/suscripciones`, { params: httpParams });
  }

  confirmarSuscripcion(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/suscripciones/${id}/confirmar`, null);
  }

  rechazarSuscripcion(id: number, motivo?: string): Observable<any> {
    let params = new HttpParams();
    if (motivo) params = params.set('motivo', motivo);

    return this.http.post<any>(`${this.base}/suscripciones/${id}/rechazar`, null, { params });
  }

  cancelarSuscripcion(id: number, motivo?: string): Observable<any> {
    let params = new HttpParams();
    if (motivo) params = params.set('motivo', motivo);

    return this.http.post<any>(`${this.base}/suscripciones/${id}/cancelar`, null, { params });
  }

  eliminarSuscripcion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/suscripciones/${id}`);
  }

  eliminarPedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/pedidos/${id}`);
  }

  // --- Suscripciones (para flujo Mercado Pago) ---
  iniciarSuscripcion(payload: {
    membresiaId?: number;
    planSuscripcionId?: number;
    monto?: number;
  }): Observable<any> {
    // Usa controlador de suscripciones para registrar intención
    return this.http.post<any>(`${API_BASE}/api/suscripciones/iniciar`, payload);
  }

  crearPreferenciaSuscripcion(suscripcionId: number): Observable<any> {
    // Crea preferencia en backend con external_reference SUSCRIPCION:<id>
    return this.http.post<any>(
      `${API_BASE}/api/pagos/mercadopago/preferencia-suscripcion?suscripcionId=${suscripcionId}`,
      {}
    );
  }

  resumenAsistenciaUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/api/perfil/asistencia-resumen-usuarios`);
  }

  registrarCheckinPorToken(qrToken: string): Observable<any> {
    const token = encodeURIComponent(qrToken || '');
    return this.http.post<any>(`${API_BASE}/api/checkin/${token}`, {});
  }
}
