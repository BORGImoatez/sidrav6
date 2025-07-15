import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private state = new BehaviorSubject<boolean>(false);
  private subscriptions: Map<string, (message: any) => void> = new Map();
  private serverUrl = (environment.apiUrl || 'http://localhost:9090/api') + '/ws';

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    if (this.stompClient && this.stompClient.connected) {
      return this.state.asObservable();
    }

    // Disconnect if already connected
    if (this.stompClient) {
      this.disconnect();
    }

    const token = localStorage.getItem('sidra_token') || '';
    
    // Create a new STOMP client
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function(str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    // Connect handlers
    this.stompClient.onConnect = (frame) => {
      console.log('STOMP connection established');
      this.state.next(true);
      
      // Resubscribe to all previous subscriptions
      this.subscriptions.forEach((callback, destination) => {
        this.subscribeToDestination(destination, callback);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      this.state.next(false);
    };

    this.stompClient.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
      this.state.next(false);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      this.state.next(false);
    };

    // Activate the client
    this.stompClient.activate();

    return this.state.asObservable();
  }

  disconnect(): void {
    if (this.stompClient) {
      if (this.stompClient.connected) {
        this.stompClient.deactivate();
      }
      this.stompClient = null;
      this.state.next(false);
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    this.subscriptions.set(destination, callback);

    // Subscribe if connected
    if (this.stompClient && this.stompClient.connected) {
      this.subscribeToDestination(destination, callback);
    } else if (!this.stompClient) {
      // Connect if not already connecting
      this.connect().subscribe();
    }
  }

  private subscribeToDestination(destination: string, callback: (message: any) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(destination, (message) => {
        try {
          const payload = JSON.parse(message.body);
          callback(payload);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    }
  }

  unsubscribe(destination: string): void {
    if (this.subscriptions.has(destination)) {
      this.subscriptions.delete(destination);
    }
  }

  send(destination: string, message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(message)
      });
    } else {
      console.error('Cannot send message, STOMP client not connected');
    }
  }

  isConnected(): boolean {
    return this.stompClient !== null && this.stompClient.connected;
  }
}
