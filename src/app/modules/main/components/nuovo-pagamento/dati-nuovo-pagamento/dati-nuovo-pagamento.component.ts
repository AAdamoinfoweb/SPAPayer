import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CampoForm} from '../../../model/CampoForm';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {TipologicaSelectEnum} from '../../../../../enums/tipologicaSelect.enum';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {TipoCampoEnum} from '../../../../../enums/tipoCampo.enum';
import {Servizio} from '../../../model/Servizio';
import {LivelloIntegrazioneEnum} from '../../../../../enums/livelloIntegrazione.enum';
import {EsitoEnum} from '../../../../../enums/esito.enum';
import {Bollettino} from '../../../model/bollettino/Bollettino';
import {ECalendarValue} from 'ng2-date-picker';
import {Router} from "@angular/router";
import {DettaglioTransazioneEsito} from "../../../model/bollettino/DettaglioTransazioneEsito";
import {of} from "rxjs";
import {CampoDettaglioTransazione} from "../../../model/bollettino/CampoDettaglioTransazione";
import {RichiestaCampiPrecompilati} from '../../../model/RichiestaCampiPrecompilati';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit {
  readonly TipoCampoEnum = TipoCampoEnum;
  readonly LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;
  livelloIntegrazioneId: number = null;

  isFaseVerificaPagamento = false;

  readonly tipoData = ECalendarValue.String;

  @Input()
  servizio: Servizio = null;

  listaCampi: Array<CampoForm> = [];

  importoFormControl: FormControl = new FormControl();
  form: FormGroup = new FormGroup({importo: this.importoFormControl});
  model = {importo: null};

  readonly minDataDDMMYY = '01/01/1900';
  readonly minDataMMYY = '01/1900';
  readonly minDataYY = 1900;

  readonly minInputNumerico = 0;

  readonly lunghezzaMaxCol1: number = 5;
  readonly lunghezzaMaxCol2: number = 10;
  readonly lunghezzaMaxCol3: number = 15;

  isVisibile = true;

  isUtenteAnonimo: boolean = null;
  tooltipBottoneSalvaPerDopo: string = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.checkUtenteLoggato();
    this.inizializzazioneForm(this.servizio);
  }

  checkUtenteLoggato(): void {
    this.isUtenteAnonimo = localStorage.getItem('nome') === 'null';
    this.tooltipBottoneSalvaPerDopo = this.isUtenteAnonimo
      ? 'É necessario autenticarsi per poter premere questo bottone e salvare il bollettino appena compilato nella sezione \"I miei pagamenti\"'
      : null;
  }

  tornaAdInserimentoDati(): void {
    this.isFaseVerificaPagamento = false;
    // TODO logica bottone indietro
  }

  clickProcedi(): void {
    this.isFaseVerificaPagamento = true;
    const richiestaCampiPrecompilati = new RichiestaCampiPrecompilati();
    richiestaCampiPrecompilati.servizioId = this.servizio.id;
    richiestaCampiPrecompilati.tipologiaServizioId = this.servizio.tipologiaServizioId;
    richiestaCampiPrecompilati.livelloIntegrazioneId = this.servizio.livelloIntegrazioneId;

    if (richiestaCampiPrecompilati.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV2_BACK_OFFICE) {
      // TODO logica LV2BO
    } else if (richiestaCampiPrecompilati.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV3) {
      // TODO logica LV3
    }
  }

  aggiornaVisibilita(): void {
    this.isVisibile = !this.isVisibile;
  }

  calcolaDimensioneCampo(campo: CampoForm): string {
    let classe;

    if (this.servizio?.livelloIntegrazioneId !== LivelloIntegrazioneEnum.LV2
      && !campo.campo_input
      && !this.isFaseVerificaPagamento) {
      classe = 'hide';
    } else if (campo.tipoCampo === TipoCampoEnum.DATEDDMMYY || campo.tipoCampo === TipoCampoEnum.DATEMMYY || campo.tipoCampo === TipoCampoEnum.DATEYY) {
      classe = 'col-md-2';
    } else if (campo.tipoCampo === TipoCampoEnum.INPUT_PREZZO) {
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

  clickPulisci(): void {
    this.form.reset();

    this.listaCampi.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);

      this.model[nomeCampo] = null;

      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        this.form.controls[nomeCampo].disable();
        campo.opzioni = [];
      }
    });

    this.nuovoPagamentoService.pulisciEvent.emit(true);
  }

  salvaPerDopo(): void {
    // TODO logica salva per dopo
  }

  getNumDocumento(): string {
    let chiave: string = null;

    const campiChiave = [];

    this.listaCampi.forEach(campo => {
      if (campo.chiave) {
        campiChiave.push(campo);
      }
    });

    if (campiChiave.length > 0) {
      chiave = '';
      campiChiave.forEach(campo => {
        chiave += this.model[this.getNomeCampoForm(campo)];
      });
    }

    chiave = chiave.replace('/', '');

    return chiave;
  }

  precompilaCampiForm(): void {
    // TODO logica precompila campi form, in caso di LV2BO o LV3
  }

  aggiornaPrezzoCarrello(): void {
    this.nuovoPagamentoService.prezzoEvent.emit(this.model.importo);
  }

  inizializzazioneForm(servizio: Servizio): void {
    this.servizio = servizio;
    const isCompilato = this.servizio != null;

    if (isCompilato) {
      this.livelloIntegrazioneId = this.servizio.livelloIntegrazioneId;

      this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizio.id).pipe(map(campiNuovoPagamento => {
        this.listaCampi = [];
        this.form = new FormGroup({importo: this.importoFormControl});
        this.model = {
          importo: null
        };
        this.impostaCampi(campiNuovoPagamento.campiTipologiaServizio);
        this.impostaCampi(campiNuovoPagamento.campiServizio);
      })).subscribe();
    }
  }

  formattaInput(campo: CampoForm): void {
    const nomeCampo = this.getNomeCampoForm(campo);
    const valoreCampo = this.model[nomeCampo];

    switch (campo.tipoCampo) {
      case TipoCampoEnum.INPUT_TESTUALE:
        if (valoreCampo === '') {
          this.model[nomeCampo] = null;
        }
        break;
    }
  }

  ordinaPerPosizione(campi: Array<CampoForm>): void {
    campi.sort((campo1: CampoForm, campo2: CampoForm) => {
      return campo1.posizione > campo2.posizione ? 1 : (campo1.posizione < campo2.posizione ? -1 : 0);
    });
  }

  impostaCampi(campi: Array<CampoForm>): void {
    this.ordinaPerPosizione(campi);

    campi.forEach(campo => {
      const campoForm = new FormControl();
      if (campo.disabilitato) {
        campoForm.disable();
      }

      const validatori = [];
      if (campo.obbligatorio) {
        validatori.push(Validators.required);
      }

      // TODO testare validazione regex quando è fixato l'invio delle regex dal backend
      if (campo.controllo_logico?.regex) {
        validatori.push(Validators.pattern(campo.controllo_logico.regex));
      }

      switch (campo.tipoCampo) {
        case TipoCampoEnum.INPUT_NUMERICO:
          validatori.push(Validators.min(0));
          break;
        case TipoCampoEnum.INPUT_PREZZO:
          validatori.push(Validators.min(0));
          break;
        case TipoCampoEnum.DATEYY:
          validatori.push(Validators.min(this.minDataYY));
          break;
        case TipoCampoEnum.SELECT:
          this.impostaOpzioniSelect(campo);
          if (!campo.opzioni?.length) {
            campoForm.disable();
          }
          break;
      }

      campoForm.setValidators(validatori);

      this.model[this.getNomeCampoForm(campo)] = null;
      this.form.addControl(this.getNomeCampoForm(campo), campoForm);
      this.listaCampi.push(campo);
    });
  }

  getCampoDettaglioTransazione(nomeCampo: string) {
    let campoForms: CampoForm[] = this.listaCampi.filter((value: CampoForm) => value.campoDettaglioTransazione && value.campoDettaglioTransazione.toLowerCase() == nomeCampo.toLocaleLowerCase());
    if (campoForms.length > 0)
      return this.getNomeCampoForm(campoForms[0]);
    else
      return null;
  }

  getNomeCampoForm(campo: CampoForm): string {
    return campo.titolo;
  }

  getTitoloCampo(campo: CampoForm): string {
    return campo.titolo;
  }

  isCampoDisabilitato(campo: CampoForm): boolean {
    if (this.isFaseVerificaPagamento) {
      return true;
    } else {
      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        return (campo.disabilitato || !campo.opzioni || campo.opzioni.length === 0) ? true : null;
      } else {
        return campo.disabilitato ? true : null;
      }
    }
  }

  isCampoObbligatorio(campo: CampoForm): boolean {
    return campo.obbligatorio;
  }

  getDescrizioneCampo(campo: CampoForm): string {
    let descrizione: string;

    const formControl = this.form.controls[this.getNomeCampoForm(campo)];

    if (this.isCampoInvalido(campo)) {
      if (formControl.errors?.required) {
        descrizione = 'Il campo è obbligatorio';
      } else if (formControl.errors?.pattern) {
        descrizione = 'Formato non valido';
      } else if (formControl.errors?.min) {
        switch (campo.tipoCampo) {
          case TipoCampoEnum.INPUT_NUMERICO:
            descrizione = 'Valore inferiore a ' + this.minInputNumerico;
            break;
          case TipoCampoEnum.DATEYY:
            descrizione = 'Valore inferiore a ' + this.minDataYY;
            break;
        }
      } else {
        descrizione = 'Errore';
      }
    } else {
      descrizione = campo.informazioni;
    }

    return descrizione;
  }

  isCampoInvalido(campo: CampoForm): boolean {
    const formControl = this.form.controls[this.getNomeCampoForm(campo)];
    return formControl.errors !== null;
  }

  getLunghezzaCampo(campo: CampoForm): number {
    return campo.lunghezza;
  }

  getIdCampo(campo: CampoForm): string {
    return campo.id.toString();
  }

  aggiornaSelectDipendenti(campo: CampoForm): void {
    const campiDipendenti = this.getCampiDipendenti(campo);
    if (campiDipendenti) {
      campiDipendenti.forEach(campo => {
        const campoForm = this.form.controls[this.getNomeCampoForm(campo)];
        campoForm.setValue(null);
        this.impostaOpzioniSelect(campo);
      });
    }
  }

  getCampiDipendenti(campo: CampoForm): Array<CampoForm> {
    return this.listaCampi.filter(item => {
      return item.dipendeDa === campo.id;
    });
  }

  impostaOpzioniSelect(campo: CampoForm): void {
    const opzioniSelect: Array<OpzioneSelect> = [];

    let valoriSelect = JSON.parse(localStorage.getItem(campo.tipologica));

    if (valoriSelect) {

      // Se la select dipende da un'altra select, filtro i valori da inserire nelle opzioni
      if (campo.dipendeDa) {
        const selectPadre = this.listaCampi.find(item => item.id === campo.dipendeDa);
        const valoreSelectPadre = this.form.controls[this.getNomeCampoForm(selectPadre)].value;

        // Se la select da cui si dipende è avvalorata, filtro i valori della select dipendente; Altrimenti, la select dipendente resta senza valori
        if (valoreSelectPadre) {
          switch (campo.tipologica) {
            // Inserire qui logica per i vari campi select dipendenti da altre select

            case TipologicaSelectEnum.COMUNI:
              // Filtro i comuni il cui codice istat inizia con le 3 cifre della provincia selezionata
              valoriSelect = valoriSelect.filter(valore => {
                return valore.codiceIstat?.substring(0, 3) === valoreSelectPadre;
              });
              break;
          }
        } else {
          valoriSelect = [];
        }
      }
    } else {
      valoriSelect = [];
    }

    valoriSelect.forEach(valore => {
      switch (campo.tipologica) {
        // Inserire qui logica per l'impostazione delle opzioni dei vari tipi di select

        case TipologicaSelectEnum.PROVINCE:
          opzioniSelect.push({
            value: valore.codice,
            label: valore.nome
          });
          break;
        case TipologicaSelectEnum.COMUNI:
          opzioniSelect.push({
            value: valore.codiceIstat,
            label: valore.nome
          });
          break;
      }
    });

    campo.opzioni = opzioniSelect;
  }

  creaBollettino(): Bollettino[] {
    const bollettini: Bollettino[] = [];
    let bollettino: Bollettino = new Bollettino();
    bollettino.servizioId = this.servizio.id;
    bollettino.enteId = this.servizio.enteId;
    bollettino.numero = this.getNumDocumento();
    bollettino.anno = this.model[this.getCampoDettaglioTransazione('anno_documento')];
    bollettino.causale = this.model[this.getCampoDettaglioTransazione('causale')];
    bollettino.iuv = this.model[this.getCampoDettaglioTransazione('iuv')];
    bollettino.cfpiva = this.model[this.getCampoDettaglioTransazione('codice_fiscale_pagatore')];
    bollettino.importo = this.model.importo;

    bollettino.listaCampoDettaglioTransazione = [];
    this.listaCampi.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);
      let field: CampoDettaglioTransazione = new CampoDettaglioTransazione();
      field.titolo = nomeCampo;
      field.valore = this.model[nomeCampo];
      bollettino.listaCampoDettaglioTransazione.push(field);
    });
    bollettini.push(bollettino);
    return bollettini;
  }

  aggiungiAlCarrello() {
    const anonimo = localStorage.getItem('nome') === 'null' && localStorage.getItem('cognome') === 'null';
    if (anonimo) {
      const numeroDoc = this.getNumDocumento();
      this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .subscribe((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem(numeroDoc, JSON.stringify(this.model));
            this.aggiornaPrezzoCarrello();
            this.clickPulisci();
          } else {
            // show err

          }
        });
    } else {
      this.nuovoPagamentoService.inserimentoBollettino(this.creaBollettino())
        .pipe(map(() => {
          return null;
        })).subscribe();
    }
  }

  pagaOra() {
    const anonimo = localStorage.getItem('nome') === 'null' && localStorage.getItem('cognome') === 'null';
    if (anonimo) {
      const numeroDoc = this.getNumDocumento();
      this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .subscribe((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem(numeroDoc, JSON.stringify(this.model));
            this.aggiornaPrezzoCarrello();
            this.router.navigateByUrl("/carrello");
          } else {
            // show err

          }
        });
    } else {
      this.nuovoPagamentoService.inserimentoBollettino(this.creaBollettino())
        .pipe(map((result) => {
          if (result.length > 0) {
            let value: DettaglioTransazioneEsito = result[0];
            if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {
              return this.nuovoPagamentoService.inserimentoCarrello(value)
                .pipe(map(() => this.clickPulisci()));
            } else {
              // show err

              return of(null);
            }
          }

          /*
          result.forEach((value: DettaglioTransazioneEsito) => {
            if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {

            } else {
              // show err
              return of(null);
            }
          });*/

          return null;
        })).subscribe();
    }
  }
}
