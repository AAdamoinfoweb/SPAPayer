import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {ErrorHandlerGenerico} from './services/errorHandlerGenerico';
import {JwtInterceptorService} from './services/jwt-interceptor.service';
import {BackendInterceptorService} from './services/backend-interceptor';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {MainModule} from './modules/main/main.module';
import {LoginBarComponent} from './components/login-bar/login-bar.component';
import {FooterDirective} from "./components/footer/FooterDirective";
import { NonautorizzatoComponent } from './modules/nonautorizzato/nonautorizzato.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { GenericErrorComponent } from './modules/generic-error/generic-error.component';
import {UrlBackInterceptor} from "./services/urlBack.interceptor";
import { BannerComponent } from './components/banner/banner.component';
import { HeaderComponent } from './components/header/header.component';
import { NuovoPagamentoComponent } from './components/nuovo-pagamento/nuovo-pagamento.component';
import { IMieiPagamentiComponent } from './components/i-miei-pagamenti/i-miei-pagamenti.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    LoginBarComponent,
    FooterDirective,
    NonautorizzatoComponent,
    GenericErrorComponent,
    BannerComponent,
    HeaderComponent,
    NuovoPagamentoComponent,
    IMieiPagamentiComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MainModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BackendInterceptorService, multi: true},
    {provide: ErrorHandler, useClass: ErrorHandlerGenerico},
    { provide: HTTP_INTERCEPTORS, useClass: UrlBackInterceptor, multi: true }
  ],
  exports: [
    FooterDirective
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
