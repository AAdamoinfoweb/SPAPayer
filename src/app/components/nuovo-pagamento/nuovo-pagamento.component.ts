import { Component, OnInit } from '@angular/core';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {PrezzoService} from './prezzoService';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: string = null;

  sommaDaRicevere: number = 1234; //mock

  isCompilato = false;

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
    this.isCompilato = true;
    this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizioSelezionato).pipe(map(campiNuovoPagamento => {
      this.listaCampiTipologiaServizio = campiNuovoPagamento.campiTipologiaServizio;
      this.listaCampiBollettino = campiNuovoPagamento.campiBollettino;
      this.listaCampiServizio = campiNuovoPagamento.campiServizio;
    })).subscribe();
  }
}
