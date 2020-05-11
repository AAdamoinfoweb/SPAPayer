import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeriservataComponent } from './components/homeriservata/homeriservata.component';
import { MainRoutingModule } from './main-routing.module';
import { CarrelloComponent } from './components/carrello/carrello.component';
import { PresaincaricopagamentoComponent } from './components/presaincaricopagamento/presaincaricopagamento.component';



@NgModule({
  declarations: [HomeriservataComponent, CarrelloComponent, PresaincaricopagamentoComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
