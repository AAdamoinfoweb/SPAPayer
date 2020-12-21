import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';
import {Router} from "@angular/router";
import {DatiModaleCampo} from '../modules/main/components/amministrativo/gestisci-tipologia-servizio/modale-campo-form/modale-campo-form.component';
import {TipoPortaleEsterno} from '../modules/main/model/configuraportaliesterni/TipoPortaleEsterno';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(private router: Router) {
  }

  mostraModaleDettaglioPagamentoEvent: EventEmitter<DatiPagamento> = new EventEmitter<DatiPagamento>();
  mostraModaleCampoEvent: EventEmitter<DatiModaleCampo> = new EventEmitter<DatiModaleCampo>();
  mostraModaleTipoCampoEvent: EventEmitter<number> = new EventEmitter<number>();
  mostraModaleTipoPortaleEsternoEvent: EventEmitter<TipoPortaleEsterno> = new EventEmitter<TipoPortaleEsterno>();

  gestisciErrore(): void {
    this.router.navigateByUrl("/erroregenerico");
  }
}
