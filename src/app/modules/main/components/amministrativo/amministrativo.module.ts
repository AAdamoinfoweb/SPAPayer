import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormUtentePermessiComponent} from './gestisci-utenti/form-utente-permessi/form-utente-permessi.component';
import {GestisciUtentiComponent} from './gestisci-utenti/gestisci-utenti.component';
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
import {HttpClientModule} from '@angular/common/http';
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
import {DatiBeneficiarioComponent} from './anagrafiche/gestisci-enti/dati-beneficiario/dati-beneficiario.component';
import {DatiContoCorrenteComponent} from './anagrafiche/gestisci-enti/dati-conto-corrente/dati-conto-corrente.component';
import {DialogModule} from 'primeng/dialog';
import {GestisciStatisticheComponent} from './gestisci-statistiche/gestisci-statistiche.component';
import {FiltroGestisciStatisticheComponent} from './gestisci-statistiche/filtro-gestisci-statistiche/filtro-gestisci-statistiche.component';
import {DatiStatisticaComponent} from './gestisci-statistiche/dati-statistica/dati-statistica.component';
import {FormStatisticaComponent} from './gestisci-statistiche/form-statistica/form-statistica.component';
import {GestisciAttivitaPianificateComponent} from './gestisci-attivita-pianificate/gestisci-attivita-pianificate.component';
import {FiltroGestioneAttivitaPianificateComponent} from './gestisci-attivita-pianificate/filtro-gestione-attivita-pianificate/filtro-gestione-attivita-pianificate.component';
import {DatiAttivitaPianificateComponent} from './gestisci-attivita-pianificate/dati-attivita-pianificate/dati-attivita-pianificate.component';
import {FormAttivitaPianificateComponent} from './gestisci-attivita-pianificate/form-attivita-pianificate/form-attivita-pianificate.component';
import {SchedulazioneComponent} from './schedulazione/schedulazione.component';
import {DatiParametroComponent} from './gestisci-attivita-pianificate/dati-parametri/dati-parametro.component';
import {DatiDestinatarioComponent} from './gestisci-statistiche/dati-destinatario/dati-destinatario.component';
import {SelezionaContoCorrenteComponent} from './anagrafiche/gestisci-enti/dati-conto-corrente/seleziona-conto-corrente/seleziona-conto-corrente.component';
import {FormTipologiaServizioComponent} from './gestisci-tipologia-servizio/form-tipologia-servizio/form-tipologia-servizio.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {GestisciTipologiaServizioComponent} from './gestisci-tipologia-servizio/gestisci-tipologia-servizio.component';
import {FiltroGestioneTipologiaServizioComponent} from './gestisci-tipologia-servizio/filtro-gestione-tipologia-servizio/filtro-gestione-tipologia-servizio.component';
import {ModaleCampoFormComponent} from './gestisci-tipologia-servizio/modale-campo-form/modale-campo-form.component';
import {ModaleAggiungiTipoCampoComponent} from './gestisci-tipologia-servizio/modale-campo-form/modale-aggiungi-tipo-campo/modale-aggiungi-tipo-campo.component';
import {FormServizioComponent} from './gestisci-servizi/form-servizio/form-servizio.component';
import {FiltroGestioneServizioComponent} from './gestisci-servizi/filtro-gestione-servizio/filtro-gestione-servizio.component';
import { GestisciServiziComponent } from './gestisci-servizi/gestisci-servizi.component';
import { FiltroRicercaServizioComponent } from './gestisci-servizi/filtro-ricerca-servizio/filtro-ricerca-servizio.component';
import {RendicontazioneComponent} from './gestisciportale/rendicontazione/rendicontazione.component';
import {FiltroRendicontazioneComponent} from './gestisciportale/rendicontazione/filtro-rendicontazione/filtro-rendicontazione.component';
import {DettaglioRendicontazioneComponent} from './gestisciportale/rendicontazione/dettaglio-rendicontazione/dettaglio-rendicontazione.component';
import { MonitoraggioTransazioniComponent } from './gestisciportale/monitoraggio-transazioni/monitoraggio-transazioni.component';
import { FiltroMonitoraggioTransazioniComponent } from './gestisciportale/monitoraggio-transazioni/filtro-monitoraggio-transazioni/filtro-monitoraggio-transazioni.component';
import {DatiRendicontazioneComponent} from './gestisciportale/rendicontazione/dati-rendicontazione/dati-rendicontazione.component';
import {DettaglioTransazioneComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-transazione.component';
import {DatiTransazioneComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dati-transazione/dati-transazione.component';
import {DettaglioPendenzaComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-pendenza/dettaglio-pendenza.component';
import {DatiPendenzaComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-pendenza/dati-pendenza/dati-pendenza.component';
import {DettaglioEsitoNotificaComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-esito-notifica/dettaglio-esito-notifica.component';
import {DatiNotificaComponent} from './gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-esito-notifica/dati-notifica/dati-notifica.component';
import {QuadraturaComponent} from './gestisciportale/quadratura/quadratura.component';
import {FiltroQuadraturaComponent} from './gestisciportale/quadratura/filtro-quadratura/filtro-quadratura.component';
import {DettaglioQuadraturaComponent} from './gestisciportale/quadratura/dettaglio-quadratura/dettaglio-quadratura.component';
import {DatiQuadraturaComponent} from './gestisciportale/quadratura/dati-quadratura/dati-quadratura.component';
import {IuvSenzaBonificoComponent} from './gestisciportale/iuv-senza-bonifico/iuv-senza-bonifico.component';
import {FiltroIuvSenzaBonificoComponent} from './gestisciportale/iuv-senza-bonifico/filtro-iuv-senza-bonifico/filtro-iuv-senza-bonifico.component';
import {ConfiguraPortaliEsterniComponent} from './configura-portali-esterni/configura-portali-esterni.component';
import {FiltroConfiguraPortaliEsterniComponent} from './configura-portali-esterni/filtro-configura-portali-esterni/filtro-configura-portali-esterni.component';
import {FormConfiguraPortaliEsterniComponent} from './configura-portali-esterni/form-configura-portali-esterni/form-configura-portali-esterni.component';
import {DatiPortaleEsternoComponent} from './configura-portali-esterni/dati-portale-esterno/dati-portale-esterno.component';
import {ModaleTipoPortaleEsternoComponent} from './configura-portali-esterni/modale-tipo-portale-esterno/modale-tipo-portale-esterno.component';


@NgModule({
  declarations: [
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
    DatiBeneficiarioComponent,
    DatiContoCorrenteComponent,
    GestisciStatisticheComponent,
    FiltroGestisciStatisticheComponent,
    DatiStatisticaComponent,
    FormStatisticaComponent,
    GestisciAttivitaPianificateComponent,
    FiltroGestioneAttivitaPianificateComponent,
    DatiAttivitaPianificateComponent,
    SchedulazioneComponent,
    FormAttivitaPianificateComponent,
    DatiParametroComponent,
    DatiDestinatarioComponent,
    SelezionaContoCorrenteComponent,
    FormUtentePermessiComponent,
    GestisciUtentiComponent,
    FormTipologiaServizioComponent,
    GestisciTipologiaServizioComponent,
    FiltroGestioneTipologiaServizioComponent,
    ModaleCampoFormComponent,
    ModaleAggiungiTipoCampoComponent,
    FormServizioComponent,
    FiltroGestioneServizioComponent,
    GestisciServiziComponent,
    FiltroRicercaServizioComponent,
    RendicontazioneComponent,
    FiltroRendicontazioneComponent,
    DettaglioRendicontazioneComponent,
    MonitoraggioTransazioniComponent,
    FiltroMonitoraggioTransazioniComponent,
    DatiRendicontazioneComponent,
    DettaglioTransazioneComponent,
    DatiTransazioneComponent,
    DettaglioPendenzaComponent,
    DatiPendenzaComponent,
    DettaglioEsitoNotificaComponent,
    DatiNotificaComponent,
    QuadraturaComponent,
    FiltroQuadraturaComponent,
    DettaglioQuadraturaComponent,
    DatiQuadraturaComponent,
    IuvSenzaBonificoComponent,
    FiltroIuvSenzaBonificoComponent,
    ConfiguraPortaliEsterniComponent,
    FiltroConfiguraPortaliEsterniComponent,
    FormConfiguraPortaliEsterniComponent,
    DatiPortaleEsternoComponent,
    ModaleTipoPortaleEsternoComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
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
    CommonComponentModule,
    DialogModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    DesignAngularKitModule,
    ReactiveFormsModule,
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 120}),
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
    CommonComponentModule,
    DragDropModule
  ],
  providers: [
    ConfirmationService
  ],
  exports: [
    ModaleCampoFormComponent,
    ModaleAggiungiTipoCampoComponent,
    ModaleTipoPortaleEsternoComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AmministrativoModule {
}
