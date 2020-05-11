import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeriservataComponent } from './components/homeriservata/homeriservata.component';
import { MainRoutingModule } from './main-routing.module';
import { CarrelloComponent } from './components/carrello/carrello.component';
import { PresaincaricopagamentoComponent } from './components/presaincaricopagamento/presaincaricopagamento.component';
import {DesignAngularKitModule} from "design-angular-kit";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [HomeriservataComponent, CarrelloComponent, PresaincaricopagamentoComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    DesignAngularKitModule,
    FormsModule
  ]
})
export class MainModule { }
