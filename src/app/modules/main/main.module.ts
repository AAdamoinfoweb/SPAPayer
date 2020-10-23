import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeriservataComponent} from './components/homeriservata/homeriservata.component';
import {MainRoutingModule} from './main-routing.module';
import {CarrelloL1Component} from './components/carrelloL1/carrello-l1.component';
import {PresaincaricopagamentoComponent} from './components/presaincaricopagamento/presaincaricopagamento.component';
import {DesignAngularKitModule} from "design-angular-kit";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxYoutubePlayerModule} from "ngx-youtube-player";
import {FooterComponent} from "../../components/footer/footer.component";
import {ListaPagamentiComponent} from './components/lista-pagamenti/lista-pagamenti.component';
import {PrivacyComponent} from './components/privacy/privacy.component';
import {ReplacePipe} from "../../pipe/ReplacePipe";
import {NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {WaitingComponent} from './components/waiting/waiting.component';
import {FiltriIMieiPagamentiComponent} from './components/i-miei-pagamenti/filtri-i-miei-pagamenti/filtri-i-miei-pagamenti.component';
import {DpDatePickerModule} from "ng2-date-picker";
import {CarrelloComponent} from "./components/carrello/carrello.component";
import {ListaPagamentiL1Component} from "./components/lista-pagamentiL1/lista-pagamenti-l1.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {WaitingL1Component} from "./components/waiting-l1/waiting-l1.component";
import {AggiungiSocietaComponent} from './components/amministrativo/anagrafiche/gestisci-societa/aggiungi-societa/aggiungi-societa.component';
import {ModificaSocietaComponent} from './components/amministrativo/anagrafiche/gestisci-societa/modifica-societa/modifica-societa.component';
import {DettaglioSocietaComponent} from './components/amministrativo/anagrafiche/gestisci-societa/dettaglio-societa/dettaglio-societa.component';
import {DatiSocietaComponent} from './components/amministrativo/anagrafiche/gestisci-societa/dati-societa/dati-societa.component';
import { FiltroGestioneEntiComponent } from './components/amministrativo/anagrafiche/gestisci-enti/filtro-gestione-enti/filtro-gestione-enti.component';

@NgModule({
  declarations: [
    HomeriservataComponent,
    CarrelloL1Component,
    CarrelloComponent,
    PresaincaricopagamentoComponent,
    FooterComponent,
    ListaPagamentiL1Component,
    ListaPagamentiComponent,
    PrivacyComponent,
    ReplacePipe,
    WaitingComponent,
    WaitingL1Component,
    FiltriIMieiPagamentiComponent,
    AggiungiSocietaComponent,
    ModificaSocietaComponent,
    DettaglioSocietaComponent,
    DatiSocietaComponent,
    FiltroGestioneEntiComponent,
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
    ConfirmDialogModule,
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
