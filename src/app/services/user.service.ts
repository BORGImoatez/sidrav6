import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, UserRole, Structure, TypeStructure, Gouvernorat, Ministere, UserStructureInfo } from '../models/user.model';
import { AuthService } from './auth.service';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // Gestion des utilisateurs
    getUsers(structureId?: number): Observable<User[]> {
        let url = `${this.apiUrl}/users`;
        if (structureId) {
            url += `?structureId=${structureId}`;
        }

        return this.http.get<User[]>(url, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des utilisateurs:', error);
                return throwError(() => error);
            })
        );
    }

    getUserById(id: number): Observable<User | null> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                return throwError(() => error);
            })
        );
    }

    createUser(userData: Partial<User>): Observable<User> {
        // Préparer les données pour l'API backend
        const createRequest = {
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            telephone: userData.telephone,
            role: userData.role,
            structureId: userData.structureId,
            motDePasse: userData.motDePasse
        };

        return this.http.post<User>(`${this.apiUrl}/users`, createRequest, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la création de l\'utilisateur:', error);
                return throwError(() => error);
            })
        );
    }

    updateUser(id: number, userData: Partial<User>): Observable<User> {
        // Préparer les données pour l'API backend (sans mot de passe pour la modification)
        const updateRequest = {
            nom: userData.nom,
            prenom: userData.prenom,
            email: userData.email,
            telephone: userData.telephone,
            role: userData.role,
            structureId: userData.structureId
        };

        return this.http.put<User>(`${this.apiUrl}/users/${id}`, updateRequest, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la modification de l\'utilisateur:', error);
                return throwError(() => error);
            })
        );
    }

    deleteUser(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/users/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                return throwError(() => error);
            })
        );
    }

    toggleUserStatus(id: number): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/users/${id}/toggle-status`, {}, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du changement de statut:', error);
                return throwError(() => error);
            })
        );
    }

    // Gestion des structures
    getStructures(): Observable<Structure[]> {
        return this.http.get<Structure[]>(`${this.apiUrl}/structures`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des structures:', error);
                return throwError(() => error);
            })
        );
    }

    getStructureById(id: number): Observable<Structure | null> {
        return this.http.get<Structure>(`${this.apiUrl}/structures/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement de la structure:', error);
                return throwError(() => error);
            })
        );
    }

    createStructure(structureData: Partial<Structure>): Observable<Structure> {
        return this.http.post<Structure>(`${this.apiUrl}/structures`, structureData, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la création de la structure:', error);
                return throwError(() => error);
            })
        );
    }

    updateStructure(id: number, structureData: Partial<Structure>): Observable<Structure> {
        return this.http.put<Structure>(`${this.apiUrl}/structures/${id}`, structureData, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la modification de la structure:', error);
                return throwError(() => error);
            })
        );
    }

    deleteStructure(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/structures/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la suppression de la structure:', error);
                return throwError(() => error);
            })
        );
    }

    toggleStructureStatus(id: number): Observable<Structure> {
        return this.http.patch<Structure>(`${this.apiUrl}/structures/${id}/toggle-status`, {}, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du changement de statut de la structure:', error);
                return throwError(() => error);
            })
        );
    }

    // Données de référence
    getGouvernorats(): Observable<Gouvernorat[]> {
        return this.http.get<Gouvernorat[]>(`${this.apiUrl}/gouvernorats`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des gouvernorats:', error);
                return throwError(() => error);
            })
        );
    }

    // Récupérer tous les ministères
    getMinisteres(): Observable<Ministere[]> {
        return this.http.get<Ministere[]>(`${this.apiUrl}/ministeres`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des ministères:', error);
                return throwError(() => error);
            })
        );
    }

    // Statistiques pour le dashboard
    getStatistics(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/users/statistics`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des statistiques:', error);
                return throwError(() => error);
            })
        );
    }

    // Récupérer les informations de structure de l'utilisateur connecté
    getUserStructureInfo(): Observable<UserStructureInfo> {
        return this.http.get<UserStructureInfo>(`${this.apiUrl}/users/structure-info`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des informations de structure:', error);
                return throwError(() => error);
            })
        );
    }
}
