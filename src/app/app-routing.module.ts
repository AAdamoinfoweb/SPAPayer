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
import {WaitingL1Component} from "./modules/main/components/waiting-l1/waiting-l1.component";
import {GestisciUtentiComponent} from './modules/main/components/amministrativo/gestisci-utenti/gestisci-utenti.component';
import {AggiungiUtentePermessiComponent} from './modules/main/components/amministrativo/gestisci-utenti/aggiungi-utente-permessi/aggiungi-utente-permessi.component';
import {ModificaUtentePermessiComponent} from './modules/main/components/amministrativo/gestisci-utenti/modifica-utente-permessi/modifica-utente-permessi.component';
import {GestisciSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/gestisci-societa.component';
import {AggiungiSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/aggiungi-societa/aggiungi-societa.component';
import {ModificaSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/modifica-societa/modifica-societa.component';
import {DettaglioSocietaComponent} from './modules/main/components/amministrativo/anagrafiche/gestisci-societa/dettaglio-societa/dettaglio-societa.component';

const routes: Routes = [
  // { path: '',   redirectTo: '/home', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {
    path: 'riservata',
    loadChildren: () => import('src/app/modules/main/main.module').then(m => m.MainModule),
    canActivate: [
      AuthguardService
    ]
  },
  {path: 'erroregenerico', component: GenericErrorComponent},
  {path: 'nonautorizzato', component: NonautorizzatoComponent},
  {path: 'carrelloL1', component: CarrelloL1Component, pathMatch: 'full'},
  {path: 'carrello', component: CarrelloComponent, pathMatch: 'full'},
  {path: 'presaincaricopagamento', component: PresaincaricopagamentoComponent},
  {path: 'waitingL1', component: WaitingL1Component, pathMatch: 'full'},
  {path: 'waiting', component: WaitingComponent, pathMatch: 'full'},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'nuovoPagamento', component: NuovoPagamentoComponent},
  {path: 'iMieiPagamenti', component: IMieiPagamentiComponent},
  {path: 'gestioneUtenti', component: GestisciUtentiComponent},
  {path: 'aggiungiUtentePermessi', component: AggiungiUtentePermessiComponent},
  {path: 'modificaUtentePermessi/:userid', component: ModificaUtentePermessiComponent},
  {path: 'societa', component: GestisciSocietaComponent},
  {path: 'aggiungiSocieta', component: AggiungiSocietaComponent},
  {path: 'modificaSocieta', component: ModificaSocietaComponent},
  {path: 'dettaglioSocieta', component: DettaglioSocietaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
