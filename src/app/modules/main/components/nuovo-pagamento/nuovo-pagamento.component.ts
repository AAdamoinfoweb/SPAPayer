import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {CompilazioneService} from './compila-nuovo-pagamento/CompilazioneService';
import {DatiPagamentoService} from "./dati-nuovo-pagamento/DatiPagamentoService";
import {PagamentoService} from './PagamentoService';
import {livelloIntegrazione} from 'src/app/enums/livelloIntegrazione.enum';
import {Servizio} from '../../model/Servizio';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: Servizio;

  constructor(private compilazioneService: CompilazioneService, private datiPagamentoService: DatiPagamentoService) {
    this.compilazioneService.compilazioneEvent.subscribe(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
    });
  }

  ngOnInit(): void {
  }

}
