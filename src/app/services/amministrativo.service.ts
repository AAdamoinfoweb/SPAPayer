import {EventEmitter, Injectable} from '@angular/core';
import {AsyncSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmministrativoService {

  mappaFunzioni = {};

  asyncAmministrativoSubject: AsyncSubject<any> = new AsyncSubject<any>();

  salvaCampoFormEvent: EventEmitter<any> = new EventEmitter<any>();

  salvaTipoPortaleEsternoEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }
}
