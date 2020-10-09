import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  caricamentoEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  mostraModaleEvent: EventEmitter<string> = new EventEmitter<string>();
  risultatoModaleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
}
