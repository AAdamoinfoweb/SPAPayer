import { Component, OnInit } from '@angular/core';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {PrezzoService} from "./PrezzoService";

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  isCompilato: boolean = false;

  importoTotale: number = 1234; //mock

  constructor(private compilazioneService: CompilazioneService, private prezzoService: PrezzoService) {
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
}
