import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenKey = 'token';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkToken();
  }

  private checkToken(): void {
    if (!this.isBrowser) return;
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3060/api/login', { email, password })
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.setSession(response.token);
          }
        }),
        catchError(error => {
          console.error('Error during login:', error);
          throw error;
        })
      );
  }

  logout(): void {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  private setSession(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private removeSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const directRole = this.normalizeRole(payload['role']) ?? this.normalizeRole(payload['rol']);
    if (directRole) {
      return directRole;
    }

    const user = payload['user'];
    if (user && typeof user === 'object') {
      const userRecord = user as Record<string, unknown>;
      const nestedRole = this.normalizeRole(userRecord['role']) ?? this.normalizeRole(userRecord['rol']);
      if (nestedRole) {
        return nestedRole;
      }
    }

    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  private getTokenPayload(): Record<string, unknown> | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
      const payload = atob(paddedBase64);
      return JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private normalizeRole(value: unknown): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    return value.trim().toLowerCase();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}