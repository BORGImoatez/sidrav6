import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TypeStructure } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="signup-container">
      <div class="signup-card card">
        <div class="signup-header">
          <div class="logo-placeholder">
            <img src="../../../assets/logo/logoMS.png" alt="">
          </div>
          
          <h1 class="text-2xl font-bold text-center text-gray-900 mb-2">
            SIDRA
          </h1>
          
          <p class="text-center text-gray-600 mb-8">
            SYSTEME D'INFORMATION SUR LES DROGUES ET ADDICTIONS
          </p>

          <!-- Logos des partenaires -->
          <div class="partners-logos">
            <div class="logo-placeholder">
              <img src="../../../assets/logo/logos.png" alt="">
            </div>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="signup-form">
          <div class="form-group">
            <label for="typeStructure" class="form-label required">
              Type de structure
            </label>
            <select
                id="typeStructure"
                name="typeStructure"
                [(ngModel)]="signupData.typeStructure"
                class="form-select"
                [class.error]="showError && !signupData.typeStructure"
                required
                [disabled]="isLoading"
                (change)="onTypeStructureChange()"
            >
              <option value="">Sélectionner un type</option>
              <option value="PUBLIQUE">Publique</option>
              <option value="PRIVEE">Privée</option>
              <option value="ONG">ONG</option>
            </select>
            <div *ngIf="showError && !signupData.typeStructure" class="form-error">
              Le type de structure est requis
            </div>
          </div>

          <div class="form-group" *ngIf="signupData.typeStructure">
            <label for="structureId" class="form-label required">
              Structure
            </label>
            <select
                id="structureId"
                name="structureId"
                [(ngModel)]="signupData.structureId"
                class="form-select"
                [class.error]="showError && !signupData.structureId"
                required
                [disabled]="isLoading || !structures.length"
            >
              <option value="">Sélectionner une structure</option>
              <option *ngFor="let structure of structures" [value]="structure.id">
                {{ structure.nom }}
              </option>
            </select>
            <div *ngIf="showError && !signupData.structureId" class="form-error">
              La structure est requise
            </div>
            <div *ngIf="structures.length === 0 && signupData.typeStructure" class="form-info">
              Aucune structure disponible pour ce type
            </div>
          </div>

          <div class="form-group">
            <label for="nom" class="form-label required">
              Nom
            </label>
            <input
                type="text"
                id="nom"
                name="nom"
                [(ngModel)]="signupData.nom"
                class="form-input"
                [class.error]="showError && !signupData.nom"
                placeholder="Votre nom"
                required
                [disabled]="isLoading"
            >
            <div *ngIf="showError && !signupData.nom" class="form-error">
              Le nom est requis
            </div>
          </div>

          <div class="form-group">
            <label for="prenom" class="form-label required">
              Prénom
            </label>
            <input
                type="text"
                id="prenom"
                name="prenom"
                [(ngModel)]="signupData.prenom"
                class="form-input"
                [class.error]="showError && !signupData.prenom"
                placeholder="Votre prénom"
                required
                [disabled]="isLoading"
            >
            <div *ngIf="showError && !signupData.prenom" class="form-error">
              Le prénom est requis
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label required">
              Adresse email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="signupData.email"
                class="form-input"
                [class.error]="showError && !signupData.email"
                placeholder="exemple@email.com"
                required
                [disabled]="isLoading"
            >
            <div *ngIf="showError && !signupData.email" class="form-error">
              L'adresse email est requise
            </div>
          </div>

          <div class="form-group">
            <label for="telephone" class="form-label required">
              Numéro de téléphone
            </label>
            <input
                type="tel"
                id="telephone"
                name="telephone"
                [(ngModel)]="signupData.telephone"
                class="form-input"
                [class.error]="showError && !signupData.telephone"
                placeholder="21612345678"
                required
                [disabled]="isLoading"
            >
            <div *ngIf="showError && !signupData.telephone" class="form-error">
              Le numéro de téléphone est requis
            </div>
          </div>

          <div class="form-group">
            <label for="motDePasse" class="form-label required">
              Mot de passe
            </label>
            <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                [(ngModel)]="signupData.motDePasse"
                class="form-input"
                [class.error]="showError && !signupData.motDePasse"
                placeholder="••••••••"
                required
                [disabled]="isLoading"
            >
            <div *ngIf="showError && !signupData.motDePasse" class="form-error">
              Le mot de passe est requis
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-banner">
            <span>{{ errorMessage }}</span>
          </div>

          <div *ngIf="successMessage" class="success-banner">
            <span>{{ successMessage }}</span>
          </div>

          <button
              type="submit"
              class="btn btn-primary btn-lg w-full"
              [disabled]="isLoading"
          >
            <span *ngIf="!isLoading">S'inscrire</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="loading-spinner-sm"></div>
              Inscription en cours...
            </span>
          </button>
        </form>

        <div class="signup-footer">
          <p class="text-center mt-4">
            Vous avez déjà un compte ? 
            <a href="/login" class="text-primary-600 hover:underline">Se connecter</a>
          </p>
          <p class="text-xs text-gray-500 text-center mt-4">
            Pour toute assistance technique, contactez votre administrateur
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      padding: var(--spacing-4);
    }

    .signup-card {
      width: 100%;
      max-width: 480px;
      padding: var(--spacing-8);
      background: white;
      box-shadow: var(--shadow-xl);
      border: none;
    }

    .signup-header {
      margin-bottom: var(--spacing-8);
    }

    .partners-logos {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-6);
      padding: var(--spacing-4);
      background: var(--gray-50);
      border-radius: var(--radius-md);
    }

    .logo-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      background: white;
      text-align: center;
      transition: border-color 0.2s ease-in-out;
    }

    .signup-form {
      margin-bottom: var(--spacing-6);
    }

    .error-banner {
      background-color: var(--error-50);
      border: 1px solid var(--error-200);
      color: var(--error-700);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
      font-size: 14px;
    }

    .success-banner {
      background-color: #d1fae5;
      border: 1px solid #6ee7b7;
      color: #065f46;
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
      font-size: 14px;
    }

    .form-info {
      font-size: 12px;
      color: var(--gray-500);
      margin-top: var(--spacing-2);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .signup-footer {
      border-top: 1px solid var(--gray-200);
      padding-top: var(--spacing-4);
    }

    @media (max-width: 480px) {
      .signup-card {
        padding: var(--spacing-6);
      }
      
      .partners-logos {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .logo-placeholder {
        height: 50px;
      }
    }
  `]
})
export class SignupComponent implements OnInit {
  signupData = {
    typeStructure: '',
    structureId: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    role: 'UTILISATEUR' // Toujours UTILISATEUR pour l'inscription publique
  };

  structures: any[] = [];
  isLoading = false;
  showError = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Rien à faire lors de l'initialisation
  }

  onTypeStructureChange(): void {
    if (this.signupData.typeStructure) {
      this.isLoading = true;
      this.signupData.structureId = '';
      
      this.userService.getStructuresByType(this.signupData.typeStructure as TypeStructure).subscribe({
        next: (structures) => {
          this.structures = structures;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des structures:', error);
          this.structures = [];
          this.isLoading = false;
        }
      });
    } else {
      this.structures = [];
    }
  }

  onSubmit(): void {
    this.showError = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const signupRequest = {
      nom: this.signupData.nom,
      prenom: this.signupData.prenom,
      email: this.signupData.email,
      telephone: this.signupData.telephone,
      motDePasse: this.signupData.motDePasse,
      role: this.signupData.role,
      structureId: Number(this.signupData.structureId)
    };

    this.userService.signup(signupRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Votre demande d\'inscription a été envoyée avec succès. Un administrateur examinera votre demande.';
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        }
        
        console.error('Erreur d\'inscription:', error);
      }
    });
  }

  private validateForm(): boolean {
    return !!(
      this.signupData.typeStructure &&
      this.signupData.structureId &&
      this.signupData.nom &&
      this.signupData.prenom &&
      this.signupData.email &&
      this.signupData.telephone &&
      this.signupData.motDePasse
    );
  }

  private resetForm(): void {
    this.signupData = {
      typeStructure: '',
      structureId: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      motDePasse: '',
      role: 'UTILISATEUR'
    };
    this.showError = false;
  }
}