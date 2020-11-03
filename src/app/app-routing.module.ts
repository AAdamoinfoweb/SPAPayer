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
  {path: 'gestioneUtenti', component: GestisciUtentiComponent},
  {path: 'gestioneUtenti/aggiungiUtentePermessi', component: FormUtentePermessiComponent},
  {path: 'gestioneUtenti/modificaUtentePermessi/:userid', component: FormUtentePermessiComponent},
  {path: 'gestioneUtenti/dettaglioUtentePermessi/:userid', component: FormUtentePermessiComponent},
  {path: 'societa', component: GestisciSocietaComponent},
  {path: 'enti', component: GestisciEntiComponent},
  {path: 'gestioneAnagrafiche/aggiungiSocieta', component: FormSocietaComponent},
  {path: 'gestioneAnagrafiche/modificaSocieta/:societaid', component: FormSocietaComponent},
  {path: 'gestioneAnagrafiche/dettaglioSocieta/:societaid', component: FormSocietaComponent},
  {path: 'livelliTerritoriali', component: GestisciLivelliTerritorialiComponent},
  {path: 'gestioneAnagrafiche/aggiungiLivelloTerritoriale', component: FormLivelloTerritorialeComponent},
  {path: 'modificaLivelloTerritoriale/:livelloterritorialeid', component: FormLivelloTerritorialeComponent},
  {path: 'dettaglioLivelloTerritoriale/:livelloterritorialeid', component: FormLivelloTerritorialeComponent},
  {path: 'gestisciBanner', component: GestisciBannerComponent},
  {path: 'gestioneBanner/aggiungiBanner', component: FormBannerComponent},
  {path: 'gestioneBanner/modificaBanner/:bannerid', component: FormBannerComponent},
  {path: 'gestioneBanner/dettaglioBanner/:bannerid', component: FormBannerComponent},
  {path: 'monitoraAccessi', component: MonitoraAccessiComponent},
  {path: 'dettaglioAccesso/:accessoid', component: DettaglioAccessoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
