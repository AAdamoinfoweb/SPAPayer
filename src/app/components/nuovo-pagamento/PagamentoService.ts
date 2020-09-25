import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  bottoniEvent: EventEmitter<object> = new EventEmitter<object>();
  faseVerificaEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
}
