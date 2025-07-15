import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebSocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [WebSocketService]
})
export class AppComponent {
  title = 'SIDRA - Système d\'Information Drogue et Addiction';
  
  constructor(private webSocketService: WebSocketService) {}
}