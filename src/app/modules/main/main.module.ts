import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeriservataComponent} from './components/homeriservata/homeriservata.component';
import {MainRoutingModule} from './main-routing.module';
import {CarrelloComponent} from './components/carrello/carrello.component';
import {PresaincaricopagamentoComponent} from './components/presaincaricopagamento/presaincaricopagamento.component';
import {DesignAngularKitModule} from "design-angular-kit";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxYoutubePlayerModule} from "ngx-youtube-player";
import {FooterComponent} from "../../components/footer/footer.component";
import {ListaPagamentiComponent} from './components/lista-pagamenti/lista-pagamenti.component';
import {PrivacyComponent} from './components/privacy/privacy.component';
import {LoginBarComponent} from "../../components/login-bar/login-bar.component";
import {ReplacePipe} from "../../pipe/ReplacePipe";
import {NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import { WaitingComponent } from './components/waiting/waiting.component';
import { FiltriIMieiPagamentiComponent } from './components/i-miei-pagamenti/filtri-i-miei-pagamenti/filtri-i-miei-pagamenti.component';
import {DpDatePickerModule} from "ng2-date-picker";

@NgModule({
  declarations: [
    HomeriservataComponent,
    CarrelloComponent,
    PresaincaricopagamentoComponent,
    FooterComponent,
    ListaPagamentiComponent,
    PrivacyComponent,
    ReplacePipe,
    WaitingComponent,
    FiltriIMieiPagamentiComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    DesignAngularKitModule,
    FormsModule,
    ReactiveFormsModule,
    NgxYoutubePlayerModule,
    NgbPaginationModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    DpDatePickerModule
  ],
  exports: [
    FooterComponent,
    ReplacePipe,
    FiltriIMieiPagamentiComponent
  ]
})
export class MainModule {
}
