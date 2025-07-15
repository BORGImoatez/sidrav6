import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private subscriptions: { [key: string]: any } = {};

  constructor() {}

  connect(): void {
    if (this.client && this.client.connected) {
      return;
    }

    const socket = new SockJS(`${environment.apiUrl}/ws`);
    this.client = Stomp.over(socket);

    this.client.connect({}, () => {
      console.log('WebSocket connection established');
    }, (error) => {
      console.error('WebSocket connection error:', error);
      setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      this.subscriptions = {};
    }
  }

  subscribe(destination: string, callback: (message: any) => void): void {
    if (!this.client || !this.client.connected) {
      this.connect();
    }

    if (!this.subscriptions[destination]) {
      this.subscriptions[destination] = this.client?.subscribe(destination, (message: IMessage) => {
        const payload = JSON.parse(message.body);
        callback(payload);
      });
    }
  }

  unsubscribe(destination: string): void {
    if (this.subscriptions[destination]) {
      this.subscriptions[destination].unsubscribe();
      delete this.subscriptions[destination];
    }
  }

  send(destination: string, message: any): void {
    if (!this.client || !this.client.connected) {
      this.connect();
    }

    this.client?.publish({
      destination,
      body: JSON.stringify(message)
    });
  }
}