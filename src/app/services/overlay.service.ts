import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  caricamentoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  mostraModaleDettaglioPagamentoEvent: EventEmitter<number> = new EventEmitter<number>();
}
