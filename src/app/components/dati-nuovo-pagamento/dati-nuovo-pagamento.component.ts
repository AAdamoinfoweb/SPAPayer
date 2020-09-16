import { Component, OnInit } from '@angular/core';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {PrezzoService} from '../nuovo-pagamento/PrezzoService';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento/nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit {
  sommaDaRicevere: number;

  servizioSelezionato: string = null;

  listaCampiTipologiaServizio: Array<CampoForm> = [];
  listaCampiBollettino: Array<CampoForm> = [];
  listaCampiServizio: Array<CampoForm> = [];


  constructor(private nuovoPagamentoService: NuovoPagamentoService, private prezzoService: PrezzoService, private compilazioneService: CompilazioneService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
      this.compila();
    })).subscribe();
  }

  ngOnInit(): void {
    this.mockAggiornaPrezzoCarrello();
  }

  mockAggiornaPrezzoCarrello(): void {
    this.sommaDaRicevere = 999;
    this.aggiornaPrezzoCarrello();
  }

  aggiornaPrezzoCarrello(): void {
    this.prezzoService.prezzoEvent.emit(this.sommaDaRicevere);
  }

  compila(): void {
    this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizioSelezionato).pipe(map(campiNuovoPagamento => {
      this.listaCampiTipologiaServizio = campiNuovoPagamento.campiTipologiaServizio;
      this.listaCampiBollettino = campiNuovoPagamento.campiBollettino;
      this.listaCampiServizio = campiNuovoPagamento.campiServizio;
    })).subscribe();
  }
}
