import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Country {
  id: number;
  nom: string;
  codeIso2: string;
  codeIso3: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) { }

  // Récupérer tous les pays
  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des pays:', error);
          return throwError(() => error);
        })
    );
  }

  // Rechercher des pays par nom
  searchCountries(query: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries/search?query=${query}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors de la recherche des pays:', error);
          return throwError(() => error);
        })
    );
  }

  // Récupérer un pays par son ID
  getCountryById(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/countries/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement du pays:', error);
          return throwError(() => error);
        })
    );
  }
}
