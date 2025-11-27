import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterPayload { nombre: string; apellido: string; email: string; password: string; }
export interface LoginPayload { email: string; password: string; }
export interface AuthResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {

  // 🔗 URL base del backend desplegado en Render
  private readonly BASE = 'https://backendgym-1-id69.onrender.com/api/auth';

  private readonly KEY = 'auth_token';
  private readonly KEY_UID = 'user_id';

  constructor(private http: HttpClient) {}

  // Registro: inicia el flujo (envía código al correo)
  registerInit(payload: RegisterPayload) {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/register-init`,
      payload
    );
  }

  // Método genérico de registro usado por RegisterComponent
  register(payload: RegisterPayload) {
    return this.registerInit(payload);
  }

  // Confirmar registro con código
  registerConfirm(email: string, code: string) {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/register-confirm`,
      null,
      { params: { email, code } }
    );
  }

  // Login normal (sin OTP)
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/login`, payload)
      .pipe(tap(res => this.setToken(res.token)));
  }

  // Login en 2 pasos (OTP)
  loginInit(payload: LoginPayload): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/login-init`,
      payload
    );
  }

  loginConfirm(email: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.BASE}/login-confirm`,
      null,
      { params: { email, code } }
    ).pipe(tap(res => this.setToken(res.token)));
  }

  // Recuperar contraseña: paso 1 (envía código)
  recoverInit(email: string): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/recover-init`,
      null,
      { params: { email } }
    );
  }

  // Recuperar contraseña: paso 2 (valida código y cambia contraseña)
  recoverConfirm(email: string, code: string, newPassword: string): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/recover-confirm`,
      null,
      { params: { email, code, newPassword } }
    );
  }

  // Validar código de recuperación sin cambiar contraseña
  recoverValidate(email: string, code: string): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE}/recover-validate`,
      null,
      { params: { email, code } }
    );
  }

  // ====== Manejo de token ======

  setToken(token: string) {
    localStorage.setItem(this.KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  clearToken() {
    localStorage.removeItem(this.KEY);
  }

  isLoggedIn(): boolean { return !!this.getToken(); }
  isLogged(): boolean { return this.isLoggedIn(); }

  getUsernameFromToken(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      return p?.email ?? p?.sub ?? p?.username ?? null;
    } catch {
      return null;
    }
  }

  getEmail(): string | null { return this.getUsernameFromToken(); }

  getRole(): string | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      return p?.role ?? null;
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    const t = this.getToken();
    if (!t) return null;
    try {
      const p = this.decodeJwt(t);
      const v = p?.userId ?? p?.id ?? p?.uid ?? p?.user_id ?? null;
      if (v != null) return Number(v);
    } catch {
      // ignore
    }
    const stored = localStorage.getItem(this.KEY_UID);
    return stored ? Number(stored) : null;
  }

  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isTrabajador(): boolean { return this.getRole() === 'TRABAJADOR'; }

  logout(): void {
    this.clearToken();
  }

  private decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  }

  // Alias usado por componentes para verificar correo
  verifyEmail(email: string, code: string) {
    return this.registerConfirm(email, code);
  }

  // Permite fijar manualmente el ID de usuario cuando el token no lo trae
  setManualUserId(id: number) {
    localStorage.setItem(this.KEY_UID, String(id));
  }
}
