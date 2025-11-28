import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterPayload { nombre: string; apellido: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface AuthResponse { token: string; }

const API_BASE = 'https://webgym-frontend.onrender.com/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly base = API_BASE;
  private readonly KEY  = 'auth_token';
  private readonly KEY_UID = 'user_id';

  constructor(private http: HttpClient) {}

  // Registro
  registerInit(payload: RegisterPayload) {
    return this.http.post<{ status:string; message:string }>(
      `${this.base}/register-init`, payload
    );
  }

  register(payload: RegisterPayload) {
    return this.registerInit(payload);
  }

  registerConfirm(email: string, code: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/register-confirm`, null,
      { params: { email, code } }
    );
  }

  // Login
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload)
      .pipe(tap(res => this.setToken(res.token)));
  }

  loginInit(payload: LoginPayload) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/login-init`, payload
    );
  }

  loginConfirm(email: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login-confirm`, null, {
      params: { email, code }
    }).pipe(tap(res => this.setToken(res.token)));
  }


  // Recovery
  recoverInit(email: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-init`, null, { params: { email } }
    );
  }

  recoverConfirm(email: string, code: string, newPassword: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-confirm`, null,
      { params: { email, code, newPassword } }
    );
  }

  recoverValidate(email: string, code: string) {
    return this.http.post<{status:string; message:string}>(
      `${this.base}/recover-validate`, null,
      { params: { email, code } }
    );
  }


  // Token
  setToken(token: string) { localStorage.setItem(this.KEY, token); }
  getToken() { return localStorage.getItem(this.KEY); }
  clearToken() { localStorage.removeItem(this.KEY); }

  isLoggedIn() { return !!this.getToken(); }
  isLogged() { return this.isLoggedIn(); }

  decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  }

  getUsernameFromToken(): string | null {
    const t = this.getToken(); if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      return p?.email ?? p?.sub ?? p?.username ?? null;
    } catch { return null; }
  }

  getEmail() { return this.getUsernameFromToken(); }

  getRole(): string | null {
    const t = this.getToken(); if (!t) return null;
    try {
      return this.decodeJwt(t)?.role ?? null;
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

  // Roles
  isAdmin() { return this.getRole() === 'ADMIN'; }
  isTrabajador() { return this.getRole() === 'TRABAJADOR'; }

  logout() { this.clearToken(); }

  verifyEmail(email: string, code: string) {
    return this.registerConfirm(email, code);
  }

  setManualUserId(id: number) {
    localStorage.setItem(this.KEY_UID, String(id));
  }
}
