import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private state = new BehaviorSubject<boolean>(false);

  private subscriptions: Map<string, { callback: (message: any) => void, subscription?: StompSubscription }> = new Map();

  private token = localStorage.getItem('sidra_token') || '';
  private serverUrl = (environment.apiUrl || 'http://localhost:9090/api') + `/ws?token=${this.token}`;

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    if (this.stompClient?.active || this.stompClient?.connected) {
      console.log('WebSocket already connecting or connected');
      return this.state.asObservable();
    }

    // Disconnect cleanly if any previous connection exists
    if (this.stompClient) {
      this.disconnect();
    }

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      debug: str => console.log('STOMP: ' + str),
      reconnectDelay: 0, // ✅ ne tente pas de reconnexion automatique
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = () => {
      console.log('STOMP connection established');
      this.state.next(true);

      // Resubscribe to all stored destinations
      this.subscriptions.forEach((entry, destination) => {
        this.subscribeToDestination(destination, entry.callback);
      });
    };

    this.stompClient.onStompError = frame => {
      console.error('STOMP error:', frame.headers['message']);
      this.state.next(false);
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn('WebSocket connection closed');
      this.state.next(false);
    };

    this.stompClient.onWebSocketError = error => {
      console.error('WebSocket error:', error);
      this.state.next(false);
    };

    this.stompClient.activate();
    return this.state.asObservable();
  }

  disconnect(): void {
    // Unsubscribe from all
    this.subscriptions.forEach(entry => {
      entry.subscription?.unsubscribe();
    });
    this.subscriptions.clear();

    if (this.stompClient) {
      if (this.stompClient.connected) {
        this.stompClient.deactivate();
      }
      this.stompClient = null;
    }

    this.state.next(false);
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    if (this.subscriptions.has(destination)) {
      console.warn(`Already subscribed to ${destination}`);
      return;
    }

    this.subscriptions.set(destination, { callback });

    if (this.stompClient?.connected) {
      this.subscribeToDestination(destination, callback);
    } else if (!this.stompClient) {
      this.connect().subscribe();
    }
  }

  private subscribeToDestination(destination: string, callback: (message: any) => void): void {
    if (this.stompClient?.connected) {
      const subscription = this.stompClient.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      const entry = this.subscriptions.get(destination);
      if (entry) {
        entry.subscription = subscription;
        this.subscriptions.set(destination, entry);
      }
    }
  }

  unsubscribe(destination: string): void {
    const entry = this.subscriptions.get(destination);
    if (entry?.subscription) {
      entry.subscription.unsubscribe();
    }
    this.subscriptions.delete(destination);
  }

  send(destination: string, message: any): void {
    if (this.isConnected() && this.isSocketOpen()) {
      this.stompClient!.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
    } else {
      console.warn('Cannot send message, STOMP client not connected or WebSocket is not open');
    }
  }

  isConnected(): boolean {
    return this.stompClient !== null && this.stompClient.connected;
  }

  private isSocketOpen(): boolean {
    const socket = (this.stompClient as any)?.webSocket as WebSocket;
    return socket?.readyState === WebSocket.OPEN;
  }
}
