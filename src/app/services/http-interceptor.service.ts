import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('sidra_token');
    
    if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/verify-otp')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Ajouter les headers par défaut
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur HTTP:', error);

        // Gérer les erreurs d'authentification
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // Gérer les erreurs de serveur
        if (error.status >= 500) {
          console.error('Erreur serveur:', error.message);
        }

        return throwError(() => error);
      })
    );
  }
}