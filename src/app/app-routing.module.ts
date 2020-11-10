import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './modules/main/components/home/home.component';
import {AuthguardService} from './services/authguard.service';
import {CarrelloL1Component} from "./modules/main/components/carrelloL1/carrello-l1.component";
import {PresaincaricopagamentoComponent} from "./modules/main/components/presaincaricopagamento/presaincaricopagamento.component";
import {PrivacyComponent} from "./modules/main/components/privacy/privacy.component";
import {NonautorizzatoComponent} from "./modules/nonautorizzato/nonautorizzato.component";
import {WaitingComponent} from "./modules/main/components/waiting/waiting.component";
import {GenericErrorComponent} from "./modules/generic-error/generic-error.component";
import {NuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/nuovo-pagamento.component';
import {IMieiPagamentiComponent} from './modules/main/components/i-miei-pagamenti/i-miei-pagamenti.component';
import {CarrelloComponent} from "./modules/main/components/carrello/carrello.component";
import {WaitingL1Component} from "./modules/main/components/waitingL1/waiting-l1.component";
import {GestisciUtentiComponent} from './modules/main/components/amministrativo/gestisci-utenti/gestisci-utenti.component';
import {FormUtentePermessiComponent} from './modules/main/components/amministrativo/gestisci-utenti/form-utente-permessi/form-utente-permessi.component';
import {GestisciSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/gestisci-societa.component';
import {FormSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/form-societa/form-societa.component';
import {GestisciEntiComponent} from "./modules/main/components/amministrativo/anagrafiche/gestisci-enti/gestisci-enti.component";
import {GestisciLivelliTerritorialiComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/gestisci-livelli-territoriali.component';
import {FormLivelloTerritorialeComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-livelli-territoriali/form-livello-territoriale/form-livello-territoriale.component';
import {GestisciBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/gestisci-banner.component';
import {FormBannerComponent} from './modules/main/components/amministrativo/gestisci-banner/form-banner/form-banner.component';
import {MonitoraAccessiComponent} from './modules/main/components/amministrativo/monitora-accessi/monitora-accessi.component';
import {DettaglioAccessoComponent} from './modules/main/components/amministrativo/monitora-accessi/dettaglio-accesso/dettaglio-accesso.component';
import {PresaincaricopagamentoL1Component} from "./modules/main/components/presaincaricopagamentoL1/presaincaricopagamento-l1.component";
import {FormEnteComponent} from "./modules/main/components/amministrativo/anagrafiche/gestisci-enti/form-ente/form-ente.component";
import {RaggruppamentoTipologieComponent} from './modules/main/components/amministrativo/anagrafiche/raggruppamento-tipologie/raggruppamento-tipologie.component';
import {FormRaggruppamentoTipologieComponent} from './modules/main/components/amministrativo/anagrafiche/raggruppamento-tipologie/form-raggruppamento-tipologie/form-raggruppamento-tipologie.component';
import {FormTipologiaServizioComponent} from "./modules/main/components/amministrativo/gestisci-servizi/gestisci-tipologia-servizio/form-tipologia-servizio/form-tipologia-servizio.component";
import {GestisciTipologiaServizioComponent} from './modules/main/components/amministrativo/gestisci-servizi/gestisci-tipologia-servizio/gestisci-tipologia-servizio.component';

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
  {path: 'gestisciTipologiaServizi/dettaglioTipologia/:tipologiaServizioId', component: FormRaggruppamentoTipologieComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
