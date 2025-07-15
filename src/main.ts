import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom, Provider } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { DatePipe } from "@angular/common";
import { HttpInterceptorService } from './app/services/http-interceptor.service';

const httpInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  multi: true
};

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule, HttpClientModule),
    httpInterceptorProvider
  ]
}).catch(err => console.error(err));
