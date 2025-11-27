import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterPayload { nombre: string; apellido: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface AuthResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 👇 BASE DEL BACKEND EN RENDER
  private readonly base = 'https://backendgym-1-id69.onrender.com/api/auth';
  private readonly KEY  = 'auth_token';
  private readonly KEY_UID = 'user_id';

  constructor(private http: HttpClient) {}

  // 👉 aquí estaba el problema: usar this.base
  registerInit(payload: RegisterPayload) {
    return this.http.post<{ status:string; message:string }>(
      `${this.base}/register-init`,
      payload
    );
  }

  // Método genérico usado por el componente
  register(payload: RegisterPayload) {
    return this.registerInit(payload);
  }

  registerConfirm(email: string, code: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/register-confirm`,
      null,
      { params: { email, code } }
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload)
      .pipe(tap(res => this.setToken(res.token)));
  }

  loginInit(payload: LoginPayload): Observable<{status:string; message:string}> {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/login-init`,
      payload
    );
  }

  loginConfirm(email: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.base}/login-confirm`,
      null,
      { params: { email, code } }
    ).pipe(tap(res => this.setToken(res.token)));
  }

  recoverInit(email: string): Observable<{status:string; message:string}> {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-init`,
      null,
      { params: { email } }
    );
  }

  recoverConfirm(email: string, code: string, newPassword: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-confirm`,
      null,
      { params: { email, code, newPassword } }
    );
  }

  recoverValidate(email: string, code: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-validate`,
      null,
      { params: { email, code } }
    );
  }

  setToken(token: string) { localStorage.setItem(this.KEY, token); }
  getToken(): string | null { return localStorage.getItem(this.KEY); }
  clearToken() { localStorage.removeItem(this.KEY); }

  isLoggedIn(): boolean { return !!this.getToken(); }
  isLogged(): boolean { return this.isLoggedIn(); }

  getUsernameFromToken(): string | null {
    const t = this.getToken(); if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      return p?.email ?? p?.sub ?? p?.username ?? null;
    } catch { return null; }
  }

  getEmail(): string | null { return this.getUsernameFromToken(); }

  getRole(): string | null {
    const t = this.getToken(); if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      return p?.role ?? null;
    } catch { return null; }
  }

  getUserId(): number | null {
    const t = this.getToken(); if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      const v = p?.userId ?? p?.id ?? p?.uid ?? p?.user_id ?? null;
      if (v != null) return Number(v);
    } catch {}
    const stored = localStorage.getItem(this.KEY_UID);
    return stored ? Number(stored) : null;
  }

  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isTrabajador(): boolean { return this.getRole() === 'TRABAJADOR'; }
  logout(): void { this.clearToken(); }

  private decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  }

  verifyEmail(email: string, code: string) {
    return this.registerConfirm(email, code);
  }

  setManualUserId(id: number) {
    localStorage.setItem(this.KEY_UID, String(id));
  }
}
