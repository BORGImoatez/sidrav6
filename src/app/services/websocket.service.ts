import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private state = new BehaviorSubject<boolean>(false);
  private subscriptions: Map<string, (message: any) => void> = new Map();
  private serverUrl = (environment.apiUrl || 'http://localhost:9090/api').replace('http', 'ws') + '/ws?token=';

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return this.state.asObservable();
    }

    // Fermer la connexion existante si elle existe
    if (this.socket) {
      this.socket.close();
    }

    // Créer une nouvelle connexion WebSocket
    const token = localStorage.getItem('sidra_token') || '';
    this.socket = new WebSocket(this.serverUrl + token);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.state.next(true);

      // Envoyer un ping pour tester la connexion
      this.send('/app/ping', { message: 'Hello from client' });
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const destination = message.destination;

        // Traiter le message si un abonnement existe
        if (destination && this.subscriptions.has(destination)) {
          const callback = this.subscriptions.get(destination);
          if (callback) {
            callback(message.payload);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.state.next(false);

      // Tenter de se reconnecter après 5 secondes
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.state.next(false);
    };

    return this.state.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.state.next(false);
      this.subscriptions.clear();
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    // Enregistrer l'abonnement
    this.subscriptions.set(destination, callback);

    // S'abonner au sujet
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send('/app/subscribe', { destination });
    } else {
      // Se connecter si pas encore connecté
      this.connect().subscribe();
    }
  }

  unsubscribe(destination: string): void {
    if (this.subscriptions.has(destination)) {
      this.subscriptions.delete(destination);

      // Informer le serveur du désabonnement
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send('/app/unsubscribe', { destination });
      }
    }
  }

  send(destination: string, message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = {
        destination,
        payload: message,
        timestamp: new Date().getTime()
      };
      this.socket.send(JSON.stringify(payload));
    } else {
      console.error('Cannot send message, WebSocket not connected');
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}
