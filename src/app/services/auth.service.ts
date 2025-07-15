import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, OtpRequest, OtpResponse, UserRole } from '../models/user.model';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  // Forgot password - Request OTP
  requestPasswordResetOtp(telephone: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password/request`, { telephone })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la demande de réinitialisation:', error);
          return throwError(() => error);
        })
      );
  }

  // Forgot password - Verify OTP
  verifyPasswordResetOtp(userId: number, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password/verify-otp`, { userId, code })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la vérification OTP:', error);
          return throwError(() => error);
        })
      );
  }

  // Forgot password - Resend OTP
  resendPasswordResetOtp(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password/resend-otp`, { userId })
      .pipe(
        catchError(error => {
          console.error('Erreur lors du renvoi OTP:', error);
          return throwError(() => error);
        })
      );
  }

  // Forgot password - Reset password
  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password/reset`, { userId, newPassword })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la réinitialisation du mot de passe:', error);
          return throwError(() => error);
        })
      );
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('sidra_token');
    const userData = localStorage.getItem('sidra_user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
        .pipe(
            tap(response => {
              console.log('Réponse de connexion:', response);
            }),
            catchError(error => {
              console.error('Erreur de connexion:', error);
              return throwError(() => error);
            })
        );
  }

  verifyOtp(request: OtpRequest): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.apiUrl}/auth/verify-otp`, request)
        .pipe(
            tap(response => {
              if (response.success && response.token && response.user) {
                // Stocker le token et les données utilisateur
                localStorage.setItem('sidra_token', response.token);
                localStorage.setItem('sidra_user', JSON.stringify(response.user));

                // Mettre à jour les subjects
                this.currentUserSubject.next(response.user);
                this.isAuthenticatedSubject.next(true);

                console.log('Authentification réussie:', response.user);
              }
            }),
            catchError(error => {
              console.error('Erreur de vérification OTP:', error);
              return throwError(() => error);
            })
        );
  }

  resendOtp(userId: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
        `${this.apiUrl}/auth/resend-otp?userId=${userId}`,
        {}
    ).pipe(
        catchError(error => {
          console.error('Erreur de renvoi OTP:', error);
          return throwError(() => error);
        })
    );
  }

  logout(): void {
    const token = localStorage.getItem('sidra_token');

    // Appeler l'endpoint de déconnexion si un token existe
    this.tryServerLogout(token);

    // Nettoyer le stockage local
    localStorage.removeItem('sidra_token');
    localStorage.removeItem('sidra_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private tryServerLogout(token: string | null): void {
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
        next: () => console.log('Déconnexion côté serveur réussie'),
        error: (error) => console.error('Erreur lors de la déconnexion côté serveur:', error)
      });
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  canAccessAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN_STRUCTURE;
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('sidra_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
