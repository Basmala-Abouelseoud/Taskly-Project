import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, SignUpPayload } from '../interfaces/auth';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'apikey': environment.supabaseAnonKey,
      'Authorization': `Bearer ${environment.supabaseAnonKey}`,
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'apikey': environment.supabaseAnonKey,
      'Authorization': `Bearer ${token}`,
    });
  }

  signUp(payload: SignUpPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}auth/v1/signup`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(tap((res) => this.saveSession(res)));
  }

  login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.baseUrl}auth/v1/token?grant_type=password`,
        { email, password },
        { headers: this.getHeaders() }
      )
      .pipe(tap((res) => this.saveSession(res, rememberMe)));
  }

logout(): void {
    this.http.post<void>(`${environment.baseUrl}auth/v1/logout`, {}, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: () => {
        this.clearSession();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error, forcing clear...', err);
        this.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }

  private saveSession(res: AuthResponse, rememberMe: boolean = false): void {
    localStorage.setItem('auth_response', JSON.stringify(res));
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('refresh_token', res.refresh_token);
    if (rememberMe) localStorage.setItem('remember_me', 'true');
  }

  clearSession(): void {
    // LocalStorage
    localStorage.removeItem('auth_response');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('remember_me');

    // SessionStorage
    sessionStorage.clear();

    // Cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }


forgotPassword(email: string): Observable<void> {
const redirectUrl = `${window.location.origin}/reset-password?type=recovery`;  
  return this.http.post<void>(
    `${environment.baseUrl}recover`, 
    { 
      email: email,
      options: {
        redirectTo: redirectUrl 
      }
    }, 
    { headers: this.getHeaders() }
  );
}

updatePassword(newPassword: string, accessToken: string): Observable<void> {
  const headers = new HttpHeaders({
    'apikey': environment.supabaseAnonKey,
    'Authorization': `Bearer ${accessToken}`, 
    'Content-Type': 'application/json'
  });
  
  return this.http.put<void>(
    `${environment.baseUrl}user`,
    { password: newPassword },
    { headers }
  );
}

getAccessToken(): string {
  return localStorage.getItem('access_token') || '';
}
}