import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeriservataComponent } from './components/homeriservata/homeriservata.component';
import { MainRoutingModule } from './main-routing.module';



@NgModule({
  declarations: [HomeriservataComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
