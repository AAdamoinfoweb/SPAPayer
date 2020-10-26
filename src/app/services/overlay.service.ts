import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  mostraModaleDettaglioPagamentoEvent: EventEmitter<DatiPagamento> = new EventEmitter<DatiPagamento>();

  gestisciErrore(): void {
    window.open('/erroregenerico', '_self');
  }
}
