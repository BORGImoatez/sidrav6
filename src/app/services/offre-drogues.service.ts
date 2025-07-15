import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";

// Assuming these interfaces exist - add them if they don't
interface OffreDroguesListItem {
  id: number;
  dateSaisie: string;
  // Add other list item properties as needed
}

interface OffreDrogues {
  id?: number;
  dateSaisie: string;
  quantitesDrogues?: {
    cannabis?: number;
    comprimesTableauA?: number;
    ecstasyComprime?: number;
    ecstasyPoudre?: number;
    subutex?: number;
    cocaine?: number;
    heroine?: number;
  };
  personnesInculpees?: {
    consommateur?: { nombre?: number; pourcentage?: number; };
    vendeur?: { nombre?: number; pourcentage?: number; };
    trafiquant?: { nombre?: number; pourcentage?: number; };
  };
  caracteristiquesSociodemographiques?: {
    genre?: {
      masculin?: { nombre?: number; pourcentage?: number; };
      feminin?: { nombre?: number; pourcentage?: number; };
    };
    age?: {
      moins12ans?: { nombre?: number; pourcentage?: number; };
      moins18ans?: { nombre?: number; pourcentage?: number; };
      entre18et40?: { nombre?: number; pourcentage?: number; };
      plus40ans?: { nombre?: number; pourcentage?: number; };
    };
    nationalite?: {
      tunisienne?: { nombre?: number; pourcentage?: number; };
      maghrebine?: { nombre?: number; pourcentage?: number; };
      autres?: { nombre?: number; pourcentage?: number; };
    };
    etatCivil?: {
      celibataire?: { nombre?: number; pourcentage?: number; };
      marie?: { nombre?: number; pourcentage?: number; };
      divorce?: { nombre?: number; pourcentage?: number; };
      veuf?: { nombre?: number; pourcentage?: number; };
    };
    etatProfessionnel?: {
      eleve?: { nombre?: number; pourcentage?: number; };
      etudiant?: { nombre?: number; pourcentage?: number; };
      ouvrier?: { nombre?: number; pourcentage?: number; };
      fonctionnaire?: { nombre?: number; pourcentage?: number; };
    };
    niveauSocioeconomique?: {
      carteIndigent?: { nombre?: number; pourcentage?: number; };
      carnetCnamPublique?: { nombre?: number; pourcentage?: number; };
      carnetCnamFamille?: { nombre?: number; pourcentage?: number; };
      carnetCnamRemboursement?: { nombre?: number; pourcentage?: number; };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class OffreDroguesService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080/api';

  constructor(
      private http: HttpClient,
      private authService: AuthService // Assuming this service exists
  ) {}

  // Get all offre-drogues
  getAll(): Observable<OffreDroguesListItem[]> {
    return this.http.get<OffreDroguesListItem[]>(`${this.apiUrl}/offre-drogues`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des données:', error);
          return throwError(() => error);
        })
    );
  }

  // Get by ID
  getById(id: number): Observable<OffreDrogues> {
    return this.http.get<OffreDrogues>(`${this.apiUrl}/offre-drogues/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des données:', error);
          return throwError(() => error);
        })
    );
  }

  // Get by period
  getByPeriod(startDate: string, endDate: string): Observable<OffreDroguesListItem[]> {
    return this.http.get<OffreDroguesListItem[]>(
      `${this.apiUrl}/offre-drogues?startDate=${startDate}&endDate=${endDate}`, {
        headers: this.authService.getAuthHeaders()
      }
    ).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des données par période:', error);
        return throwError(() => error);
      })
    );
  }

  // Get last entry before a specific date
  getLastEntryBefore(date: string, currentId: number): Observable<OffreDrogues> {
    return this.http.get<OffreDrogues>(
      `${this.apiUrl}/offre-drogues/last-before?date=${date}&currentId=${currentId}`, {
        headers: this.authService.getAuthHeaders()
      }
    ).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement de la dernière saisie:', error);
        return throwError(() => error);
      })
    );
  }

  // Create new offre-drogues
  create(data: {
    id?: number;
    dateSaisie: string;
    quantitesDrogues: {
      cannabis: number | null;
      comprimesTableauA: number | null;
      ecstasyComprime: number | null;
      ecstasyPoudre: number | null;
      subutex: number | null;
      cocaine: number | null;
      heroine: number | null
    };
    personnesInculpees: {
      consommateur: { nombre: number | null; pourcentage: number | null };
      vendeur: { nombre: number | null; pourcentage: number | null };
      trafiquant: { nombre: number | null; pourcentage: number | null }
    };
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: { nombre: number | null; pourcentage: number | null };
        feminin: { nombre: number | null; pourcentage: number | null }
      };
      age: {
        moins12ans: { nombre: number | null; pourcentage: number | null };
        moins18ans: { nombre: number | null; pourcentage: number | null };
        entre18et40: { nombre: number | null; pourcentage: number | null };
        plus40ans: { nombre: number | null; pourcentage: number | null }
      };
      nationalite: {
        tunisienne: { nombre: number | null; pourcentage: number | null };
        maghrebine: { nombre: number | null; pourcentage: number | null };
        autres: { nombre: number | null; pourcentage: number | null }
      };
      etatCivil: {
        celibataire: { nombre: number | null; pourcentage: number | null };
        marie: { nombre: number | null; pourcentage: number | null };
        divorce: { nombre: number | null; pourcentage: number | null };
        veuf: { nombre: number | null; pourcentage: number | null }
      };
      etatProfessionnel: {
        eleve: { nombre: number | null; pourcentage: number | null };
        etudiant: { nombre: number | null; pourcentage: number | null };
        ouvrier: { nombre: number | null; pourcentage: number | null };
        fonctionnaire: { nombre: number | null; pourcentage: number | null }
      };
      niveauSocioeconomique: {
        carteIndigent: { nombre: number | null; pourcentage: number | null };
        carnetCnamPublique: { nombre: number | null; pourcentage: number | null };
        carnetCnamFamille: { nombre: number | null; pourcentage: number | null };
        carnetCnamRemboursement: { nombre: number | null; pourcentage: number | null }
      }
    }
  }): Observable<OffreDrogues> {
    const createRequest = this.mapToCreateRequest(data);

    return this.http.post<OffreDrogues>(`${this.apiUrl}/offre-drogues`, createRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors de la création:', error);
          return throwError(() => error);
        })
    );
  }

  // Update existing offre-drogues
  update(id: number, data: {
    id?: number;
    dateSaisie: string;
    quantitesDrogues: {
      cannabis: number | null;
      comprimesTableauA: number | null;
      ecstasyComprime: number | null;
      ecstasyPoudre: number | null;
      subutex: number | null;
      cocaine: number | null;
      heroine: number | null
    };
    personnesInculpees: {
      consommateur: { nombre: number | null; pourcentage: number | null };
      vendeur: { nombre: number | null; pourcentage: number | null };
      trafiquant: { nombre: number | null; pourcentage: number | null }
    };
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: { nombre: number | null; pourcentage: number | null };
        feminin: { nombre: number | null; pourcentage: number | null }
      };
      age: {
        moins12ans: { nombre: number | null; pourcentage: number | null };
        moins18ans: { nombre: number | null; pourcentage: number | null };
        entre18et40: { nombre: number | null; pourcentage: number | null };
        plus40ans: { nombre: number | null; pourcentage: number | null }
      };
      nationalite: {
        tunisienne: { nombre: number | null; pourcentage: number | null };
        maghrebine: { nombre: number | null; pourcentage: number | null };
        autres: { nombre: number | null; pourcentage: number | null }
      };
      etatCivil: {
        celibataire: { nombre: number | null; pourcentage: number | null };
        marie: { nombre: number | null; pourcentage: number | null };
        divorce: { nombre: number | null; pourcentage: number | null };
        veuf: { nombre: number | null; pourcentage: number | null }
      };
      etatProfessionnel: {
        eleve: { nombre: number | null; pourcentage: number | null };
        etudiant: { nombre: number | null; pourcentage: number | null };
        ouvrier: { nombre: number | null; pourcentage: number | null };
        fonctionnaire: { nombre: number | null; pourcentage: number | null }
      };
      niveauSocioeconomique: {
        carteIndigent: { nombre: number | null; pourcentage: number | null };
        carnetCnamPublique: { nombre: number | null; pourcentage: number | null };
        carnetCnamFamille: { nombre: number | null; pourcentage: number | null };
        carnetCnamRemboursement: { nombre: number | null; pourcentage: number | null }
      }
    }
  }): Observable<OffreDrogues> {
    const updateRequest = this.mapToUpdateRequest(data);

    return this.http.put<OffreDrogues>(`${this.apiUrl}/offre-drogues/${id}`, updateRequest, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors de la modification:', error);
          return throwError(() => error);
        })
    );
  }

  // Delete offre-drogues
  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/offre-drogues/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors de la suppression:', error);
          return throwError(() => error);
        })
    );
  }

  // Get statistics
  getStatistics(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/offre-drogues/statistics`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des statistiques:', error);
          return throwError(() => error);
        })
    );
  }

  private mapToCreateRequest(data: {
    id?: number;
    dateSaisie: string;
    quantitesDrogues: {
      cannabis: number | null;
      comprimesTableauA: number | null;
      ecstasyComprime: number | null;
      ecstasyPoudre: number | null;
      subutex: number | null;
      cocaine: number | null;
      heroine: number | null
    };
    personnesInculpees: {
      consommateur: { nombre: number | null; pourcentage: number | null };
      vendeur: { nombre: number | null; pourcentage: number | null };
      trafiquant: { nombre: number | null; pourcentage: number | null }
    };
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: { nombre: number | null; pourcentage: number | null };
        feminin: { nombre: number | null; pourcentage: number | null }
      };
      age: {
        moins12ans: { nombre: number | null; pourcentage: number | null };
        moins18ans: { nombre: number | null; pourcentage: number | null };
        entre18et40: { nombre: number | null; pourcentage: number | null };
        plus40ans: { nombre: number | null; pourcentage: number | null }
      };
      nationalite: {
        tunisienne: { nombre: number | null; pourcentage: number | null };
        maghrebine: { nombre: number | null; pourcentage: number | null };
        autres: { nombre: number | null; pourcentage: number | null }
      };
      etatCivil: {
        celibataire: { nombre: number | null; pourcentage: number | null };
        marie: { nombre: number | null; pourcentage: number | null };
        divorce: { nombre: number | null; pourcentage: number | null };
        veuf: { nombre: number | null; pourcentage: number | null }
      };
      etatProfessionnel: {
        eleve: { nombre: number | null; pourcentage: number | null };
        etudiant: { nombre: number | null; pourcentage: number | null };
        ouvrier: { nombre: number | null; pourcentage: number | null };
        fonctionnaire: { nombre: number | null; pourcentage: number | null }
      };
      niveauSocioeconomique: {
        carteIndigent: { nombre: number | null; pourcentage: number | null };
        carnetCnamPublique: { nombre: number | null; pourcentage: number | null };
        carnetCnamFamille: { nombre: number | null; pourcentage: number | null };
        carnetCnamRemboursement: { nombre: number | null; pourcentage: number | null }
      }
    }
  }): any {
    return {
      dateSaisie: data.dateSaisie,
      // Quantités de drogues
      cannabis: data.quantitesDrogues?.cannabis,
      comprimesTableauA: data.quantitesDrogues?.comprimesTableauA,
      ecstasyComprime: data.quantitesDrogues?.ecstasyComprime,
      ecstasyPoudre: data.quantitesDrogues?.ecstasyPoudre,
      subutex: data.quantitesDrogues?.subutex,
      cocaine: data.quantitesDrogues?.cocaine,
      heroine: data.quantitesDrogues?.heroine,
      // Personnes inculpées
      consommateurNombre: data.personnesInculpees?.consommateur?.nombre,
      consommateurPourcentage: data.personnesInculpees?.consommateur?.pourcentage,
      vendeurNombre: data.personnesInculpees?.vendeur?.nombre,
      vendeurPourcentage: data.personnesInculpees?.vendeur?.pourcentage,
      trafiquantNombre: data.personnesInculpees?.trafiquant?.nombre,
      trafiquantPourcentage: data.personnesInculpees?.trafiquant?.pourcentage,
      // Caractéristiques sociodémographiques - Genre
      masculinNombre: data.caracteristiquesSociodemographiques?.genre?.masculin?.nombre,
      masculinPourcentage: data.caracteristiquesSociodemographiques?.genre?.masculin?.pourcentage,
      femininNombre: data.caracteristiquesSociodemographiques?.genre?.feminin?.nombre,
      femininPourcentage: data.caracteristiquesSociodemographiques?.genre?.feminin?.pourcentage,
      // Age
      moins12ansNombre: data.caracteristiquesSociodemographiques?.age?.moins12ans?.nombre,
      moins12ansPourcentage: data.caracteristiquesSociodemographiques?.age?.moins12ans?.pourcentage,
      moins18ansNombre: data.caracteristiquesSociodemographiques?.age?.moins18ans?.nombre,
      moins18ansPourcentage: data.caracteristiquesSociodemographiques?.age?.moins18ans?.pourcentage,
      entre18et40Nombre: data.caracteristiquesSociodemographiques?.age?.entre18et40?.nombre,
      entre18et40Pourcentage: data.caracteristiquesSociodemographiques?.age?.entre18et40?.pourcentage,
      plus40ansNombre: data.caracteristiquesSociodemographiques?.age?.plus40ans?.nombre,
      plus40ansPourcentage: data.caracteristiquesSociodemographiques?.age?.plus40ans?.pourcentage,
      // Nationalité
      tunisienneNombre: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.nombre,
      tunisiennePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.tunisienne?.pourcentage,
      maghrebineNombre: data.caracteristiquesSociodemographiques?.nationalite?.maghrebine?.nombre,
      maghrebinePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.maghrebine?.pourcentage,
      autresNationaliteNombre: data.caracteristiquesSociodemographiques?.nationalite?.autres?.nombre,
      autresNationalitePourcentage: data.caracteristiquesSociodemographiques?.nationalite?.autres?.pourcentage,
      // État civil
      celibataireNombre: data.caracteristiquesSociodemographiques?.etatCivil?.celibataire?.nombre,
      celibatairePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.celibataire?.pourcentage,
      marieNombre: data.caracteristiquesSociodemographiques?.etatCivil?.marie?.nombre,
      mariePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.marie?.pourcentage,
      divorceNombre: data.caracteristiquesSociodemographiques?.etatCivil?.divorce?.nombre,
      divorcePourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.divorce?.pourcentage,
      veufNombre: data.caracteristiquesSociodemographiques?.etatCivil?.veuf?.nombre,
      veufPourcentage: data.caracteristiquesSociodemographiques?.etatCivil?.veuf?.pourcentage,
      // État professionnel
      eleveNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.eleve?.nombre,
      elevePourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.eleve?.pourcentage,
      etudiantNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.etudiant?.nombre,
      etudiantPourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.etudiant?.pourcentage,
      ouvrierNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.ouvrier?.nombre,
      ouvrierPourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.ouvrier?.pourcentage,
      fonctionnaireNombre: data.caracteristiquesSociodemographiques?.etatProfessionnel?.fonctionnaire?.nombre,
      fonctionnairePourcentage: data.caracteristiquesSociodemographiques?.etatProfessionnel?.fonctionnaire?.pourcentage,
      // Niveau socioéconomique
      carteIndigentNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.nombre,
      carteIndigentPourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carteIndigent?.pourcentage,
      carnetCnamPubliqueNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamPublique?.nombre,
      carnetCnamPubliquePourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamPublique?.pourcentage,
      carnetCnamFamilleNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamFamille?.nombre,
      carnetCnamFamillePourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamFamille?.pourcentage,
      carnetCnamRemboursementNombre: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamRemboursement?.nombre,
      carnetCnamRemboursementPourcentage: data.caracteristiquesSociodemographiques?.niveauSocioeconomique?.carnetCnamRemboursement?.pourcentage
    };
  }

  private mapToUpdateRequest(data: {
    id?: number;
    dateSaisie: string;
    quantitesDrogues: {
      cannabis: number | null;
      comprimesTableauA: number | null;
      ecstasyComprime: number | null;
      ecstasyPoudre: number | null;
      subutex: number | null;
      cocaine: number | null;
      heroine: number | null
    };
    personnesInculpees: {
      consommateur: { nombre: number | null; pourcentage: number | null };
      vendeur: { nombre: number | null; pourcentage: number | null };
      trafiquant: { nombre: number | null; pourcentage: number | null }
    };
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: { nombre: number | null; pourcentage: number | null };
        feminin: { nombre: number | null; pourcentage: number | null }
      };
      age: {
        moins12ans: { nombre: number | null; pourcentage: number | null };
        moins18ans: { nombre: number | null; pourcentage: number | null };
        entre18et40: { nombre: number | null; pourcentage: number | null };
        plus40ans: { nombre: number | null; pourcentage: number | null }
      };
      nationalite: {
        tunisienne: { nombre: number | null; pourcentage: number | null };
        maghrebine: { nombre: number | null; pourcentage: number | null };
        autres: { nombre: number | null; pourcentage: number | null }
      };
      etatCivil: {
        celibataire: { nombre: number | null; pourcentage: number | null };
        marie: { nombre: number | null; pourcentage: number | null };
        divorce: { nombre: number | null; pourcentage: number | null };
        veuf: { nombre: number | null; pourcentage: number | null }
      };
      etatProfessionnel: {
        eleve: { nombre: number | null; pourcentage: number | null };
        etudiant: { nombre: number | null; pourcentage: number | null };
        ouvrier: { nombre: number | null; pourcentage: number | null };
        fonctionnaire: { nombre: number | null; pourcentage: number | null }
      };
      niveauSocioeconomique: {
        carteIndigent: { nombre: number | null; pourcentage: number | null };
        carnetCnamPublique: { nombre: number | null; pourcentage: number | null };
        carnetCnamFamille: { nombre: number | null; pourcentage: number | null };
        carnetCnamRemboursement: { nombre: number | null; pourcentage: number | null }
      }
    }
  }): any {
    return this.mapToCreateRequest(data); // Même structure pour la mise à jour
  }
}
