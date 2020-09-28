import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {DatiPagamentoService} from "../dati-nuovo-pagamento/DatiPagamentoService";
import {PagamentoService} from './PagamentoService';
import {livelloIntegrazione} from 'src/app/enums/livelloIntegrazione.enum';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  isCompilato: boolean = false;

  // assegno l'enum livelloIntegrazione alla viariable livelloIntegrazioneEnum in modo da poterlo usare nella parte HTML
  livelloIntegrazioneEnum = livelloIntegrazione;
  livelloIntegrazioneId: number;

  importoTotale: number = null;

  isFaseVerificaPagamento: boolean = false;

  tooltipBottoneSalvaPerDopo: string;

  constructor(private compilazioneService: CompilazioneService, private datiPagamentoService: DatiPagamentoService,
              private pagamentoService: PagamentoService) {
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
    this.livelloIntegrazioneId = servizio?.livelloIntegrazioneId;
    this.isFaseVerificaPagamento = false;
  }

  pulisciValoriSezioneDati(): void {
    // this.pagamentoService.pulisciEvent.emit({});
    // TODO reset campi form
  }

  procediAVerificaPagamento(): void {
    this.isFaseVerificaPagamento = true;
    this.pagamentoService.faseVerificaEvent.emit(this.isFaseVerificaPagamento);
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
