import {Component, Input, OnInit} from '@angular/core';
import {FiltroServizio} from '../../model/FiltroServizio';
import {NuovoPagamentoService} from '../../../../services/nuovo-pagamento.service';
import {DatiPagamento} from '../../model/bollettino/DatiPagamento';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: FiltroServizio;

  @Input()
  datiPagamento: DatiPagamento;

  constructor(private nuovoPagamentoService: NuovoPagamentoService) {
    this.nuovoPagamentoService.compilazioneEvent.subscribe(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
    });
  }

  ngOnInit(): void {
  }

}
