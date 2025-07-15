import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {Gouvernorat} from "../models/user.model";

export interface Delegation {
  id: number;
  nom: string;
  gouvernoratId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) { }

  // Récupérer toutes les délégations d'un gouvernorat
  getDelegationsByGouvernorat(gouvernoratId: any): Observable<Delegation[]> {
    return this.http.get<Delegation[]>(`${this.apiUrl}/delegations/gouvernorat/${gouvernoratId}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('sidra_token')}`
      })
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des délégations:', error);
          return throwError(() => error);
        })
    );
  }

  // Récupérer une délégation par son ID
  getDelegationById(id: number): Observable<Delegation> {
    return this.http.get<Delegation>(`${this.apiUrl}/delegations/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('sidra_token')}`
      })
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement de la délégation:', error);
          return throwError(() => error);
        })
    );
  }

  getGouvernorat(): Observable<Gouvernorat[]> {
    return this.http.get<Gouvernorat[]>(`${this.apiUrl}/gouvernorats`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('sidra_token')}`
      })
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement de la délégation:', error);
          return throwError(() => error);
        })
    );
  }
}
