import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {DatiPagamentoService} from "../dati-nuovo-pagamento/DatiPagamentoService";
import {BottoniService} from './BottoniService';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  isCompilato: boolean = false;

  importoTotale: number = null;

  isFaseVerificaPagamento: boolean = false;

  tooltipBottoneSalvaPerDopo: string;

  constructor(private compilazioneService: CompilazioneService, private datiPagamentoService: DatiPagamentoService,
              private bottoniService: BottoniService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.compila(servizioSelezionato);
    })).subscribe();
    this.datiPagamentoService.prezzoEvent.pipe(map(prezzo => {
      this.importoTotale = prezzo;
    })).subscribe();
  }

  ngOnInit(): void {
  }

  compila(servizio): void {
    this.isCompilato = servizio != null;
  }

  pulisciValoriSezioneDati(): void {
    this.bottoniService.bottoniEvent.emit({});
  }

  procediAVerificaPagamento(): void {
    this.isFaseVerificaPagamento = !this.isFaseVerificaPagamento;
  }

  isUtenteAnonimo(): boolean {
    if (localStorage.getItem('nome') === 'null') {
      // tslint:disable-next-line:max-line-length
      this.tooltipBottoneSalvaPerDopo = 'É necessario autenticarsi per poter premere questo bottone e salvare il bollettino appena compilato nella sezione \"I miei pagamenti\"';
      return true;
    } else {
      this.tooltipBottoneSalvaPerDopo = '';
      return false;
    }
  }

}
