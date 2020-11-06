import {ErrorHandler, NgModule} from '@angular/core';
import {FormUtentePermessiComponent} from './gestisci-utenti/form-utente-permessi/form-utente-permessi.component';
import {GestisciUtentiComponent} from './gestisci-utenti/gestisci-utenti.component';
import {TabViewComponent} from '../../../../components/tab-view/tab-view.component';
import {ToolbarComponent} from '../../../../components/toolbar/toolbar.component';
import {PaginatorComponent} from '../../../../components/table/paginator/paginator.component';
import {FiltroGestioneUtentiComponent} from './gestisci-utenti/filtro-gestione-utenti/filtro-gestione-utenti.component';

import {DatiUtenteComponent} from './gestisci-utenti/dati-utente/dati-utente.component';
import {DatiPermessoComponent} from './gestisci-utenti/dati-permesso/dati-permesso.component';
import {AmministrativoParentComponent} from './amministrativo-parent.component';
import {GestisciSocietaComponent} from './anagrafiche/gestisci-societa/gestisci-societa.component';
import {FiltroGestioneSocietaComponent} from './anagrafiche/gestisci-societa/filtro-gestione-societa/filtro-gestione-societa.component';
import {GestisciLivelliTerritorialiComponent} from './anagrafiche/gestisci-livelli-territoriali/gestisci-livelli-territoriali.component';
import {FiltroGestioneLivelliTerritorialiComponent} from './anagrafiche/gestisci-livelli-territoriali/filtro-gestione-livelli-territoriali/filtro-gestione-livelli-territoriali.component';
import {GestisciBannerComponent} from './gestisci-banner/gestisci-banner.component';
import {FiltroGestioneBannerComponent} from './gestisci-banner/filtro-gestione-banner/filtro-gestione-banner.component';
import {DatiBannerComponent} from './gestisci-banner/dati-banner/dati-banner.component';
import {FormBannerComponent} from './gestisci-banner/form-banner/form-banner.component';
import {GestisciEntiComponent} from './anagrafiche/gestisci-enti/gestisci-enti.component';
import {MonitoraAccessiComponent} from './monitora-accessi/monitora-accessi.component';
import {FiltroMonitoraggioAccessiComponent} from './monitora-accessi/filtro-monitoraggio-accessi/filtro-monitoraggio-accessi.component';
import {RaggruppamentoTipologieComponent} from './anagrafiche/raggruppamento-tipologie/raggruppamento-tipologie.component';
import {FiltroRaggruppamentoTipologieComponent} from './anagrafiche/raggruppamento-tipologie/filtro-raggruppamento-tipologie/filtro-raggruppamento-tipologie.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../../../../app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DesignAngularKitModule} from 'design-angular-kit';
import {UserIdleModule} from 'angular-user-idle';
import {DpDatePickerModule} from 'ng2-date-picker';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AccordionModule} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TabViewModule} from 'primeng/tabview';
import {ToolbarModule} from 'primeng/toolbar';
import {NgxCurrencyModule} from 'ngx-currency';
import {CustomFormsModule} from 'ngx-custom-validators';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TreeTableModule} from 'primeng/treetable';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {ConfirmationService} from 'primeng/api';
import {JwtInterceptorService} from '../../../../services/jwt-interceptor.service';
import {BackendInterceptorService} from '../../../../services/backend-interceptor';
import {ErrorHandlerGenerico} from '../../../../services/errorHandlerGenerico';
import {UrlBackInterceptor} from '../../../../services/urlBack.interceptor';
import {PipeModule} from '../../../../pipe/pipe.module';
import {CommonComponentModule} from '../../../../components/common-component.module';
import {FormSocietaComponent} from './anagrafiche/gestisci-societa/form-societa/form-societa.component';
import {DatiSocietaComponent} from './anagrafiche/gestisci-societa/dati-societa/dati-societa.component';
import {DatiLivelloTerritorialeComponent} from './anagrafiche/gestisci-livelli-territoriali/dati-livello-territoriale/dati-livello-territoriale.component';
import {FormLivelloTerritorialeComponent} from './anagrafiche/gestisci-livelli-territoriali/form-livello-territoriale/form-livello-territoriale.component';
import {FiltroGestioneEntiComponent} from './anagrafiche/gestisci-enti/filtro-gestione-enti/filtro-gestione-enti.component';
import {DettaglioAccessoComponent} from './monitora-accessi/dettaglio-accesso/dettaglio-accesso.component';
import {DatiAccessoComponent} from './monitora-accessi/dati-accesso/dati-accesso.component';
import {DatiEnteComponent} from './anagrafiche/gestisci-enti/dati-ente/dati-ente.component';
import {FormEnteComponent} from './anagrafiche/gestisci-enti/form-ente/form-ente.component';
import {DatiRaggruppamentoTipologieComponent} from './anagrafiche/raggruppamento-tipologie/dati-raggruppamento-tipologie/dati-raggruppamento-tipologie.component';
import {FormRaggruppamentoTipologieComponent} from './anagrafiche/raggruppamento-tipologie/form-raggruppamento-tipologie/form-raggruppamento-tipologie.component';
import {GestisciCampoTipologiaServizioComponent} from './gestisci-servizi/gestisci-campo-tipologia-servizio/gestisci-campo-tipologia-servizio.component';

@NgModule({
  declarations: [
    FormUtentePermessiComponent,
    GestisciUtentiComponent,
    TabViewComponent,
    ToolbarComponent,
    PaginatorComponent,
    FiltroGestioneUtentiComponent,
    DatiUtenteComponent,
    DatiPermessoComponent,
    AmministrativoParentComponent,
    GestisciSocietaComponent,
    FiltroGestioneSocietaComponent,
    GestisciLivelliTerritorialiComponent,
    FiltroGestioneLivelliTerritorialiComponent,
    GestisciBannerComponent,
    FiltroGestioneBannerComponent,
    DatiBannerComponent,
    FormBannerComponent,
    GestisciEntiComponent,
    MonitoraAccessiComponent,
    FiltroMonitoraggioAccessiComponent,
    RaggruppamentoTipologieComponent,
    FiltroRaggruppamentoTipologieComponent,
    FormSocietaComponent,
    DatiSocietaComponent,
    DatiLivelloTerritorialeComponent,
    FormLivelloTerritorialeComponent,
    DatiSocietaComponent,
    FiltroGestioneEntiComponent,
    DettaglioAccessoComponent,
    DatiAccessoComponent,
    DatiEnteComponent,
    FormEnteComponent,
    DatiRaggruppamentoTipologieComponent,
    FormRaggruppamentoTipologieComponent,
    GestisciCampoTipologiaServizioComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
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
    DpDatePickerModule,
    NgxCurrencyModule,
    CustomFormsModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    CustomFormsModule,
    AutoCompleteModule,
    TreeTableModule,
    CKEditorModule,
    PipeModule,
    CommonComponentModule
  ],
  providers: [
    ConfirmationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: BackendInterceptorService, multi: true},
    {provide: ErrorHandler, useClass: ErrorHandlerGenerico},
    {provide: HTTP_INTERCEPTORS, useClass: UrlBackInterceptor, multi: true}
  ]
})
export class AmministrativoModule {
}
