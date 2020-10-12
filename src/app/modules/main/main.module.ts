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
import {LoginBarComponent} from "../../components/login-bar/login-bar.component";
import {ReplacePipe} from "../../pipe/ReplacePipe";
import {NgbDropdownModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import { WaitingComponent } from './components/waiting/waiting.component';
import {CarrelloComponent} from "./components/carrello/carrello.component";
import {ListaPagamentiL1Component} from "./components/lista-pagamentiL1/lista-pagamenti-l1.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";

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
    WaitingComponent
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
        ConfirmDialogModule
    ],
  exports: [
    FooterComponent,
    ReplacePipe
  ]
})
export class MainModule {
}
