import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OffreDroguesService } from '../../../../services/offre-drogues.service';
import { OffreDrogues } from '../../../../models/offre-drogues.model';

@Component({
  selector: 'app-saisie-offre-drogues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="saisie-container">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            {{ isEditMode ? 'Modifier les indicateurs' : 'Nouveaux indicateurs' }} - Offre de drogues
          </h1>
          <p class="page-description">
            Saisir les données relatives aux indicateurs de l'offre de drogues
          </p>
        </div>
        <button
            class="btn btn-secondary"
            (click)="goBack()"
            type="button"
        >
          ← Retour
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" #offreForm="ngForm" class="saisie-form">
        <!-- Date de saisie -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">Informations générales</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="form-label required">Date de saisie de l'offre</label>
              <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="formData.dateSaisie"
                  name="dateSaisie"
                  required
                  [disabled]="isSaving"
              >
            </div>
          </div>
        </div>

        <!-- Section 1: Quantité de drogues saisies -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">1. Quantité de drogues saisies selon la substance</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                <tr>
                  <th>Nature de la substance saisie</th>
                  <th>Quantité saisie</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Cannabis (kg)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.cannabis"
                        name="cannabis"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Comprimés Tableau A</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.comprimesTableauA"
                        name="comprimesTableauA"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Ecstasy (comprimé)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.ecstasyComprime"
                        name="ecstasyComprime"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Ecstasy (poudre ; en g)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.ecstasyPoudre"
                        name="ecstasyPoudre"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Subutex (comprimé)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.subutex"
                        name="subutex"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Cocaïne (g)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.cocaine"
                        name="cocaine"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Héroïne (g)</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.quantitesDrogues.heroine"
                        name="heroine"
                        step="0.1"
                        min="0"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Section 2: Répartition des personnes inculpées selon la nature d'accusation -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">2. Répartition des personnes inculpées selon la nature d'accusation</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                <tr>
                  <th>Nature d'accusation</th>
                  <th>Nombre</th>
                  <th>%</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Consommateur</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.consommateur.nombre"
                        name="consommateurNombre"
                        min="0"
                        placeholder="0"
                        (input)="calculatePercentage('consommateur')"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.consommateur.pourcentage"
                        name="consommateurPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Vendeur</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.vendeur.nombre"
                        name="vendeurNombre"
                        min="0"
                        placeholder="0"
                        (input)="calculatePercentage('vendeur')"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.vendeur.pourcentage"
                        name="vendeurPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td>Trafiquant</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.trafiquant.nombre"
                        name="trafiquantNombre"
                        min="0"
                        placeholder="0"
                        (input)="calculatePercentage('trafiquant')"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.personnesInculpees.trafiquant.pourcentage"
                        name="trafiquantPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Section 3: Caractéristiques sociodémographiques -->
        <div class="form-section card">
          <div class="card-header">
            <h3 class="section-title">3. Répartition des personnes inculpées selon les caractéristiques sociodémographiques</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                <tr>
                  <th>Caractéristiques sociodémographiques</th>
                  <th>Nombre</th>
                  <th>%</th>
                </tr>
                </thead>
                <tbody>
                <!-- Genre -->
                <tr class="category-header">
                  <td colspan="3"><strong>Genre</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Masculin</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.masculin.nombre"
                        name="masculinNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.masculin.pourcentage"
                        name="masculinPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Féminin</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.feminin.nombre"
                        name="femininNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.genre.feminin.pourcentage"
                        name="femininPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>

                <!-- Age -->
                <tr class="category-header">
                  <td colspan="3"><strong>Age</strong></td>
                </tr>
                <tr>
                  <td class="subcategory"><12 ans</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins12ans.nombre"
                        name="moins12ansNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins12ans.pourcentage"
                        name="moins12ansPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory"><18 ans</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins18ans.nombre"
                        name="moins18ansNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.moins18ans.pourcentage"
                        name="moins18ansPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">18-40</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.entre18et40.nombre"
                        name="entre18et40Nombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.entre18et40.pourcentage"
                        name="entre18et40Pourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">> 40</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.plus40ans.nombre"
                        name="plus40ansNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.age.plus40ans.pourcentage"
                        name="plus40ansPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>

                <!-- Nationalité -->
                <tr class="category-header">
                  <td colspan="3"><strong>Nationalité</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Tunisienne</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.tunisienne.nombre"
                        name="tunisienneNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.tunisienne.pourcentage"
                        name="tunisiennePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Maghrébine</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.maghrebine.nombre"
                        name="maghrebineNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.maghrebine.pourcentage"
                        name="maghrebinePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Autres</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.autres.nombre"
                        name="autresNationaliteNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.nationalite.autres.pourcentage"
                        name="autresNationalitePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>

                <!-- État civil -->
                <tr class="category-header">
                  <td colspan="3"><strong>État civil</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Célibataire</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.celibataire.nombre"
                        name="celibataireNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.celibataire.pourcentage"
                        name="celibatairePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Marié</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.marie.nombre"
                        name="marieNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.marie.pourcentage"
                        name="mariePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Divorcé</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.divorce.nombre"
                        name="divorceNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.divorce.pourcentage"
                        name="divorcePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Veuf</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.veuf.nombre"
                        name="veufNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatCivil.veuf.pourcentage"
                        name="veufPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>

                <!-- État professionnel -->
                <tr class="category-header">
                  <td colspan="3"><strong>État professionnel</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Élève</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.eleve.nombre"
                        name="eleveNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.eleve.pourcentage"
                        name="elevePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Étudiant</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.nombre"
                        name="etudiantNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.etudiant.pourcentage"
                        name="etudiantPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Ouvrier</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.nombre"
                        name="ouvrierNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.ouvrier.pourcentage"
                        name="ouvrierPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">Fonctionnaire</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.nombre"
                        name="fonctionnaireNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.etatProfessionnel.fonctionnaire.pourcentage"
                        name="fonctionnairePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>

                <!-- Niveau socioéconomique -->
                <tr class="category-header">
                  <td colspan="3"><strong>Niveau socioéconomique selon carnet du CNAM</strong></td>
                </tr>
                <tr>
                  <td class="subcategory">Carte d'indigent 1 ou 2 ou carte AMEN</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.nombre"
                        name="carteIndigentNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carteIndigent.pourcentage"
                        name="carteIndigentPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de santé publique</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.nombre"
                        name="carnetCnamPubliqueNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamPublique.pourcentage"
                        name="carnetCnamPubliquePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de médecine de famille</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.nombre"
                        name="carnetCnamFamilleNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamFamille.pourcentage"
                        name="carnetCnamFamillePourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                <tr>
                  <td class="subcategory">CARNET CNAM de remboursement</td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.nombre"
                        name="carnetCnamRemboursementNombre"
                        min="0"
                        placeholder="0"
                        [disabled]="isSaving"
                    >
                  </td>
                  <td>
                    <input
                        type="number"
                        class="form-input table-input"
                        [(ngModel)]="formData.caracteristiquesSociodemographiques.niveauSocioeconomique.carnetCnamRemboursement.pourcentage"
                        name="carnetCnamRemboursementPourcentage"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        [disabled]="isSaving"
                    >
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions card">
          <div class="card-body">
            <div class="actions-buttons">
              <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="goBack()"
                  [disabled]="isSaving"
              >
                Annuler
              </button>
              <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="!offreForm.valid || isSaving"
              >
                <span *ngIf="!isSaving">{{ isEditMode ? 'Modifier' : 'Enregistrer' }}</span>
                <span *ngIf="isSaving" class="flex items-center gap-2">
              <div class="loading-spinner-sm"></div>
                  {{ isEditMode ? 'Modification...' : 'Enregistrement...' }}
            </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .saisie-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-6);
      gap: var(--spacing-4);
    }

    .header-content {
      flex: 1;
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

    .form-section {
      margin-bottom: var(--spacing-6);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-4);
    }

    .data-table th {
      background-color: var(--gray-50);
      padding: var(--spacing-4);
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: var(--gray-700);
      border: 1px solid var(--gray-200);
    }

    .data-table td {
      padding: var(--spacing-3);
      border: 1px solid var(--gray-200);
      vertical-align: middle;
    }

    .category-header td {
      background-color: var(--primary-50);
      font-weight: 600;
      color: var(--primary-800);
    }

    .subcategory {
      padding-left: var(--spacing-6) !important;
      font-style: italic;
      color: var(--gray-700);
    }

    .table-input {
      width: 100%;
      min-width: 80px;
      padding: var(--spacing-2);
      font-size: 14px;
    }

    .form-actions {
      position: sticky;
      bottom: var(--spacing-4);
      z-index: 10;
    }

    .actions-buttons {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-4);
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .data-table {
        font-size: 12px;
      }
      
      .data-table th,
      .data-table td {
        padding: var(--spacing-2);
      }
      
      .table-input {
        min-width: 60px;
        padding: var(--spacing-1);
        font-size: 12px;
      }
      
      .actions-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class SaisieOffreDroguesComponent implements OnInit {
  formData: {
    id?: number;
    dateSaisie: string;
    quantitesDrogues: {
      cannabis: number | null;
      comprimesTableauA: number | null;
      ecstasyComprime: number | null;
      ecstasyPoudre: number | null;
      subutex: number | null;
      cocaine: number | null;
      heroine: number | null;
    };
    personnesInculpees: {
      consommateur: { nombre: number | null; pourcentage: number | null };
      vendeur: { nombre: number | null; pourcentage: number | null };
      trafiquant: { nombre: number | null; pourcentage: number | null };
    };
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: { nombre: number | null; pourcentage: number | null };
        feminin: { nombre: number | null; pourcentage: number | null };
      };
      age: {
        moins12ans: { nombre: number | null; pourcentage: number | null };
        moins18ans: { nombre: number | null; pourcentage: number | null };
        entre18et40: { nombre: number | null; pourcentage: number | null };
        plus40ans: { nombre: number | null; pourcentage: number | null };
      };
      nationalite: {
        tunisienne: { nombre: number | null; pourcentage: number | null };
        maghrebine: { nombre: number | null; pourcentage: number | null };
        autres: { nombre: number | null; pourcentage: number | null };
      };
      etatCivil: {
        celibataire: { nombre: number | null; pourcentage: number | null };
        marie: { nombre: number | null; pourcentage: number | null };
        divorce: { nombre: number | null; pourcentage: number | null };
        veuf: { nombre: number | null; pourcentage: number | null };
      };
      etatProfessionnel: {
        eleve: { nombre: number | null; pourcentage: number | null };
        etudiant: { nombre: number | null; pourcentage: number | null };
        ouvrier: { nombre: number | null; pourcentage: number | null };
        fonctionnaire: { nombre: number | null; pourcentage: number | null };
      };
      niveauSocioeconomique: {
        carteIndigent: { nombre: number | null; pourcentage: number | null };
        carnetCnamPublique: { nombre: number | null; pourcentage: number | null };
        carnetCnamFamille: { nombre: number | null; pourcentage: number | null };
        carnetCnamRemboursement: { nombre: number | null; pourcentage: number | null };
      };
    };
  } = {
    dateSaisie: "",
    quantitesDrogues: {
      cannabis: null,
      comprimesTableauA: null,
      ecstasyComprime: null,
      ecstasyPoudre: null,
      subutex: null,
      cocaine: null,
      heroine: null
    },
    personnesInculpees: {
      consommateur: {
        nombre: null,
        pourcentage: null
      },
      vendeur: {
        nombre: null,
        pourcentage: null
      },
      trafiquant: {
        nombre: null,
        pourcentage: null
      }
    },
    caracteristiquesSociodemographiques: {
      genre: {
        masculin: {
          nombre: null,
          pourcentage: null
        },
        feminin: {
          nombre: null,
          pourcentage: null
        }
      },
      age: {
        moins12ans: {
          nombre: null,
          pourcentage: null
        },
        moins18ans: {
          nombre: null,
          pourcentage: null
        },
        entre18et40: {
          nombre: null,
          pourcentage: null
        },
        plus40ans: {
          nombre: null,
          pourcentage: null
        }
      },
      nationalite: {
        tunisienne: {
          nombre: null,
          pourcentage: null
        },
        maghrebine: {
          nombre: null,
          pourcentage: null
        },
        autres: {
          nombre: null,
          pourcentage: null
        }
      },
      etatCivil: {
        celibataire: {
          nombre: null,
          pourcentage: null
        },
        marie: {
          nombre: null,
          pourcentage: null
        },
        divorce: {
          nombre: null,
          pourcentage: null
        },
        veuf: {
          nombre: null,
          pourcentage: null
        }
      },
      etatProfessionnel: {
        eleve: {
          nombre: null,
          pourcentage: null
        },
        etudiant: {
          nombre: null,
          pourcentage: null
        },
        ouvrier: {
          nombre: null,
          pourcentage: null
        },
        fonctionnaire: {
          nombre: null,
          pourcentage: null
        }
      },
      niveauSocioeconomique: {
        carteIndigent: {
          nombre: null,
          pourcentage: null
        },
        carnetCnamPublique: {
          nombre: null,
          pourcentage: null
        },
        carnetCnamFamille: {
          nombre: null,
          pourcentage: null
        },
        carnetCnamRemboursement: {
          nombre: null,
          pourcentage: null
        }
      }
    }
  };
  isEditMode = false;
  isSaving = false;
  itemId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private offreDroguesService: OffreDroguesService
  ) {}

  ngOnInit(): void {
    this.initializeFormData();
    
    // Vérifier si c'est un mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.itemId = +params['id'];
        this.isEditMode = true;
        this.loadData();
      }
    });
  }

  private initializeFormData(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.formData = {
      dateSaisie: new Date(today).toString(),
      quantitesDrogues: {
        cannabis: null,
        comprimesTableauA: null,
        ecstasyComprime: null,
        ecstasyPoudre: null,
        subutex: null,
        cocaine: null,
        heroine: null
      },
      personnesInculpees: {
        consommateur: { nombre: null, pourcentage: null },
        vendeur: { nombre: null, pourcentage: null },
        trafiquant: { nombre: null, pourcentage: null }
      },
      caracteristiquesSociodemographiques: {
        genre: {
          masculin: { nombre: null, pourcentage: null },
          feminin: { nombre: null, pourcentage: null }
        },
        age: {
          moins12ans: { nombre: null, pourcentage: null },
          moins18ans: { nombre: null, pourcentage: null },
          entre18et40: { nombre: null, pourcentage: null },
          plus40ans: { nombre: null, pourcentage: null }
        },
        nationalite: {
          tunisienne: { nombre: null, pourcentage: null },
          maghrebine: { nombre: null, pourcentage: null },
          autres: { nombre: null, pourcentage: null }
        },
        etatCivil: {
          celibataire: { nombre: null, pourcentage: null },
          marie: { nombre: null, pourcentage: null },
          divorce: { nombre: null, pourcentage: null },
          veuf: { nombre: null, pourcentage: null }
        },
        etatProfessionnel: {
          eleve: { nombre: null, pourcentage: null },
          etudiant: { nombre: null, pourcentage: null },
          ouvrier: { nombre: null, pourcentage: null },
          fonctionnaire: { nombre: null, pourcentage: null }
        },
        niveauSocioeconomique: {
          carteIndigent: { nombre: null, pourcentage: null },
          carnetCnamPublique: { nombre: null, pourcentage: null },
          carnetCnamFamille: { nombre: null, pourcentage: null },
          carnetCnamRemboursement: { nombre: null, pourcentage: null }
        }
      }
    };
  }

  private loadData(): void {
    if (!this.itemId) return;

    this.offreDroguesService.getById(this.itemId).subscribe({
      next: (data) => {
        if (data) {
          // @ts-ignore
          this.formData = { ...data };
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.router.navigate(['/offre-drogues']);
      }
    });
  }

  calculatePercentage(type: 'consommateur' | 'vendeur' | 'trafiquant'): void {
    if(this.formData)
    {
    const total = (this.formData.personnesInculpees?.consommateur.nombre || 0) +
                  (this.formData.personnesInculpees?.vendeur.nombre || 0) +
                  (this.formData.personnesInculpees?.trafiquant.nombre || 0);

    if (total > 0) {
      const nombre = this.formData.personnesInculpees?.[type].nombre || 0;
      const pourcentage = (nombre / total) * 100;
      this.formData.personnesInculpees![type].pourcentage = Math.round(pourcentage * 10) / 10;
    }
    }
  }

  onSubmit(): void {
    if (!this.formData.dateSaisie) {
      return;
    }

    this.isSaving = true;

    const operation = this.isEditMode && this.itemId
      ? this.offreDroguesService.update(this.itemId, this.formData)
      : this.offreDroguesService.create(this.formData);

    operation.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.router.navigate(['/offre-drogues']);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Erreur lors de la sauvegarde:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/offre-drogues']);
  }
}
