import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {DatiPagamentoService} from '../dati-nuovo-pagamento/DatiPagamentoService';
import {CompilazioneService} from '../compila-nuovo-pagamento/CompilazioneService';
import {map} from 'rxjs/operators';
import {CampiNuovoPagamento} from '../../modules/main/model/CampiNuovoPagamento';
import * as moment from 'moment';
import {tipologicaSelect} from '../../enums/tipologicaSelect.enum';
import {OpzioneSelect} from '../../modules/main/model/OpzioneSelect';
import {Provincia} from '../../modules/main/model/Provincia';
import {Comune} from '../../modules/main/model/Comune';
import {BottoniService} from "../nuovo-pagamento/BottoniService";
import {tipoCampo} from '../../enums/tipoCampo.enum';
import {Servizio} from '../../modules/main/model/Servizio';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento/nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit {
  tipoCampo = tipoCampo; // per passare l'enum al template html

  importoTotale: number;

  servizioSelezionato: Servizio = null;

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

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private datiPagamentoService: DatiPagamentoService,
              private compilazioneService: CompilazioneService, private bottoniService: BottoniService) {
    this.compilazioneService.compilazioneEvent.pipe(map(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
      this.compila();
    })).subscribe();
  }

  ngOnInit(): void {
    this.mockAggiornaPrezzoCarrello();
    this.mockCampiForm();
    this.aggiornaCampiForm();
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
    let campo;

    campo = {
      id: 1,
      titolo: 'Importo',
      obbligatorio: true,
      tipoCampo: tipoCampo.INPUT_PREZZO,
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

    campo = {
      id: 2,
      titolo: 'Provincia residenza',
      obbligatorio: true,
      tipoCampo: tipoCampo.SELECT,
      informazioni: 'Seleziona',
      lunghezzaVariabile: true,
      lunghezza: 8,
      campoFisso: true,
      disabilitato: false,
      posizione: 2,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: tipologicaSelect.PROVINCE,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 3,
      titolo: 'Comune residenza',
      obbligatorio: true,
      tipoCampo: tipoCampo.SELECT,
      informazioni: 'Seleziona',
      lunghezzaVariabile: true,
      lunghezza: 8,
      campoFisso: true,
      disabilitato: false,
      posizione: 3,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: tipologicaSelect.COMUNI,
      dipendeDa: 2
      // dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 4,
      titolo: 'Testo',
      obbligatorio: true,
      tipoCampo: tipoCampo.INPUT_TESTUALE,
      informazioni: 'Inserisci un testo',
      lunghezzaVariabile: true,
      lunghezza: 20,
      campoFisso: true,
      disabilitato: false,
      posizione: 4,
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

    if (campo.tipoCampo === tipoCampo.DATEDDMMYY) {
      classe = 'col-md-4';
    } else if (campo.tipoCampo === tipoCampo.DATEMMYY) {
      classe = 'col-md-3';
    } else if (campo.tipoCampo === tipoCampo.DATEYY) {
      classe = 'col-md-1';
    } else if (campo.tipoCampo === tipoCampo.INPUT_PREZZO) {
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

  aggiornaCampiForm(): void {
    this.bottoniService.bottoniEvent.pipe(map(valoriCampi => {
      this.valoriCampi = valoriCampi;
    })).subscribe();
  }

  aggiornaPrezzoCarrello(): void {
    this.datiPagamentoService.prezzoEvent.emit(this.importoTotale);
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
      this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizioSelezionato.id).pipe(map(campiNuovoPagamento => {
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
        case tipoCampo.INPUT_TESTUALE:
          this.valoriCampi[campo['nome']] = null;
          break;
        case tipoCampo.INPUT_NUMERICO:
          this.valoriCampi[campo['nome']] = null;
          break;
        case tipoCampo.DATEDDMMYY:
          this.valoriCampi[campo['nome']] = {
            giorno: null,
            mese: null,
            anno: null
          };
          break;
        case tipoCampo.DATEMMYY:
          this.valoriCampi[campo['nome']] = {
            mese: null,
            anno: null
          };
          break;
        case tipoCampo.DATEYY:
          this.valoriCampi[campo['nome']] = null;
          break;
        case tipoCampo.SELECT:
          campo['opzioni'] = this.getOpzioniSelect(campo);
          this.valoriCampi[campo['nome']] = null;
          break;
      }

      this.listaCampi.push(campo);
    });
  }

  aggiornaSelectDipendenti(campo: CampoForm): void {
    let campiDipendenti = this.getCampiDipendenti(campo);
    if (campiDipendenti) {
      campiDipendenti.forEach(campo => {
        this.valoriCampi[campo['nome']] = null;
        campo['opzioni'] = this.getOpzioniSelect(campo);
      });
    }
  }

  getCampiDipendenti(campo: CampoForm): Array<CampoForm> {
    return this.listaCampi.filter(item => {return item.dipendeDa === campo.id});
  }

  getOpzioniSelect(campo: CampoForm): Array<OpzioneSelect> {
    let opzioniSelect: Array<OpzioneSelect> = [];

    let valoriSelect = JSON.parse(localStorage.getItem(campo.tipologica));

    if (valoriSelect) {

      // Se la select dipende da un'altra select, filtro i valori da inserire nelle opzioni
      if (campo.dipendeDa) {
        let selectPadre = this.listaCampi.find(item => item.id === campo.dipendeDa);
        let valoreSelectPadre = this.valoriCampi[selectPadre?.['nome']];

        // Se la select da cui si dipende è avvalorata, filtro i valori della select dipendente; Altrimenti, la select dipendente resta senza valori
        if (valoreSelectPadre) {
            switch (campo.tipologica) {
              case tipologicaSelect.COMUNI:
                // Filtro i comuni il cui codice istat inizia con le 3 cifre della provincia selezionata
                valoriSelect = valoriSelect.filter(valore => {return valore.codiceIstat?.substring(0,3) === valoreSelectPadre});
                break;

              // Inserire qui logica per altri eventuali futuri casi di select dipendenti da altre select
            }
        } else {
          valoriSelect = [];
        }
      }
    }

    valoriSelect.forEach(valore => {
      switch (campo.tipologica) {
        case tipologicaSelect.PROVINCE:
          opzioniSelect.push({
            value: valore.codice,
            label: valore.nome
          });
          break;
        case tipologicaSelect.COMUNI:
          opzioniSelect.push({
            value: valore.codice,
            label: valore.nome
          });
          break;
      }
    });

    return opzioniSelect;
  }
}
