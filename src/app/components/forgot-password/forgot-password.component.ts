import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card card">
        <div class="forgot-password-header">
          <div class="logo-placeholder">
            <img src="../../../assets/logo/logoMS.png" alt="">
          </div>
          
          <h1 class="text-2xl font-bold text-center text-gray-900 mb-2">
            SIDRA
          </h1>
          
          <p class="text-center text-gray-600 mb-8">
            SYSTEME D'INFORMATION SUR LES DROGUES ET ADDICTIONS
          </p>
          
          <div class="partners-logos">
            <div class="logo-placeholder">
              <img src="../../../assets/logo/logos.png" alt="">
            </div>
          </div>
        </div>

        <!-- Step 1: Enter Phone Number -->
        <div *ngIf="currentStep === 1">
          <h2 class="text-xl font-semibold text-center mb-4">Mot de passe oublié</h2>
          <p class="text-center text-gray-600 mb-6">
            Veuillez saisir votre numéro de téléphone pour recevoir un code de vérification.
          </p>

          <form (ngSubmit)="requestOtp()" #phoneForm="ngForm" class="forgot-password-form">
            <div class="form-group">
              <label for="telephone" class="form-label required">
                Numéro de téléphone
              </label>
              <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  [(ngModel)]="telephone"
                  class="form-input"
                  [class.error]="showError && !telephone"
                  placeholder="21612345678"
                  required
                  [disabled]="isLoading"
              >
              <div *ngIf="showError && !telephone" class="form-error">
                Le numéro de téléphone est requis
              </div>
            </div>

            <div *ngIf="errorMessage" class="error-banner">
              <span>{{ errorMessage }}</span>
            </div>

            <button
                type="submit"
                class="btn btn-primary btn-lg w-full"
                [disabled]="isLoading"
            >
              <span *ngIf="!isLoading">Envoyer le code</span>
              <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                <div class="loading-spinner-sm"></div>
                Envoi en cours...
              </span>
            </button>
          </form>
        </div>

        <!-- Step 2: Enter OTP -->
        <div *ngIf="currentStep === 2">
          <h2 class="text-xl font-semibold text-center mb-4">Vérification du code</h2>
          <p class="text-center text-gray-600 mb-6">
            Un code à 6 chiffres a été envoyé par SMS au {{ telephone }}.<br>
            <span class="text-sm text-gray-500">Saisissez-le ci-dessous pour continuer.</span>
          </p>

          <div class="otp-form">
            <div class="otp-inputs">
              <ng-container *ngFor="let digit of otpDigits; let i = index">
                <input
                    type="text"
                    maxlength="1"
                    class="otp-input"
                    [(ngModel)]="otpDigits[i]"
                    (keydown)="onOtpKeyDown($event, i)"
                    (input)="onOtpInput(i)"
                    (paste)="onOtpPaste($event)"
                    #otpInput
                    [disabled]="isLoading"
                    autocomplete="off"
                >
              </ng-container>
            </div>

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
                  (click)="resendOtp()"
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

        <!-- Step 3: Reset Password -->
        <div *ngIf="currentStep === 3">
          <h2 class="text-xl font-semibold text-center mb-4">Réinitialisation du mot de passe</h2>
          <p class="text-center text-gray-600 mb-6">
            Veuillez saisir votre nouveau mot de passe.
          </p>

          <form (ngSubmit)="resetPassword()" #passwordForm="ngForm" class="forgot-password-form">
            <div class="form-group">
              <label for="newPassword" class="form-label required">
                Nouveau mot de passe
              </label>
              <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  [(ngModel)]="newPassword"
                  class="form-input"
                  [class.error]="showError && (!newPassword || !isPasswordValid())"
                  placeholder="••••••••"
                  required
                  [disabled]="isLoading"
              >
              <div *ngIf="showError && !newPassword" class="form-error">
                Le mot de passe est requis
              </div>
              <div *ngIf="showError && newPassword && !isPasswordValid()" class="form-error">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
              </div>
              <div class="password-strength" *ngIf="newPassword">
                <div class="strength-item" [class.valid]="newPassword.length >= 8">
                  <span class="strength-icon">{{ newPassword.length >= 8 ? '✓' : '✗' }}</span>
                  <span class="strength-text">Au moins 8 caractères</span>
                </div>
                <div class="strength-item" [class.valid]="hasUpperCase()">
                  <span class="strength-icon">{{ hasUpperCase() ? '✓' : '✗' }}</span>
                  <span class="strength-text">Au moins une majuscule</span>
                </div>
                <div class="strength-item" [class.valid]="hasNumber()">
                  <span class="strength-icon">{{ hasNumber() ? '✓' : '✗' }}</span>
                  <span class="strength-text">Au moins un chiffre</span>
                </div>
                <div class="strength-item" [class.valid]="hasSpecialChar()">
                  <span class="strength-icon">{{ hasSpecialChar() ? '✓' : '✗' }}</span>
                  <span class="strength-text">Au moins un caractère spécial</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label required">
                Confirmer le mot de passe
              </label>
              <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  class="form-input"
                  [class.error]="showError && (!confirmPassword || newPassword !== confirmPassword)"
                  placeholder="••••••••"
                  required
                  [disabled]="isLoading"
              >
              <div *ngIf="showError && !confirmPassword" class="form-error">
                La confirmation du mot de passe est requise
              </div>
              <div *ngIf="showError && confirmPassword && newPassword !== confirmPassword" class="form-error">
                Les mots de passe ne correspondent pas
              </div>
            </div>

            <div *ngIf="errorMessage" class="error-banner">
              <span>{{ errorMessage }}</span>
            </div>

            <div *ngIf="successMessage" class="success-banner">
              {{ successMessage }}
            </div>

            <button
                type="submit"
                class="btn btn-primary btn-lg w-full"
                [disabled]="isLoading"
            >
              <span *ngIf="!isLoading">Réinitialiser le mot de passe</span>
              <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                <div class="loading-spinner-sm"></div>
                Réinitialisation en cours...
              </span>
            </button>
          </form>
        </div>

        <div class="forgot-password-footer">
          <p class="text-center mt-4">
            <a href="/login" class="text-primary-600 hover:underline">Retour à la connexion</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      padding: var(--spacing-4);
    }

    .forgot-password-card {
      width: 100%;
      max-width: 480px;
      padding: var(--spacing-8);
      background: white;
      box-shadow: var(--shadow-xl);
      border: none;
    }

    .forgot-password-header {
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

    .forgot-password-form {
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

    .loading-spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .forgot-password-footer {
      border-top: 1px solid var(--gray-200);
      padding-top: var(--spacing-4);
    }

    /* OTP Styles */
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

    /* Password Strength */
    .password-strength {
      margin-top: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: var(--gray-50);
      border-radius: var(--radius-md);
    }

    .strength-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-2);
      font-size: 12px;
      color: var(--gray-600);
    }

    .strength-item.valid {
      color: var(--success-600);
    }

    .strength-icon {
      font-weight: bold;
    }

    .strength-item.valid .strength-icon {
      color: var(--success-500);
    }

    @media (max-width: 480px) {
      .forgot-password-card {
        padding: var(--spacing-6);
      }
      
      .partners-logos {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .logo-placeholder {
        height: 50px;
      }

      .otp-inputs {
        gap: var(--spacing-2);
      }
      
      .otp-input {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  // Current step in the forgot password flow
  currentStep = 1;
  
  // Step 1: Phone number
  telephone = '';
  
  // Step 2: OTP verification
  otpDigits = ['', '', '', '', '', ''];
  userId: number | null = null;
  timeRemaining = 300; // 5 minutes
  canResendIn = 0;
  remainingAttempts: number | null = null;
  blockedUntil: Date | null = null;
  isBlocked = false;
  
  // Step 3: Password reset
  newPassword = '';
  confirmPassword = '';
  
  // Common state
  isLoading = false;
  showError = false;
  errorMessage = '';
  successMessage = '';
  
  // Timers
  private timers: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize timers
    this.startTimers();
  }

  ngOnDestroy(): void {
    // Clean up timers
    this.timers.forEach(timer => clearInterval(timer));
  }

  // Step 1: Request OTP
  requestOtp(): void {
    this.showError = true;
    this.errorMessage = '';
    
    if (!this.telephone) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.requestPasswordResetOtp(this.telephone).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.userId = response.userId;
          this.currentStep = 2;
          this.startOtpTimers();
          this.showError = false;
        } else {
          this.errorMessage = response.message;
          
          if (response.blockedUntil) {
            this.blockedUntil = new Date(response.blockedUntil);
            this.isBlocked = true;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
  
  // Step 2: OTP verification
  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const key = event.key;
    
    if (
      !/^[0-9]$/.test(key) &&
      !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(key)
    ) {
      event.preventDefault();
    }
    
    if (key === 'Backspace') {
      if (!this.otpDigits[index] && index > 0) {
        // Focus previous input if current is empty
        const inputs = document.querySelectorAll('.otp-input');
        (inputs[index - 1] as HTMLInputElement).focus();
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      const inputs = document.querySelectorAll('.otp-input');
      (inputs[index - 1] as HTMLInputElement).focus();
    } else if (key === 'ArrowRight' && index < 5) {
      const inputs = document.querySelectorAll('.otp-input');
      (inputs[index + 1] as HTMLInputElement).focus();
    }
    
    this.clearMessages();
  }
  
  onOtpInput(index: number): void {
    const digit = this.otpDigits[index].replace(/\D/g, '').charAt(0) || '';
    this.otpDigits[index] = digit;
    
    if (digit && index < 5) {
      // Focus next input
      const inputs = document.querySelectorAll('.otp-input');
      (inputs[index + 1] as HTMLInputElement).focus();
    }
    
    this.clearMessages();
  }
  
  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text')?.replace(/\D/g, '') || '';
    
    for (let i = 0; i < Math.min(6, pastedText.length); i++) {
      this.otpDigits[i] = pastedText[i];
    }
    
    const focusIndex = Math.min(pastedText.length, 6) - 1;
    if (focusIndex >= 0) {
      const inputs = document.querySelectorAll('.otp-input');
      (inputs[focusIndex] as HTMLInputElement).focus();
    }
    
    this.clearMessages();
  }
  
  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }
  
  getOtpValue(): string {
    return this.otpDigits.join('');
  }
  
  verifyOtp(): void {
    if (!this.isOtpComplete() || !this.userId) {
      return;
    }
    
    this.isLoading = true;
    this.clearMessages();
    
    this.authService.verifyPasswordResetOtp(this.userId, this.getOtpValue()).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Code vérifié avec succès';
          setTimeout(() => {
            this.currentStep = 3;
            this.successMessage = '';
          }, 1000);
        } else {
          this.errorMessage = response.message;
          this.remainingAttempts = response.remainingAttempts || null;
          
          if (response.blockedUntil) {
            this.blockedUntil = new Date(response.blockedUntil);
            this.isBlocked = true;
          }
          
          this.resetOtpInputs();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.resetOtpInputs();
      }
    });
  }
  
  resendOtp(): void {
    if (this.canResendIn > 0 || !this.userId) {
      return;
    }
    
    this.isLoading = true;
    this.clearMessages();
    
    this.authService.resendPasswordResetOtp(this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = response.message;
          this.canResendIn = 30;
          this.startResendTimer();
          
          // Reset OTP timer
          this.timeRemaining = 300;
          this.startOtpExpirationTimer();
          
          // Reset inputs
          this.resetOtpInputs();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
  
  // Step 3: Reset password
  resetPassword(): void {
    this.showError = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.newPassword || !this.confirmPassword || !this.userId) {
      return;
    }
    
    if (!this.isPasswordValid()) {
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    
    this.isLoading = true;
    
    this.authService.resetPassword(this.userId, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
  
  // Password validation
  isPasswordValid(): boolean {
    return this.newPassword.length >= 8 && 
           this.hasUpperCase() && 
           this.hasNumber() && 
           this.hasSpecialChar();
  }
  
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }
  
  hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }
  
  hasSpecialChar(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.newPassword);
  }
  
  // Navigation
  goBack(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
      this.resetOtpInputs();
      this.clearMessages();
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  // Utility methods
  private resetOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    
    // Focus first input
    setTimeout(() => {
      const inputs = document.querySelectorAll('.otp-input');
      if (inputs.length > 0) {
        (inputs[0] as HTMLInputElement).focus();
      }
    }, 100);
  }
  
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
  
  private startTimers(): void {
    // Check for blocked status
    const blockTimer = setInterval(() => {
      if (this.blockedUntil && this.blockedUntil <= new Date()) {
        this.blockedUntil = null;
        this.isBlocked = false;
        this.errorMessage = '';
      }
    }, 1000);
    
    this.timers.push(blockTimer);
  }
  
  private startOtpTimers(): void {
    this.startOtpExpirationTimer();
    
    // Set initial resend timer
    this.canResendIn = 30;
    this.startResendTimer();
  }
  
  private startOtpExpirationTimer(): void {
    // Clear previous timer if exists
    this.timers.forEach((timer, index) => {
      if (timer.type === 'expiration') {
        clearInterval(timer.id);
        this.timers.splice(index, 1);
      }
    });
    
    // Reset timer
    this.timeRemaining = 300;
    
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
    // Clear previous timer if exists
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