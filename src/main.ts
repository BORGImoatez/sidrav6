import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { DatePipe } from '@angular/common';
import { HttpInterceptorService } from './app/services/http-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Fournir les routes
    provideRouter(routes),

    // Importer les modules nécessaires
    importProvidersFrom(
        BrowserAnimationsModule,
        HttpClientModule
    ),

    // Fournir les pipes
    DatePipe,

    // Fournir l’intercepteur HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
}).catch(err => console.error(err));
