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

  lunghezzaMaxCol1: number = 5;
  lunghezzaMaxCol2: number = 10;
  lunghezzaMaxCol3: number = 15;

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
    let campiMockati: Array<CampoForm> = [];
    let campo = {
      id: 1,
      titolo: 'Importo',
      obbligatorio: true,
      tipoCampo: 'importo',
      informazioni: 'Inserisci un importo',
      lunghezzaVariabile: true,
      lunghezza: 5,
      campoFisso: true,
      disabilitato: false,
      posizione: 1,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    this.valoriCampi = {};
    this.listaCampi = [];
    this.impostaCampi(campiMockati);
  }

  calcolaDimensioneCampo(campo: CampoForm): string {
    let classe;

    if (campo.tipoCampo === 'date') {
      classe = 'col-md-4';
    } else if (campo.tipoCampo === 'datemmyy') {
      classe = 'col-md-3';
    } else if (campo.tipoCampo === 'dateyy') {
      classe = 'col-md-1';
    } else if (campo.tipoCampo === 'importo') {
      classe = 'col-md-2';
    } else {
      if (campo.lunghezza <= this.lunghezzaMaxCol1) {
        classe = 'col-md-1';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol2) {
        classe = 'col-md-2';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol3) {
        classe = 'col-md-3';
      } else {
        classe = 'col-md-4';
      }
    }

    return classe;
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
        this.impostaCampi(this.listaCampiTipologiaServizio);
        this.impostaCampi(this.listaCampiServizio);
      })).subscribe();
    }
  }

  impostaCampi(campi: Array<CampoForm>): void {
    campi.sort((campo1: CampoForm, campo2: CampoForm) => {
      return campo1.posizione > campo2.posizione ? 1 : (campo1.posizione < campo2.posizione ? -1 : 0);
    });

    campi.forEach(campo => {
      campo['nome'] = campo.titolo.trim();

      switch (campo.tipoCampo) {
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
        case 'select':
          //TODO definire il formato delle opzioni ricevute per la Select
          this.valoriCampi[campo['nome']] = null;
          break;
      }

      this.listaCampi.push(campo);
    });
  }
}
