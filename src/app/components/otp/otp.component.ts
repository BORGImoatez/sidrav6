import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OtpRequest } from '../../models/user.model';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="otp-container">
      <div class="otp-card card">
        <div class="otp-header">
          
          <h1 class="text-2xl font-bold text-center text-gray-900 mb-2">
            SYSTEME D’INFORMATION SUR LES DROGUES ET ADDICTIONS

          </h1>
 
          <h2 class="text-xl font-semibold text-center text-gray-900 mb-2" style="color: red">
            Vérification OTP
          </h2>
          <p class="text-center text-gray-600 mb-6">
            Un code à 6 chiffres a été envoyé par SMS.<br>
            <span class="text-sm text-gray-500">Saisissez-le ci-dessous pour continuer.</span>
          </p>
        </div>

        <div class="otp-form">
          <form [formGroup]="otpForm">
            <div class="otp-inputs">
              <ng-container *ngFor="let control of otpControls; let i = index">
                <input
                    type="text"
                    maxlength="1"
                    class="otp-input"
                    [formControlName]="'digit' + (i + 1)"
                    (keydown)="onKeyDown($event, i)"
                    (input)="onInput(i)"
                    (paste)="onPaste($event)"
                    #otpInput
                    [disabled]="isLoading"
                    autocomplete="off"
                >
              </ng-container>
            </div>
          </form>

          <div *ngIf="errorMessage" class="error-banner">
            <span>{{ errorMessage }}</span>
            <div *ngIf="remainingAttempts !== null" class="text-sm mt-1">
              Tentatives restantes: {{ remainingAttempts }}
            </div>
            <div *ngIf="blockedUntil" class="text-sm mt-1">
              Nouveau code disponible dans {{ getBlockedTimeRemaining() }}
            </div>
          </div>

          <div *ngIf="successMessage" class="success-banner">
            {{ successMessage }}
          </div>

          <button
              type="button"
              (click)="verifyOtp()"
              class="btn btn-primary btn-lg w-full"
              [disabled]="isLoading || !isOtpComplete() || isBlocked"
          >
            <span *ngIf="!isLoading">Vérifier</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <div class="loading-spinner-sm"></div>
              Vérification...
            </span>
          </button>

          <div class="otp-actions">
            <button
                type="button"
                (click)="resendCode()"
                class="btn btn-secondary"
                [disabled]="isLoading || canResendIn > 0"
            >
              <span *ngIf="canResendIn === 0">Renvoyer le code</span>
              <span *ngIf="canResendIn > 0">Renvoyer dans {{ canResendIn }}s</span>
            </button>

            <button
                type="button"
                (click)="goBack()"
                class="btn btn-secondary"
                [disabled]="isLoading"
            >
              Retour
            </button>
          </div>

          <div class="timer-info" *ngIf="timeRemaining > 0">
            <div class="timer-bar">
              <div class="timer-progress" [style.width.%]="(timeRemaining / 300) * 100"></div>
            </div>
            <p class="text-xs text-gray-500 text-center mt-2">
              Code expire dans {{ formatTime(timeRemaining) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .otp-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      padding: var(--spacing-4);
    }

    .otp-card {
      width: 100%;
      max-width: 420px;
      padding: var(--spacing-8);
      background: white;
      box-shadow: var(--shadow-xl);
      border: none;
    }

    .otp-header {
      margin-bottom: var(--spacing-6);
    }

    .otp-inputs {
      display: flex;
      gap: var(--spacing-3);
      justify-content: center;
      margin-bottom: var(--spacing-6);
    }

    .otp-input {
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      border: 2px solid var(--gray-300);
      border-radius: var(--radius-md);
      background: white;
      transition: all 0.2s ease-in-out;
    }

    .otp-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
      transform: scale(1.05);
    }

    .otp-input.error {
      border-color: var(--error-500);
      background-color: var(--error-50);
    }

    .otp-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
      background-color: var(--success-500);
      border: 1px solid var(--success-600);
      color: var(--success-600);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-4);
      font-size: 14px;
    }

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .otp-actions {
      display: flex;
      gap: var(--spacing-3);
      margin-top: var(--spacing-4);
    }

    .otp-actions .btn {
      flex: 1;
    }

    .timer-info {
      margin-top: var(--spacing-6);
      padding-top: var(--spacing-4);
      border-top: 1px solid var(--gray-200);
    }

    .timer-bar {
      width: 100%;
      height: 4px;
      background-color: var(--gray-200);
      border-radius: 2px;
      overflow: hidden;
    }

    .timer-progress {
      height: 100%;
      background: linear-gradient(90deg, var(--success-500), var(--warning-500), var(--error-500));
      transition: width 1s linear;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .otp-card {
        padding: var(--spacing-6);
      }

      .otp-input {
        width: 45px;
        height: 45px;
        font-size: 16px;
      }

      .otp-inputs {
        gap: var(--spacing-2);
      }
    }
  `]
})
export class OtpComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpForm!: FormGroup;
  otpControls = Array(6).fill(0);
  userId: number = 0;
  isLoading = false;
  showError = false;
  errorMessage = '';
  successMessage = '';
  remainingAttempts: number | null = null;
  blockedUntil: Date | null = null;
  isBlocked = false;

  timeRemaining = 300; // 5 minutes
  canResendIn = 0;

  private timers: any[] = [];

  constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Récupérer l'ID utilisateur depuis les paramètres de requête
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      if (!this.userId) {
        this.router.navigate(['/login']);
        return;
      }
    });

    // Démarrer le timer d'expiration
    this.startExpirationTimer();

    // Timer pour les tentatives de renvoi
    this.canResendIn = 30;
    this.startResendTimer();

    // Vérifier les bloquages périodiquement
    const blockTimer = setInterval(() => {
      if (this.blockedUntil && this.blockedUntil <= new Date()) {
        this.blockedUntil = null;
        this.isBlocked = false;
        this.errorMessage = '';
      }
    }, 1000);

    this.timers.push(blockTimer);
  }

  private initializeForm(): void {
    const formControls: { [key: string]: FormControl } = {};
    for (let i = 0; i < 6; i++) {
      formControls[`digit${i + 1}`] = new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]')
      ]);
    }
    this.otpForm = this.fb.group(formControls);
  }

  ngAfterViewInit(): void {
    // Focus sur le premier input après que la vue soit initialisée
    setTimeout(() => {
      this.focusInput(0);
    }, 100);
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearInterval(timer));
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const key = event.key;
    const currentControl = this.otpForm.get(`digit${index + 1}`)!;

    if (
        !/^[0-9]$/.test(key) &&
        !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(key)
    ) {
      event.preventDefault();
    }

    if (key === 'Backspace') {
      if (!currentControl.value && index > 0) {
        this.otpInputs.toArray()[index - 1].nativeElement.focus();
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    } else if (key === 'ArrowRight' && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    this.clearMessages();
  }

  onInput(index: number): void {
    const control = this.otpForm.get(`digit${index + 1}`)!;
    const value = control.value;

    const digit = value.toString().replace(/\D/g, '').charAt(0) || '';
    control.setValue(digit);

    if (digit && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    this.clearMessages();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text')?.replace(/\D/g, '') || '';

    for (let i = 0; i < Math.min(6, pastedText.length); i++) {
      const control = this.otpForm.get(`digit${i + 1}`);
      if (control) {
        control.setValue(pastedText[i]);
      }
    }

    const focusIndex = Math.min(pastedText.length, 6) - 1;
    this.otpInputs.toArray()[focusIndex]?.nativeElement.focus();

    this.clearMessages();
  }

  private focusInput(index: number): void {
    const inputArray = this.otpInputs?.toArray();
    if (inputArray && inputArray[index]) {
      inputArray[index].nativeElement.focus();
    }
  }

  isOtpComplete(): boolean {
    return this.otpForm.valid;
  }

  private getOtpValue(): string {
    return Array.from({ length: 6 })
        .map((_, i) => this.otpForm.get(`digit${i + 1}`)?.value || '')
        .join('');
  }

  verifyOtp(): void {
    if (!this.isOtpComplete()) {
      this.showError = true;
      this.errorMessage = 'Veuillez saisir le code complet';
      return;
    }

    this.isLoading = true;
    this.clearMessages();
    const otpCode = this.getOtpValue();

    const otpRequest: OtpRequest = {
      userId: this.userId,
      code: otpCode
    };

    this.authService.verifyOtp(otpRequest).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.successMessage = 'Connexion réussie !';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = response.message;
          this.remainingAttempts = response.remainingAttempts || null;

          if (response.blockedUntil) {
            this.blockedUntil = new Date(response.blockedUntil);
            this.isBlocked = true;
          }

          // Réinitialiser les champs en cas d'erreur
          this.resetOtpFields();
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // Gérer les erreurs de réponse du serveur
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
          this.remainingAttempts = error.error.remainingAttempts || null;
          
          if (error.error.blockedUntil) {
            this.blockedUntil = new Date(error.error.blockedUntil);
            this.isBlocked = true;
          }
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
        
        console.error('Erreur de vérification OTP:', error);
        this.resetOtpFields();
      }
    });
  }

  private resetOtpFields(): void {
    // Réinitialiser les valeurs du formulaire
    for (let i = 0; i < 6; i++) {
      const control = this.otpForm.get(`digit${i + 1}`);
      if (control) {
        control.setValue('');
      }
    }

    // Focus sur le premier input
    setTimeout(() => {
      this.focusInput(0);
    }, 100);
  }

  resendCode(): void {
    if (this.canResendIn > 0) return;

    this.isLoading = true;
    this.clearMessages();

    this.authService.resendOtp(this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.successMessage = response.message;
          this.canResendIn = 30;
          this.startResendTimer();

          // Réinitialiser le timer d'expiration
          this.timeRemaining = 300;
          this.startExpirationTimer();

          // Réinitialiser les champs
          this.resetOtpFields();
        } else {
          this.errorMessage = response.message || 'Erreur lors du renvoi du code.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Erreur lors du renvoi du code.';
        }
        
        console.error('Erreur de renvoi OTP:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  private startExpirationTimer(): void {
    // Nettoyer le timer précédent s'il existe
    this.timers.forEach((timer, index) => {
      if (timer.type === 'expiration') {
        clearInterval(timer.id);
        this.timers.splice(index, 1);
      }
    });

    const timer = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        clearInterval(timer);
        this.errorMessage = 'Le code OTP a expiré. Veuillez en demander un nouveau.';
      }
    }, 1000);

    this.timers.push({ id: timer, type: 'expiration' });
  }

  private startResendTimer(): void {
    // Nettoyer le timer précédent s'il existe
    this.timers.forEach((timer, index) => {
      if (timer.type === 'resend') {
        clearInterval(timer.id);
        this.timers.splice(index, 1);
      }
    });

    const timer = setInterval(() => {
      this.canResendIn--;

      if (this.canResendIn <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    this.timers.push({ id: timer, type: 'resend' });
  }

  private clearMessages(): void {
    this.showError = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getBlockedTimeRemaining(): string {
    if (!this.blockedUntil) return '';

    const remaining = Math.ceil((this.blockedUntil.getTime() - Date.now()) / 1000);
    if (remaining <= 0) return '';

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
}
