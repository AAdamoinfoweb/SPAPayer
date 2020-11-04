import {NgForm} from '@angular/forms';
import {EventEmitter} from '@angular/core';


export abstract class FiltroGestioneElementiComponent {

  protected constructor() {
  }

  abstract listaElementi: Array<any>;

  abstract onChangeListaElementi: EventEmitter<any[]>;

  abstract pulisciFiltri(filtroForm: NgForm): void;

  abstract cercaElementi(): void;

}
