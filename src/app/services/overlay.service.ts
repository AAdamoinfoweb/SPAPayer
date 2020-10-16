import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  caricamentoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  mostraModaleDettaglioPagamentoEvent: EventEmitter<DatiPagamento> = new EventEmitter<DatiPagamento>();

  gestisciErrore(): void {
    this.caricamentoEvent.emit(false);
    window.open('/erroregenerico', '_self');
  }
}
