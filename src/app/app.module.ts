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
import {FooterDirective} from './components/footer/FooterDirective';
import {NonautorizzatoComponent} from './modules/nonautorizzato/nonautorizzato.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GenericErrorComponent} from './modules/generic-error/generic-error.component';
import {UrlBackInterceptor} from './services/urlBack.interceptor';
import {BannerComponent} from './components/banner/banner.component';
import {HeaderComponent} from './components/header/header.component';
import {NuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/nuovo-pagamento.component';
import {IMieiPagamentiComponent} from './modules/main/components/i-miei-pagamenti/i-miei-pagamenti.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DesignAngularKitModule} from 'design-angular-kit';
import {CompilaNuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/compila-nuovo-pagamento/compila-nuovo-pagamento.component';
import {DatiNuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/dati-nuovo-pagamento/dati-nuovo-pagamento.component';
import {UserIdleModule} from 'angular-user-idle';
import {DpDatePickerModule} from 'ng2-date-picker';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {TableComponent} from './components/table/table.component';
import {GestisciUtentiComponent} from './modules/main/components/amministrativo/gestisci-utenti/gestisci-utenti.component';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TabViewModule} from 'primeng/tabview';
import {TabViewComponent} from './components/tab-view/tab-view.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ToolbarModule} from 'primeng/toolbar';
import {PaginatorComponent} from './components/table/paginator/paginator.component';
import {FiltroGestioneUtentiComponent} from './modules/main/components/amministrativo/gestisci-utenti/filtro-gestione-utenti/filtro-gestione-utenti.component';
import {NgxCurrencyModule} from 'ngx-currency';
import {CustomFormsModule} from 'ngx-custom-validators';
import {IntegerNumberDirective} from './utils/IntegerNumberDirective';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FormUtentePermessiComponent} from './modules/main/components/amministrativo/gestisci-utenti/form-utente-permessi/form-utente-permessi.component';
import {DatiUtenteComponent} from './modules/main/components/amministrativo/gestisci-utenti/dati-utente/dati-utente.component';
import {DatiPermessoComponent} from './modules/main/components/amministrativo/gestisci-utenti/dati-permesso/dati-permesso.component';
import {DayInputDirective} from './utils/DayInputDirective';
import {MonthInputDirective} from './utils/MonthInputDirective';
import {OverlayComponent} from './components/overlay/overlay.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {TreeTableModule} from "primeng/treetable";
import {AmministrativoParentComponent} from "./modules/main/components/amministrativo/amministrativo-parent.component";
import {GestisciSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/gestisci-societa.component';
import {FiltroGestioneSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/filtro-gestione-societa/filtro-gestione-societa.component';
import {OrderByPipe} from "./pipe/orderby-pipe";
import {GestisciLivelliTerritorialiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/gestisci-livelli-territoriali.component';
import {FiltroGestioneLivelliTerritorialiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/filtro-gestione-livelli-territoriali/filtro-gestione-livelli-territoriali.component';
import {GestisciBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/gestisci-banner.component';
import {FiltroGestioneBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/filtro-gestione-banner/filtro-gestione-banner.component';
import {GestisciEntiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-enti/gestisci-enti.component';
import {SpinnerOverlayComponent} from './components/spinner-overlay/spinner-overlay.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MonitoraAccessiComponent} from './modules/main/components/amministrativo/monitora-accessi/monitora-accessi.component';

@NgModule({
  declarations: [
    AppComponent,
    FormUtentePermessiComponent,
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
    IntegerNumberDirective,
    DatiUtenteComponent,
    DatiPermessoComponent,
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
    IMieiPagamentiComponent,
    CompilaNuovoPagamentoComponent,
    DatiNuovoPagamentoComponent,
    IntegerNumberDirective,
    DayInputDirective,
    MonthInputDirective,
    OverlayComponent,
    AmministrativoParentComponent,
    GestisciSocietaComponent,
    FiltroGestioneSocietaComponent,
    GestisciLivelliTerritorialiComponent,
    FiltroGestioneLivelliTerritorialiComponent,
    GestisciBannerComponent,
    FiltroGestioneBannerComponent,
    GestisciEntiComponent,
    OrderByPipe,
    SpinnerOverlayComponent,
    MonitoraAccessiComponent
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
    ConfirmDialogModule,
    BrowserAnimationsModule,
    CustomFormsModule,
    AutoCompleteModule,
    TreeTableModule,
    OverlayModule
  ],
  providers: [
    ConfirmationService,
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
