import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {PrezzoService} from "./PrezzoService";
import {BottoniService} from './BottoniService';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  isCompilato: boolean = false;

  importoTotale: number = 1234; //mock

  isFaseVerificaPagamento: boolean = false;

  constructor(private compilazioneService: CompilazioneService, private prezzoService: PrezzoService,
              private bottoniService: BottoniService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.compila(servizioSelezionato);
    })).subscribe();
    this.prezzoService.prezzoEvent.pipe(map(prezzo => {
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
}
