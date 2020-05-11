import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AuthguardService} from './services/authguard.service';
import {CarrelloComponent} from "./modules/main/components/carrello/carrello.component";
import {PresaincaricopagamentoComponent} from "./modules/main/components/presaincaricopagamento/presaincaricopagamento.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'riservata',
    loadChildren: () => import('src/app/modules/main/main.module').then(m => m.MainModule),
    canActivate: [
      AuthguardService
    ]
  },
  {path: 'carrello', component: CarrelloComponent, canActivate: [AuthguardService]},
  {path: 'presaincaricopagamento', component: PresaincaricopagamentoComponent, canActivate: [AuthguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
