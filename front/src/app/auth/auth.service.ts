import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('https://back-store-v1.onrender.com/api/login', { email, password })
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
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  private removeSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}