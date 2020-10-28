import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {NgForm} from '@angular/forms';
import {Accesso} from '../../../../model/accesso/Accesso';

@Component({
  selector: 'app-filtro-monitoraggio-accessi',
  templateUrl: './filtro-monitoraggio-accessi.component.html',
  styleUrls: ['./filtro-monitoraggio-accessi.component.scss']
})
export class FiltroMonitoraggioAccessiComponent extends FiltroGestioneElementiComponent implements OnInit {

  @Input()
  listaElementi: Array<any> = new Array<Accesso>();

  @Output()
  onChangeListaElementi: EventEmitter<any[]> = new EventEmitter<Accesso[]>();

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  cercaElementi(): void {
  }

  pulisciFiltri(filtroForm: NgForm): void {
  }

}
