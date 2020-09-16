import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  /*
    Esempio di CampoForm

    campoFisso: true
    disabilitato: null
    id: 1
    lunghezza: 15
    lunghezzaVariabile: false
    obbligatorio: true
    tipoCampo: "string"
    titolo: "Campo bollettino prova"
   */

  sommaDaRicevere: number;

  servizioSelezionato: string = null;

  listaCampiTipologiaServizio: Array<CampoForm> = [];
  listaCampiBollettino: Array<CampoForm> = [];
  listaCampiServizio: Array<CampoForm> = [];

  formDati: FormGroup;

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

      //TODO inserire logica anche per gli array tipologiaServizio e servizio

      let gruppo = {}
      this.listaCampiBollettino.forEach(campo => {
        gruppo[campo.titolo] = new FormControl('');
      })
      this.formDati = new FormGroup(gruppo);
    })).subscribe();
  }

  inviaDati(): void {

  }
}
