import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './modules/main/components/home/home.component';
import {ErrorHandlerGenerico} from './services/errorHandlerGenerico';
import {JwtInterceptorService} from './services/jwt-interceptor.service';
import {BackendInterceptorService} from './services/backend-interceptor';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {MainModule} from './modules/main/main.module';
import {LoginBarComponent} from './components/login-bar/login-bar.component';
import {FooterDirective} from "./components/footer/FooterDirective";
import {NonautorizzatoComponent} from './modules/nonautorizzato/nonautorizzato.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {GenericErrorComponent} from './modules/generic-error/generic-error.component';
import {UrlBackInterceptor} from "./services/urlBack.interceptor";
import {BannerComponent} from './components/banner/banner.component';
import {HeaderComponent} from './components/header/header.component';
import {NuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/nuovo-pagamento.component';
import {IMieiPagamentiComponent} from './modules/main/components/i-miei-pagamenti/i-miei-pagamenti.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DesignAngularKitModule} from 'design-angular-kit';
import {CompilaNuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/compila-nuovo-pagamento/compila-nuovo-pagamento.component';
import {DatiNuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/dati-nuovo-pagamento/dati-nuovo-pagamento.component';
import {UserIdleModule} from "angular-user-idle";
import {DpDatePickerModule} from 'ng2-date-picker';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from "primeng/table";
import {TableComponent} from './components/table/table.component';
import {GestisciUtentiComponent} from './modules/main/components/gestisci-utenti/gestisci-utenti.component';
import {ButtonModule} from "primeng/button";      //accordion and accordion tab
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TabViewModule} from 'primeng/tabview';
import {TabViewComponent} from './components/tab-view/tab-view.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ToolbarModule} from 'primeng/toolbar';
import { PaginatorComponent } from './components/table/paginator/paginator.component';
import {FiltroGestioneUtentiComponent} from './modules/main/components/gestisci-utenti/filtro-gestione-utenti/filtro-gestione-utenti.component';
import {NgxCurrencyModule} from 'ngx-currency';
import {CustomFormsModule} from 'ngx-custom-validators';
import {IntegerNumberDirective} from './utils/IntegerNumberDirective';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AggiungiUtentePermessiComponent} from './modules/main/components/gestisci-utenti/aggiungi-utente-permessi/aggiungi-utente-permessi.component';

@NgModule({
  declarations: [
    AppComponent,
    AggiungiUtentePermessiComponent,
    HomeComponent,
    SidebarComponent,
    LoginBarComponent,
    FooterDirective,
    NonautorizzatoComponent,
    GenericErrorComponent,
    BannerComponent,
    HeaderComponent,
    NuovoPagamentoComponent,
    IMieiPagamentiComponent,
    CompilaNuovoPagamentoComponent,
    DatiNuovoPagamentoComponent,
    TableComponent,
    GestisciUtentiComponent,
    TabViewComponent,
    ToolbarComponent,
    PaginatorComponent,
    FiltroGestioneUtentiComponent,
    IntegerNumberDirective
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MainModule,
    NgbModule,
    FormsModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    UserIdleModule.forRoot({idle: 10, timeout: 3, ping: 120}),
    DpDatePickerModule,
    NgxDatatableModule,
    AccordionModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,
    TabViewModule,
    ToolbarModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
    DpDatePickerModule,
    NgxCurrencyModule,
    CustomFormsModule,
    AutoCompleteModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BackendInterceptorService, multi: true},
    {provide: ErrorHandler, useClass: ErrorHandlerGenerico},
    {provide: HTTP_INTERCEPTORS, useClass: UrlBackInterceptor, multi: true}
  ],
  exports: [
    FooterDirective
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
