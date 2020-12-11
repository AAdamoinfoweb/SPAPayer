import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './modules/main/components/home/home.component';
import {AuthguardService} from './services/authguard.service';
import {CarrelloL1Component} from './modules/main/components/carrelloL1/carrello-l1.component';
import {PresaincaricopagamentoComponent} from './modules/main/components/presaincaricopagamento/presaincaricopagamento.component';
import {PrivacyComponent} from './modules/main/components/privacy/privacy.component';
import {NonautorizzatoComponent} from './modules/nonautorizzato/nonautorizzato.component';
import {WaitingComponent} from './modules/main/components/waiting/waiting.component';
import {GenericErrorComponent} from './modules/generic-error/generic-error.component';
import {NuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/nuovo-pagamento.component';
import {IMieiPagamentiComponent} from './modules/main/components/i-miei-pagamenti/i-miei-pagamenti.component';
import {CarrelloComponent} from './modules/main/components/carrello/carrello.component';
import {WaitingL1Component} from './modules/main/components/waitingL1/waiting-l1.component';
import {GestisciUtentiComponent} from './modules/main/components/amministrativo/gestisci-utenti/gestisci-utenti.component';
import {FormUtentePermessiComponent} from './modules/main/components/amministrativo/gestisci-utenti/form-utente-permessi/form-utente-permessi.component';
import {GestisciSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/gestisci-societa.component';
import {FormSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/form-societa/form-societa.component';
import {GestisciEntiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-enti/gestisci-enti.component';
import {GestisciLivelliTerritorialiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/gestisci-livelli-territoriali.component';
import {FormLivelloTerritorialeComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/form-livello-territoriale/form-livello-territoriale.component';
import {GestisciBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/gestisci-banner.component';
import {FormBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/form-banner/form-banner.component';
import {MonitoraAccessiComponent} from './modules/main/components/amministrativo/monitora-accessi/monitora-accessi.component';
import {DettaglioAccessoComponent} from './modules/main/components/amministrativo/monitora-accessi/dettaglio-accesso/dettaglio-accesso.component';
import {PresaincaricopagamentoL1Component} from './modules/main/components/presaincaricopagamentoL1/presaincaricopagamento-l1.component';
import {FormEnteComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-enti/form-ente/form-ente.component';
import {RaggruppamentoTipologieComponent} from './modules/main/components/amministrativo/anagrafiche/raggruppamento-tipologie/raggruppamento-tipologie.component';
import {FormRaggruppamentoTipologieComponent} from './modules/main/components/amministrativo/anagrafiche/raggruppamento-tipologie/form-raggruppamento-tipologie/form-raggruppamento-tipologie.component';
import {FormTipologiaServizioComponent} from './modules/main/components/amministrativo/gestisci-tipologia-servizio/form-tipologia-servizio/form-tipologia-servizio.component';
import {GestisciTipologiaServizioComponent} from './modules/main/components/amministrativo/gestisci-tipologia-servizio/gestisci-tipologia-servizio.component';
import {FormServizioComponent} from './modules/main/components/amministrativo/gestisci-servizi/form-servizio/form-servizio.component';
import {GestisciStatisticheComponent} from './modules/main/components/amministrativo/gestisci-statistiche/gestisci-statistiche.component';
import {FormStatisticaComponent} from './modules/main/components/amministrativo/gestisci-statistiche/form-statistica/form-statistica.component';
import {GestisciAttivitaPianificateComponent} from './modules/main/components/amministrativo/gestisci-attivita-pianificate/gestisci-attivita-pianificate.component';
import {FormAttivitaPianificateComponent} from './modules/main/components/amministrativo/gestisci-attivita-pianificate/form-attivita-pianificate/form-attivita-pianificate.component';
import {GestisciServiziComponent} from "./modules/main/components/amministrativo/gestisci-servizi/gestisci-servizi.component";
import {RendicontazioneComponent} from './modules/main/components/amministrativo/gestisciportale/rendicontazione/rendicontazione.component';
import {DettaglioRendicontazioneComponent} from './modules/main/components/amministrativo/gestisciportale/rendicontazione/dettaglio-rendicontazione/dettaglio-rendicontazione.component';
import {MonitoraggioTransazioniComponent} from './modules/main/components/amministrativo/gestisciportale/monitoraggio-transazioni/monitoraggio-transazioni.component';
import {DettaglioTransazioneComponent} from './modules/main/components/amministrativo/gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-transazione.component';
import {DettaglioPendenzaComponent} from './modules/main/components/amministrativo/gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-pendenza/dettaglio-pendenza.component';
import {DettaglioEsitoNotificaComponent} from './modules/main/components/amministrativo/gestisciportale/monitoraggio-transazioni/dettaglio-transazione/dettaglio-esito-notifica/dettaglio-esito-notifica.component';
import {QuadraturaComponent} from './modules/main/components/amministrativo/gestisciportale/quadratura/quadratura.component';
import {DettaglioQuadraturaComponent} from './modules/main/components/amministrativo/gestisciportale/quadratura/dettaglio-quadratura/dettaglio-quadratura.component';
import {IuvSenzaBonificoComponent} from './modules/main/components/amministrativo/gestisciportale/quadratura/iuv-senza-bonifico/iuv-senza-bonifico.component';

const routes: Routes = [
  // { path: '',   redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  /*{
    path: 'riservata',
    loadChildren: () => import('src/app/modules/main/main.module').then(m => m.MainModule),
    canActivate: [
      AuthguardService
    ]
  },*/
  {path: 'erroregenerico', component: GenericErrorComponent},
  {path: 'nonautorizzato', component: NonautorizzatoComponent},
  {path: 'carrelloL1', component: CarrelloL1Component, pathMatch: 'full'},
  {path: 'carrello', component: CarrelloComponent, pathMatch: 'full'},
  {path: 'presaincaricopagamento', component: PresaincaricopagamentoComponent},
  {path: 'presaincaricopagamentoL1', component: PresaincaricopagamentoL1Component},
  {path: 'waitingL1', component: WaitingL1Component, pathMatch: 'full'},
  {path: 'waiting', component: WaitingComponent, pathMatch: 'full'},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'nuovoPagamento', component: NuovoPagamentoComponent, canActivate: [
      AuthguardService
    ]},
  {path: 'iMieiPagamenti', component: IMieiPagamentiComponent},
  {path: 'gestisciUtenti', component: GestisciUtentiComponent},
  {path: 'gestisciUtenti/aggiungiUtentePermessi', component: FormUtentePermessiComponent},
  {path: 'gestisciUtenti/modificaUtentePermessi/:userid', component: FormUtentePermessiComponent},
  {path: 'gestisciUtenti/dettaglioUtentePermessi/:userid', component: FormUtentePermessiComponent},
  {path: 'gestisciSocieta', component: GestisciSocietaComponent},
  {path: 'gestisciEnti', component: GestisciEntiComponent},
  {path: 'gestisciSocieta/aggiungiSocieta', component: FormSocietaComponent},
  {path: 'gestisciSocieta/modificaSocieta/:societaid', component: FormSocietaComponent},
  {path: 'gestisciSocieta/dettaglioSocieta/:societaid', component: FormSocietaComponent},
  {path: 'gestisciLivelliTerritoriali', component: GestisciLivelliTerritorialiComponent},
  {path: 'gestisciLivelliTerritoriali/aggiungiLivelloTerritoriale', component: FormLivelloTerritorialeComponent},
  {path: 'gestisciLivelliTerritoriali/modificaLivelloTerritoriale/:livelloterritorialeid', component: FormLivelloTerritorialeComponent},
  {path: 'gestisciLivelliTerritoriali/dettaglioLivelloTerritoriale/:livelloterritorialeid', component: FormLivelloTerritorialeComponent},
  {path: 'gestisciBanner', component: GestisciBannerComponent},
  {path: 'gestisciBanner/aggiungiBanner', component: FormBannerComponent},
  {path: 'gestisciBanner/modificaBanner/:bannerid', component: FormBannerComponent},
  {path: 'gestisciBanner/dettaglioBanner/:bannerid', component: FormBannerComponent},
  {path: 'monitoraAccessi', component: MonitoraAccessiComponent},
  {path: 'monitoraAccessi/dettaglioAccesso/:accessoid', component: DettaglioAccessoComponent},
  {path: 'gestisciEnti/aggiungiEnte', component: FormEnteComponent},
  {path: 'gestisciEnti/modificaEnte/:enteId', component: FormEnteComponent},
  {path: 'gestisciEnti/dettaglioEnte/:enteId', component: FormEnteComponent},
  {path: 'raggruppamentoTipologie', component: RaggruppamentoTipologieComponent},
  {path: 'raggruppamentoTipologie/aggiungiRaggruppamento', component: FormRaggruppamentoTipologieComponent},
  {path: 'raggruppamentoTipologie/modificaRaggruppamento/:raggruppamentoTipologiaServizioId', component: FormRaggruppamentoTipologieComponent},
  {path: 'raggruppamentoTipologie/dettaglioRaggruppamento/:raggruppamentoTipologiaServizioId', component: FormRaggruppamentoTipologieComponent},
  {path: 'gestisciTipologiaServizi', component: GestisciTipologiaServizioComponent},
  {path: 'gestisciTipologiaServizi/aggiungiTipologia', component: FormTipologiaServizioComponent},
  {path: 'gestisciTipologiaServizi/modificaTipologia/:tipologiaServizioId', component: FormTipologiaServizioComponent},
  {path: 'gestisciTipologiaServizi/dettaglioTipologia/:tipologiaServizioId', component: FormTipologiaServizioComponent},

  {path: 'configuraServizi', component: GestisciServiziComponent},
  {path: 'configuraServizi/aggiungiServizio', component: FormServizioComponent},
  {path: 'configuraServizi/modificaServizio/:servizioId', component: FormServizioComponent},
  {path: 'configuraServizi/dettaglioServizio/:servizioId', component: FormServizioComponent},


  {path: 'gestisciStatistiche', component: GestisciStatisticheComponent},
  {path: 'gestisciStatistiche/aggiungiStatistica', component: FormStatisticaComponent},
  {path: 'gestisciStatistiche/modificaStatistica/:statisticaId', component: FormStatisticaComponent},
  {path: 'gestisciStatistiche/dettaglioStatistica/:statisticaId', component: FormStatisticaComponent},
  {path: 'gestisciAttivitaPianificate', component: GestisciAttivitaPianificateComponent},
  {path: 'gestisciAttivitaPianificate/aggiungiAttivitaPianificata', component: FormAttivitaPianificateComponent},
  {path: 'gestisciAttivitaPianificate/modificaAttivitaPianificata/:attivitaId', component: FormAttivitaPianificateComponent},
  {path: 'gestisciAttivitaPianificate/dettaglioAttivitaPianificata/:attivitaId', component: FormAttivitaPianificateComponent},
  {path: 'rendicontazione', component: RendicontazioneComponent},
  {path: 'rendicontazione/dettaglioRendicontazione/:rendicontazioneId', component: DettaglioRendicontazioneComponent},
  {path: 'monitoraggioTransazioni', component: MonitoraggioTransazioniComponent},
  {path: 'monitoraggioTransazioni/dettaglioTransazioni/:transazioneId', component: DettaglioTransazioneComponent},
  {path: 'monitoraggioTransazioni/dettaglioTransazioni/dettaglioPendenza/:dettaglioTransazioneId', component: DettaglioPendenzaComponent},
  {path: 'monitoraggioTransazioni/:transazioneId/esitoNotifiche', component: DettaglioEsitoNotificaComponent},

  {path: 'quadratura', component: QuadraturaComponent},
  {path: 'quadratura/dettaglioQuadratura/:quadraturaId', component: DettaglioQuadraturaComponent},
  {path: 'iuvSenzaBonifico', component: IuvSenzaBonificoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
