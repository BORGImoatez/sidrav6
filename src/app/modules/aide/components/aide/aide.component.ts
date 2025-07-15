import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="aide-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Guide d'utilisation</h1>
          <p class="page-description">
            Documentation et aide pour l'utilisation de SIDRA
          </p>
        </div>
      </div>

      <div class="help-sections">
        <div class="help-section card">
          <div class="card-header">
            <h3 class="section-title">🚀 Premiers pas</h3>
          </div>
          <div class="card-body">
            <div class="help-content">
              <h4>Connexion au système</h4>
              <p>
                Pour vous connecter à SIDRA, utilisez votre numéro de téléphone et votre mot de passe.
                Un code OTP vous sera envoyé par SMS pour sécuriser votre connexion.
              </p>
              
              <h4>Navigation</h4>
              <p>
                Utilisez le menu latéral pour naviguer entre les différentes sections :
              </p>
              <ul>
                <li><strong>Tableau de bord</strong> : Vue d'ensemble et statistiques</li>
                <li><strong>Nouveau formulaire</strong> : Saisir les données d'un nouvel usager</li>
                <li><strong>Mes formulaires</strong> : Consulter vos saisies précédentes</li>
                <li><strong>Administration</strong> : Gestion des utilisateurs (selon vos droits)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="help-section card">
          <div class="card-header">
            <h3 class="section-title">📝 Saisie des formulaires</h3>
          </div>
          <div class="card-body">
            <div class="help-content">
              <h4>Processus de saisie</h4>
              <p>
                Le formulaire SIDRA est organisé en 6 étapes successives :
              </p>
              <ol>
                <li>Informations sur la structure/centre et l'usager SPA</li>
                <li>Consommation de tabac/produits tabagiques et alcool</li>
                <li>Consommation de substances psychoactives (hors tabac et alcool)</li>
                <li>Comportements liés à la consommation et tests de dépistage</li>
                <li>Comorbidités</li>
                <li>Décès induit par les SPA dans l'entourage</li>
              </ol>
              
              <h4>Règles de validation</h4>
              <ul>
                <li>Tous les champs sont obligatoires sauf indication contraire</li>
                <li>Les champs "Autre" ne sont obligatoires que s'ils sont affichés</li>
                <li>Les champs conditionnels deviennent obligatoires dès qu'ils sont visibles</li>
                <li>Certains champs sont pré-remplis automatiquement selon votre profil</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="help-section card">
          <div class="card-header">
            <h3 class="section-title">👥 Gestion des utilisateurs</h3>
          </div>
          <div class="card-body">
            <div class="help-content">
              <h4>Hiérarchie des rôles</h4>
              <ul>
                <li><strong>Super Administrateur</strong> : Accès complet au système, gestion de toutes les structures</li>
                <li><strong>Administrateur Structure</strong> : Gestion des utilisateurs de sa structure</li>
                <li><strong>Utilisateur</strong> : Saisie et consultation des formulaires</li>
              </ul>
              
              <h4>Création d'utilisateurs</h4>
              <p>
                Les administrateurs peuvent créer de nouveaux comptes utilisateurs en renseignant :
              </p>
              <ul>
                <li>Nom et prénom</li>
                <li>Numéro de téléphone (identifiant de connexion)</li>
                <li>Rôle dans le système</li>
                <li>Structure d'appartenance</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="help-section card">
          <div class="card-header">
            <h3 class="section-title">🔒 Sécurité</h3>
          </div>
          <div class="card-body">
            <div class="help-content">
              <h4>Authentification à deux facteurs (2FA)</h4>
              <p>
                SIDRA utilise un système de double authentification pour garantir la sécurité :
              </p>
              <ul>
                <li>Saisie de vos identifiants (téléphone + mot de passe)</li>
                <li>Validation par code OTP envoyé par SMS</li>
                <li>Blocage temporaire en cas de tentatives répétées</li>
              </ul>
              
              <h4>Bonnes pratiques</h4>
              <ul>
                <li>Ne partagez jamais vos identifiants de connexion</li>
                <li>Déconnectez-vous toujours après utilisation</li>
                <li>Signalez tout problème de sécurité à votre administrateur</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="help-section card">
          <div class="card-header">
            <h3 class="section-title">❓ Support technique</h3>
          </div>
          <div class="card-body">
            <div class="help-content">
              <h4>En cas de problème</h4>
              <p>
                Si vous rencontrez des difficultés techniques :
              </p>
              <ol>
                <li>Vérifiez votre connexion internet</li>
                <li>Actualisez la page de votre navigateur</li>
                <li>Contactez votre administrateur de structure</li>
                <li>En dernier recours, contactez le support technique national</li>
              </ol>
              
              <h4>Informations système</h4>
              <p>
                SIDRA est optimisé pour fonctionner sur :
              </p>
              <ul>
                <li>Navigateurs modernes (Chrome, Firefox, Safari, Edge)</li>
                <li>Appareils mobiles et tablettes</li>
                <li>Connexions internet standard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .aide-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-8);
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-2) 0;
    }

    .page-description {
      color: var(--gray-600);
      font-size: 16px;
      margin: 0;
    }

    .help-sections {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .help-section {
      border: 1px solid var(--gray-200);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .help-content h4 {
      font-size: 16px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 var(--spacing-3) 0;
    }

    .help-content h4:not(:first-child) {
      margin-top: var(--spacing-6);
    }

    .help-content p {
      color: var(--gray-700);
      line-height: 1.6;
      margin: 0 0 var(--spacing-4) 0;
    }

    .help-content ul,
    .help-content ol {
      color: var(--gray-700);
      line-height: 1.6;
      margin: 0 0 var(--spacing-4) 0;
      padding-left: var(--spacing-6);
    }

    .help-content li {
      margin-bottom: var(--spacing-2);
    }

    .help-content strong {
      color: var(--gray-900);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .help-content ul,
      .help-content ol {
        padding-left: var(--spacing-4);
      }
    }
  `]
})
export class AideComponent {
}