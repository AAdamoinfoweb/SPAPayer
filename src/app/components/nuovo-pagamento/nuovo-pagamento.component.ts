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

  constructor(private compilazioneService: CompilazioneService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.compila();
    })).subscribe();
  }

  ngOnInit(): void {
  }

  compila(): void {
    this.isCompilato = true;
  }
}
