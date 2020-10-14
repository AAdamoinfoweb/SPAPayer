import {Component, Input, OnInit} from '@angular/core';
import {FiltroServizio} from '../../model/FiltroServizio';
import {NuovoPagamentoService} from '../../../../services/nuovo-pagamento.service';
import {RichiestaDettaglioPagamento} from '../../model/bollettino/RichiestaDettaglioPagamento';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: FiltroServizio;

  @Input()
  dettaglioPagamento: RichiestaDettaglioPagamento;

  constructor(private nuovoPagamentoService: NuovoPagamentoService) {
    this.nuovoPagamentoService.compilazioneEvent.subscribe(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
    });
  }

  ngOnInit(): void {
  }

}
