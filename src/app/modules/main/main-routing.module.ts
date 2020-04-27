import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeriservataComponent } from './components/homeriservata/homeriservata.component';


const routes: Routes = [
  { path: '', component: HomeriservataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
