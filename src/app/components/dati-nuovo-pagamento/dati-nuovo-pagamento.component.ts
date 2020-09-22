import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {PrezzoService} from '../nuovo-pagamento/PrezzoService';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {map} from 'rxjs/operators';
import {CampiNuovoPagamento} from '../../modules/main/model/CampiNuovoPagamento';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento/nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit {
  importoTotale: number;

  servizioSelezionato: string = null;

  listaCampiTipologiaServizio: Array<CampoForm> = [];
  listaCampiServizio: Array<CampoForm> = [];
  listaCampi: Array<CampoForm> = [];
  valoriCampi: {};

  isVisibile: boolean = true;

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private prezzoService: PrezzoService, private compilazioneService: CompilazioneService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
      this.compila();
    })).subscribe();
  }

  ngOnInit(): void {
    this.mockAggiornaPrezzoCarrello();
    this.mockCampiForm();
  }

  aggiornaVisibilita(): void {
    this.isVisibile = !this.isVisibile;
  }

  mockAggiornaPrezzoCarrello(): void {
    this.importoTotale = 999;
    this.aggiornaPrezzoCarrello();
  }

  mockCampiForm(): void {
    const mockCampoForm: CampoForm = {
      campoFisso: true,
      campo_input: true,
      chiave: false,
      controllo_logico: null,
      disabilitato: false,
      id: 1,
      informazioni: 'Inserisci il cf',
      lunghezza: 20,
      lunghezzaVariabile: true,
      obbligatorio: true,
      posizione: 2,
      tipoCampo: 'number',
      titolo: 'Campo tipologia servizio prova'
    };

    const cloneFn = (obj) => {
      const clone = {};
      Object.keys(obj).forEach(key => {
        clone[key] = obj[key];
      });
      return clone;
    };

    let i = 1;
    let clone;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;

    this.valoriCampi = {};
    this.listaCampi = [];
    this.listaCampiTipologiaServizio.forEach((campo, indice) => {
      campo['nome'] = campo.titolo.trim();
      this.valoriCampi[campo['nome']] = null;
      this.listaCampi.push(campo);
    });
    this.listaCampiServizio.forEach(campo => {
      campo['nome'] = campo.titolo.trim();
      this.valoriCampi[campo['nome']] = null;
      this.listaCampi.push(campo);
    });
  }

  isCampoGrande(campo) {
    const lunghezzaMaxCampoPiccolo = 10;
    return campo.lunghezza > lunghezzaMaxCampoPiccolo;
  }

  aggiornaPrezzoCarrello(): void {
    this.prezzoService.prezzoEvent.emit(this.importoTotale);
  }

  compila(): void {
    const isCompilato = this.servizioSelezionato != null;

    if (isCompilato) {
      this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizioSelezionato).pipe(map(campiNuovoPagamento => {
        this.listaCampiTipologiaServizio = campiNuovoPagamento.campiTipologiaServizio;
        this.listaCampiServizio = campiNuovoPagamento.campiServizio;

        this.valoriCampi = {};
        this.listaCampi = [];
        this.listaCampiTipologiaServizio.forEach(campo => {
          this.aggiungiCampo(campo);
        });
        this.listaCampiServizio.forEach(campo => {
          this.aggiungiCampo(campo);
        });
      })).subscribe();
    }
  }

  aggiungiCampo(campo: CampoForm): void {
    campo['nome'] = campo.titolo.trim();

    if (campo.tipoCampo === 'boolean') {
      this.valoriCampi[campo['nome']] = false;
    } else {
    this.valoriCampi[campo['nome']] = null;
    }

    this.listaCampi.push(campo);
  }
}
