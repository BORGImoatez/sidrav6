import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private serverUrl = (environment.apiUrl || 'http://localhost:9090/api') + '/ws';
  private state = new BehaviorSubject<boolean>(false);
  private subscriptions: Map<string, any> = new Map();

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    if (this.stompClient && this.stompClient.connected) {
      return this.state.asObservable();
    }

    const socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = null; // Disable debug logs

    // Get the JWT token for authentication
    const token = localStorage.getItem('sidra_token');

    this.stompClient.connect(
      { Authorization: token ? `Bearer ${token}` : '' },
      () => {
        console.log('WebSocket connection established');
        this.state.next(true);
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
        this.state.next(false);
        // Try to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      }
    );

    return this.state.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach(subscription => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
      this.subscriptions.clear();

      // Disconnect the client
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
        this.state.next(false);
      });
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    // Connect if not already connected
    this.connect().subscribe(connected => {
      if (connected && this.stompClient) {
        // Check if already subscribed
        if (this.subscriptions.has(destination)) {
          return;
        }

        // Subscribe to the destination
        const subscription = this.stompClient.subscribe(destination, (message: any) => {
          const payload = JSON.parse(message.body);
          callback(payload);
        });

        // Store the subscription
        this.subscriptions.set(destination, subscription);
        console.log(`Subscribed to ${destination}`);
      }
    });
  }

  unsubscribe(destination: string): void {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`Unsubscribed from ${destination}`);
    }
  }

  send(destination: string, message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
      console.log(`Message sent to ${destination}:`, message);
    } else {
      console.error('Cannot send message, WebSocket not connected');
    }
  }

  isConnected(): boolean {
    return this.stompClient && this.stompClient.connected;
  }
}