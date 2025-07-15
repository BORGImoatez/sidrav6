import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private subscriptions: { [key: string]: any } = {};

  constructor() {}

  connect(): void {
    console.log('WebSocket connection would be established here');
    // Dans une implémentation réelle, nous connecterions au WebSocket
    // Mais pour éviter l'erreur "global is not defined", nous simulons la fonctionnalité
  }

  disconnect(): void {
    console.log('WebSocket disconnected');
    this.subscriptions = {};
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    console.log(`Subscribed to ${destination}`);
    // Simuler l'abonnement
    this.subscriptions[destination] = callback;
  }

  unsubscribe(destination: string): void {
    console.log(`Unsubscribed from ${destination}`);
    delete this.subscriptions[destination];
  }

  send(destination: string, message: any): void {
    console.log(`Message sent to ${destination}:`, message);
    // Simuler l'envoi de message
  }
}