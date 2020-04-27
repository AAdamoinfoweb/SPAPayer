import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorHandlerGenerico } from './services/errorHandlerGenerico';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { BackendInterceptorService } from './services/backend-interceptor';
import { HeaderComponent } from './components/header/header.component';
import { MainModule } from './modules/main/main.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MainModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BackendInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: ErrorHandlerGenerico }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
