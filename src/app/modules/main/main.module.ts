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
import {WaitingL1Component} from "./components/waitingL1/waiting-l1.component";
import { FormSocietaComponent } from './components/amministrativo/anagrafiche/gestisci-societa/form-societa/form-societa.component';
import { DatiSocietaComponent } from './components/amministrativo/anagrafiche/gestisci-societa/dati-societa/dati-societa.component';
import { DatiLivelloTerritorialeComponent } from './components/amministrativo/anagrafiche/gestisci-livelli-territoriali/dati-livello-territoriale/dati-livello-territoriale.component';
import { FormLivelloTerritorialeComponent } from './components/amministrativo/anagrafiche/gestisci-livelli-territoriali/form-livello-territoriale/form-livello-territoriale.component';
import { FiltroGestioneEntiComponent } from './components/amministrativo/anagrafiche/gestisci-enti/filtro-gestione-enti/filtro-gestione-enti.component';
import {DettaglioAccessoComponent} from './components/amministrativo/monitora-accessi/dettaglio-accesso/dettaglio-accesso.component';
import { DatiAccessoComponent } from './components/amministrativo/monitora-accessi/dati-accesso/dati-accesso.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { DatiEnteComponent } from './components/amministrativo/anagrafiche/gestisci-enti/dati-ente/dati-ente.component';
import { FormEnteComponent } from './components/amministrativo/anagrafiche/gestisci-enti/form-ente/form-ente.component';
import {DatiRaggruppamentoTipologieComponent} from './components/amministrativo/anagrafiche/raggruppamento-tipologie/dati-raggruppamento-tipologie/dati-raggruppamento-tipologie.component';
import {FormRaggruppamentoTipologieComponent} from './components/amministrativo/anagrafiche/raggruppamento-tipologie/form-raggruppamento-tipologie/form-raggruppamento-tipologie.component';
import { GestisciCampoTipologiaServizioComponent } from './components/amministrativo/gestisci-servizi/gestisci-campo-tipologia-servizio/gestisci-campo-tipologia-servizio.component';

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
    DpDatePickerModule,
    CKEditorModule
  ],
  exports: [
    FooterComponent,
    ReplacePipe,
    FiltriIMieiPagamentiComponent,
    FiltroGestioneEntiComponent
  ]
})
export class MainModule {
}
