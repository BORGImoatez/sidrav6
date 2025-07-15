export interface OffreDrogues {
  id?: number;
  dateSaisie: Date;
  structureId?: number;
  structure?: {
    id: number;
    nom: string;
    type: string;
  };
  utilisateurId?: number;
  utilisateur?: {
    id: number;
    nom: string;
    prenom: string;
  };

  // 1. Quantité de drogues saisies selon la substance
  quantitesDrogues: {
    cannabis: number | null;
    comprimesTableauA: number | null;
    ecstasyComprime: number | null;
    ecstasyPoudre: number | null;
    subutex: number | null;
    cocaine: number | null;
    heroine: number | null;
  };

  // 2. Répartition des personnes inculpées selon la nature d'accusation
  personnesInculpees: {
    consommateur: {
      nombre: number | null;
      pourcentage: number | null;
    };
    vendeur: {
      nombre: number | null;
      pourcentage: number | null;
    };
    trafiquant: {
      nombre: number | null;
      pourcentage: number | null;
    };
  };

  // 3. Répartition selon les caractéristiques sociodémographiques
  caracteristiquesSociodemographiques: {
    genre: {
      masculin: {
        nombre: number | null;
        pourcentage: number | null;
      };
      feminin: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
    age: {
      moins12ans: {
        nombre: number | null;
        pourcentage: number | null;
      };
      moins18ans: {
        nombre: number | null;
        pourcentage: number | null;
      };
      entre18et40: {
        nombre: number | null;
        pourcentage: number | null;
      };
      plus40ans: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
    nationalite: {
      tunisienne: {
        nombre: number | null;
        pourcentage: number | null;
      };
      maghrebine: {
        nombre: number | null;
        pourcentage: number | null;
      };
      autres: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
    etatCivil: {
      celibataire: {
        nombre: number | null;
        pourcentage: number | null;
      };
      marie: {
        nombre: number | null;
        pourcentage: number | null;
      };
      divorce: {
        nombre: number | null;
        pourcentage: number | null;
      };
      veuf: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
    etatProfessionnel: {
      eleve: {
        nombre: number | null;
        pourcentage: number | null;
      };
      etudiant: {
        nombre: number | null;
        pourcentage: number | null;
      };
      ouvrier: {
        nombre: number | null;
        pourcentage: number | null;
      };
      fonctionnaire: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
    niveauSocioeconomique: {
      carteIndigent: {
        nombre: number | null;
        pourcentage: number | null;
      };
      carnetCnamPublique: {
        nombre: number | null;
        pourcentage: number | null;
      };
      carnetCnamFamille: {
        nombre: number | null;
        pourcentage: number | null;
      };
      carnetCnamRemboursement: {
        nombre: number | null;
        pourcentage: number | null;
      };
    };
  };

  dateCreation?: Date;
  dateModification?: Date;
}

export interface OffreDroguesListItem {
  id: number;
  dateSaisie: Date;
  structure: {
    id: number;
    nom: string;
    type: string;
  };
  utilisateur: {
    id: number;
    nom: string;
    prenom: string;
  };
  dateCreation: Date;
}
