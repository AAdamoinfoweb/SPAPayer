import {EventEmitter, Injectable} from '@angular/core';
import {ParametriRicercaUtente} from '../../../model/utente/ParametriRicercaUtente';

@Injectable({
  providedIn: 'root'
})
export class FiltroGestioneUtentiService {

  filtroGestioneUtentiEvent: EventEmitter<ParametriRicercaUtente> = new EventEmitter<ParametriRicercaUtente>();

}
