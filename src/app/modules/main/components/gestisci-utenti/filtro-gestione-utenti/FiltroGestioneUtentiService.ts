import {EventEmitter, Injectable} from '@angular/core';
import {Servizio} from '../../../model/Servizio';

@Injectable({
  providedIn: 'root'
})
export class FiltroGestioneUtentiService {

  filtroGestioneUtentiEvent: EventEmitter<Servizio> = new EventEmitter<Servizio>();

}
