import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './modules/main/components/home/home.component';
import {AuthguardService} from './services/authguard.service';
import {CarrelloComponent} from "./modules/main/components/carrello/carrello.component";
import {PresaincaricopagamentoComponent} from "./modules/main/components/presaincaricopagamento/presaincaricopagamento.component";
import {PrivacyComponent} from "./modules/main/components/privacy/privacy.component";
import {NonautorizzatoComponent} from "./modules/nonautorizzato/nonautorizzato.component";
import {WaitingComponent} from "./modules/main/components/waiting/waiting.component";
import {GenericErrorComponent} from "./modules/generic-error/generic-error.component";
import {NuovoPagamentoComponent} from './modules/main/components/nuovo-pagamento/nuovo-pagamento.component';
import {IMieiPagamentiComponent} from './modules/main/components/i-miei-pagamenti/i-miei-pagamenti.component';
import {GestisciUtentiComponent} from "./components/gestisci-utenti/gestisci-utenti.component";

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
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
  {path: 'carrelloL1', component: CarrelloComponent},
  {path: 'presaincaricopagamento', component: PresaincaricopagamentoComponent},
  {path: 'waiting', component: WaitingComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'nuovoPagamento', component: NuovoPagamentoComponent},
  {path: 'iMieiPagamenti', component: IMieiPagamentiComponent}
  {path: 'gestisciutenti', component: GestisciUtentiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
