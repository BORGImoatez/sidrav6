import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /**
     * Récupère les statistiques des patients
     */
    getPatientStatistics(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/patients/statistics`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des statistiques des patients:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Récupère tous les patients
     */
    getAllPatients(search?: string): Observable<any[]> {
        let url = `${this.apiUrl}/patients`;

        // Ajouter le paramètre de recherche si fourni
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }

        return this.http.get<any[]>(url, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des patients:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Récupère un patient par son ID
     */
    getPatientById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/patients/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement du patient:', error);
                return throwError(() => error);
            })
        );
    }
}
