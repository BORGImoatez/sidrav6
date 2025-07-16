import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { FormulaireData } from '../models/formulaire.model';

@Injectable({
    providedIn: 'root'
})
export class FormulaireService {
    private apiUrl = environment.apiUrl || 'http://localhost:9090/api';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /**
     * Récupère tous les formulaires
     */
    getAllFormulaires(debut?: string, fin?: string): Observable<any[]> {
        let url = `${this.apiUrl}/formulaires`;

        // Ajouter les paramètres de date si fournis
        if (debut && fin) {
            url += `?debut=${debut}&fin=${fin}`;
        }

        return this.http.get<any[]>(url, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des formulaires:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Récupère un formulaire par son ID
     */
    getFormulaireById(id: number): Observable<FormulaireData> {
        return this.http.get<any>(`${this.apiUrl}/formulaires/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(catchError(error => {
            console.error('Erreur lors du chargement du formulaire:', error);
            return throwError(() => error);
        }));
    }

    /**
     * Récupère les formulaires d'un patient
     */
    getFormulairesByPatientId(patientId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/formulaires/patient/${patientId}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des formulaires du patient:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Crée un nouveau formulaire
     */
    createFormulaire(formulaireData: any): Observable<any> {
        // Adapter les noms des propriétés pour correspondre à ce qu'attend le backend
        const requestData = this.prepareFormDataForApi(formulaireData);

        return this.http.post<any>(`${this.apiUrl}/formulaires`, requestData, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la création du formulaire:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Met à jour un formulaire existant
     */
    updateFormulaire(id: number, formulaireData: any): Observable<FormulaireData> {
        // Adapter les noms des propriétés pour correspondre à ce qu'attend le backend
        const requestData = this.prepareFormDataForApi(formulaireData);

        console.log('Mise à jour du formulaire:', id, formulaireData);
        return this.http.put<any>(`${this.apiUrl}/formulaires/${id}`, requestData, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map((response: any) => {
                console.log('Réponse de mise à jour:', response);

                // Stocker l'ID du patient si disponible
                if (response.patient && response.patient.id) {
                    response.patientId = response.patient.id;
                }

                return response;
            }),
            catchError(error => {
                console.error('Erreur lors de la mise à jour du formulaire:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Supprime un formulaire
     */
    deleteFormulaire(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/formulaires/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            catchError(error => {
                console.error('Erreur lors de la suppression du formulaire:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Prépare les données du formulaire pour l'API backend
     */
    private prepareFormDataForApi(formData: any): any {
        // Créer une copie pour éviter de modifier l'original
        const requestData = JSON.parse(JSON.stringify(formData));

        // Renommer les propriétés pour correspondre aux attentes du backend
        if (formData.typeAlcool) {
            requestData.typeAlcoolDto = formData.typeAlcool;
            delete requestData.typeAlcool;
        }

        if (formData.entourageSpa) {
            requestData.entourageSpaDtO = formData.entourageSpa;
            delete requestData.entourageSpa;
        }

        if (formData.typeSpaEntourage) {
            requestData.typeSpaEntourageDto = formData.typeSpaEntourage;
            delete requestData.typeSpaEntourage;
        }

        if (formData.droguesActuelles) {
            requestData.droguesActuellesDto = formData.droguesActuelles;
            delete requestData.droguesActuelles;
        }

        if (formData.substanceInitiation) {
            requestData.substanceInitiationDto = formData.substanceInitiation;
            delete requestData.substanceInitiation;
        }

        if (formData.substancePrincipale) {
            requestData.substancePrincipaleDto = formData.substancePrincipale;
            delete requestData.substancePrincipale;
        }

        if (formData.voieAdministration) {
            requestData.voieAdministrationDto = formData.voieAdministration;
            delete requestData.voieAdministration;
        }

        if (formData.testVih) {
            requestData.testVihDto = formData.testVih;
            delete requestData.testVih;
        }

        if (formData.testVhc) {
            requestData.testVhcDto = formData.testVhc;
            delete requestData.testVhc;
        }

        if (formData.testVhb) {
            requestData.testVhbDto = formData.testVhb;
            delete requestData.testVhb;
        }

        if (formData.testSyphilis) {
            requestData.testSyphilisDto = formData.testSyphilis;
            delete requestData.testSyphilis;
        }

        if (formData.tentativeSevrageDetails) {
            requestData.tentativeSevrageDetailsDto = formData.tentativeSevrageDetails;
            delete requestData.tentativeSevrageDetails;
        }

        return requestData;
    }
}
