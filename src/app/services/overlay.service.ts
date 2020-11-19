import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';
import {Router} from "@angular/router";
import {DatiModaleCampo} from '../modules/main/components/amministrativo/gestisci-servizi/gestisci-tipologia-servizio/modale-campo-form/modale-campo-form.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(private router: Router) {
  }

  mostraModaleDettaglioPagamentoEvent: EventEmitter<DatiPagamento> = new EventEmitter<DatiPagamento>();
  mostraModaleCampoEvent: EventEmitter<DatiModaleCampo> = new EventEmitter<DatiModaleCampo>();
  mostraModaleTipoCampoEvent: EventEmitter<any> = new EventEmitter<any>();

  gestisciErrore(): void {
    this.router.navigateByUrl("/erroregenerico");
  }
}
