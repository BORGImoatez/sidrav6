import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientAccessService {
  private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Demande l'accès à un patient
   */
  requestAccess(patientId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patient-access/request`, { patientId }, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la demande d\'accès:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les demandes d'accès envoyées par l'utilisateur courant
   */
  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient-access/my-requests`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des demandes d\'accès:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les demandes d'accès reçues par l'utilisateur courant
   */
  getReceivedRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient-access/received-requests`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des demandes d\'accès reçues:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Approuve une demande d'accès
   */
  approveRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patient-access/${requestId}/approve`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'approbation de la demande:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Rejette une demande d'accès
   */
  rejectRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patient-access/${requestId}/reject`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du rejet de la demande:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Annule une demande d'accès
   */
  cancelRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patient-access/${requestId}/cancel`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'annulation de la demande:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Vérifie si l'utilisateur a accès à un patient
   */
  checkAccess(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient-access/check/${patientId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification d\'accès:', error);
        return throwError(() => error);
      })
    );
  }
}