import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(private router: Router) {
  }

  mostraModaleDettaglioPagamentoEvent: EventEmitter<any> = new EventEmitter<any>();
  mostraModaleCampoEvent: EventEmitter<any> = new EventEmitter<any>();
  mostraModaleTipoCampoEvent: EventEmitter<any> = new EventEmitter<any>();

  gestisciErrore(): void {
    this.router.navigateByUrl("/erroregenerico");
  }
}
