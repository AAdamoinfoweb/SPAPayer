import {Component, OnInit} from '@angular/core';
import {Servizio} from '../../model/Servizio';
import {NuovoPagamentoService} from '../../../../services/nuovo-pagamento.service';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: Servizio;

  constructor(private nuovoPagamentoService: NuovoPagamentoService) {
    this.nuovoPagamentoService.compilazioneEvent.subscribe(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
    });
  }

  ngOnInit(): void {
  }

}
