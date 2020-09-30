import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  pulisciEvent: EventEmitter<object> = new EventEmitter<object>();
  impostaEvent: EventEmitter<object> = new EventEmitter<object>();
  faseVerificaEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
}
