import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {PrezzoService} from '../nuovo-pagamento/PrezzoService';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {map} from 'rxjs/operators';
import {CampiNuovoPagamento} from '../../modules/main/model/CampiNuovoPagamento';
import * as moment from 'moment';

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

  mesi: Array<any> = [
    {value: 1, label: 'gennaio'},
    {value: 2, label: 'febbraio'},
    {value: 3, label: 'marzo'},
    {value: 4, label: 'aprile'},
    {value: 5, label: 'maggio'},
    {value: 6, label: 'giugno'},
    {value: 7, label: 'luglio'},
    {value: 8, label: 'agosto'},
    {value: 9, label: 'settembre'},
    {value: 10, label: 'ottobre'},
    {value: 11, label: 'novembre'},
    {value: 12, label: 'dicembre'}
  ];

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
      informazioni: 'Inserisci un testo',
      lunghezza: 20,
      lunghezzaVariabile: true,
      obbligatorio: true,
      posizione: 2,
      tipoCampo: 'string',
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

    mockCampoForm.tipoCampo = 'number';
    mockCampoForm.informazioni = 'Inserisci un numero';
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;

    mockCampoForm.tipoCampo = 'boolean';
    mockCampoForm.informazioni = 'Seleziona un booleano';
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;

    mockCampoForm.tipoCampo = 'date';
    mockCampoForm.informazioni = 'Inserisci una data dd-mm-yyyy';
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;

    mockCampoForm.tipoCampo = 'datemmyy';
    mockCampoForm.informazioni = 'Inserisci una data dd-mm-yyyy';
    mockCampoForm.lunghezza = 10;
    clone = cloneFn(mockCampoForm);
    clone.titolo += '' + i;
    this.listaCampiTipologiaServizio.push(clone);
    i++;

    this.valoriCampi = {};
    this.listaCampi = [];
    this.listaCampiTipologiaServizio.forEach(campo => {
      this.aggiungiCampo(campo);
    });
    this.listaCampiServizio.forEach(campo => {
      this.aggiungiCampo(campo);
    });
  }

  isCampoGrande(campo) {
    const lunghezzaMaxCampoPiccolo = 10;
    return campo.lunghezza > lunghezzaMaxCampoPiccolo;
  }

  aggiornaPrezzoCarrello(): void {
    this.prezzoService.prezzoEvent.emit(this.importoTotale);
  }

  calcolaMaxGiorni(mese: number, anno: number): number {
    let maxGiorni;

    if (mese === 2) {
      maxGiorni = anno % 4 === 0 ? 29 : 28;
    } else if (mese === 4 || mese === 6 || mese === 9 || mese === 11) {
      maxGiorni = 30;
    } else {
      maxGiorni = 31;
    }

    return maxGiorni;
  }

  calcolaMaxAnno(): number {
    return moment().year();
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

    switch (campo.tipoCampo) {
      case 'boolean':
        this.valoriCampi[campo['nome']] = false;
        break;
      case 'string':
        this.valoriCampi[campo['nome']] = null;
        break;
      case 'number':
        this.valoriCampi[campo['nome']] = null;
        break;
      case 'date':
        this.valoriCampi[campo['nome']] = {
          giorno: null,
          mese: null,
          anno: null
        };
        break;
      case 'datemmyy':
        this.valoriCampi[campo['nome']] = {
          mese: null,
          anno: null
        };
        break;
      case 'dateyy':
        this.valoriCampi[campo['nome']] = null;
        break;
    }

    this.listaCampi.push(campo);
  }
}
