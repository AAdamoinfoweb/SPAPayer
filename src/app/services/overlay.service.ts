import {EventEmitter, Injectable} from "@angular/core";
import {RichiestaDettaglioPagamento} from '../modules/main/model/bollettino/RichiestaDettaglioPagamento';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  caricamentoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  mostraModaleDettaglioPagamentoEvent: EventEmitter<RichiestaDettaglioPagamento> = new EventEmitter<RichiestaDettaglioPagamento>();
}
