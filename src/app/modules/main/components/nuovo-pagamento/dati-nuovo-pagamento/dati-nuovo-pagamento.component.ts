import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CampoForm} from '../../../model/CampoForm';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {flatMap, map} from 'rxjs/operators';
import {TipologicaSelectEnum} from '../../../../../enums/tipologicaSelect.enum';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {TipoCampoEnum} from '../../../../../enums/tipoCampo.enum';
import {FiltroServizio} from '../../../model/FiltroServizio';
import {LivelloIntegrazioneEnum} from '../../../../../enums/livelloIntegrazione.enum';
import {EsitoEnum} from '../../../../../enums/esito.enum';
import {Bollettino} from '../../../model/bollettino/Bollettino';
import {ECalendarValue} from 'ng2-date-picker';
import {Router} from '@angular/router';
import {CampoDettaglioTransazione} from '../../../model/bollettino/CampoDettaglioTransazione';
import {observable, Observable, of} from 'rxjs';
import {DettagliTransazione} from '../../../model/bollettino/DettagliTransazione';
import {DettaglioTransazioneEsito} from '../../../model/bollettino/DettaglioTransazioneEsito';
import {Banner} from '../../../model/Banner';
import {getBannerType, LivelloBanner} from '../../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../../services/banner.service';

import {JSONPath} from 'jsonpath-plus';
import {SpinnerService} from '../../../../../services/spinner.service';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit, OnChanges {

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private router: Router,
              private bannerService: BannerService,
              private spinnerService: SpinnerService,
              private cdr: ChangeDetectorRef) {
  }

  readonly TipoCampoEnum = TipoCampoEnum;
  readonly LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;
  livelloIntegrazioneId: number = null;

  isFaseVerificaPagamento = false;

  readonly tipoData = ECalendarValue.String;

  @Input()
  servizio: FiltroServizio = null;

  listaCampiDinamici: Array<CampoForm> = [];
  form: FormGroup = new FormGroup({});
  model = {};

  readonly importoNomeCampo = 'importoTotaleBollettino';
  readonly importoFormControl: FormControl = new FormControl(null, Validators.required);
  mostraCampoImporto = null;

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

  ngOnInit(): void {
    this.checkUtenteLoggato();
    this.inizializzazioneForm(this.servizio);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.servizio) {
      this.inizializzazioneForm(this.servizio).subscribe(() => this.restoreParziale());
    }
  }

  private restoreParziale() {
    this.spinnerService.caricamentoEvent.emit(true);

    this.isUtenteAnonimo = localStorage.getItem('nome') === 'null';
    if (this.isUtenteAnonimo) {
      this.salvaParziale(this.servizio.livelloTerritorialeId, null, 'livelloTerritorialeId');
      this.salvaParziale(this.servizio.enteId, null, 'enteId');
      this.salvaParziale(this.servizio.id, null, 'servizioId');
    } else {
      let item = JSON.parse(localStorage.getItem("parziale"));
      for (var key in this.model) {
        this.model[key] = item[key];
        this.form.controls[key].enable();
      }
      localStorage.removeItem("parziale");
    }

    this.spinnerService.caricamentoEvent.emit(false);
  }

  checkUtenteLoggato(): void {
    this.isUtenteAnonimo = localStorage.getItem('nome') === 'null';
    this.tooltipBottoneSalvaPerDopo = this.isUtenteAnonimo
      ? 'É necessario autenticarsi per poter premere questo bottone e salvare il bollettino appena compilato nella sezione \"I miei pagamenti\"'
      : null;
  }

  clickIndietro(): void {
    this.isFaseVerificaPagamento = false;
    this.rimuoviCampoImporto();
    // TODO logica bottone indietro
  }

  clickProcedi(): void {
    this.spinnerService.caricamentoEvent.emit(true);

    this.isFaseVerificaPagamento = true;
    this.aggiungiCampoImporto();

    // Mapping valori dei campi input da usare per la precompilazione
    const valoriPerPrecompilazione = {};
    this.listaCampiDinamici.forEach(campo => {
      if (campo.campo_input && campo.jsonPath) {
        valoriPerPrecompilazione[campo.jsonPath] = this.model[this.getNomeCampoForm(campo)];
      }
    });

    // Mapping valori dei campi output precompilati
    this.nuovoPagamentoService.recuperaValoriCampiPrecompilati(this.servizio.id, this.servizio.enteId, this.servizio.tipologiaServizioId,
      this.servizio.livelloIntegrazioneId, valoriPerPrecompilazione)
      .subscribe((valoriCampiPrecompilati) => {
        // TODO (attendere implementazione backend) testare mapping campi output per servizio LV2BO
        const campiOutput = this.listaCampiDinamici.filter(campo => !campo.campo_input);
        campiOutput.forEach(campo => {
          this.model[this.getNomeCampoForm(campo)] = JSONPath({
            path: campo.jsonPath,
            json: valoriCampiPrecompilati
          })[0];
        });

        this.model[this.importoNomeCampo] = valoriCampiPrecompilati[this.importoNomeCampo];

        this.spinnerService.caricamentoEvent.emit(false);
      });
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
      classe = 'col-md-2 form-col-2';
    } else if (campo.tipoCampo === TipoCampoEnum.INPUT_PREZZO) {
      classe = 'col-md-2 form-col-2';
    } else {
      if (campo.lunghezza <= this.lunghezzaMaxCol1) {
        classe = 'col-md-1 form-col-1';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol2) {
        classe = 'col-md-2 form-col-2';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol3) {
        classe = 'col-md-3 form-col-3';
      } else {
        classe = 'col-md-4 form-col-4';
      }
    }

    return classe;
  }

  clickPulisci(): void {
    this.form.reset();

    this.listaCampiDinamici.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);

      this.model[nomeCampo] = null;

      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        this.form.controls[nomeCampo].disable();
        campo.opzioni = [];
      }
    });

    this.nuovoPagamentoService.pulisciEvent.emit(true);
  }

  getNumDocumento(): string {
    let chiave: string = null;

    const campiChiave = [];

    this.listaCampiDinamici.forEach(campo => {
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

  aggiornaPrezzoCarrello(): void {
    this.nuovoPagamentoService.prezzoEvent.emit(this.model[this.importoNomeCampo]);
  }

  creaForm(): void {
    this.listaCampiDinamici = [];
    this.form = new FormGroup({});
    this.model = {};
    this.importoFormControl.reset();
    this.mostraCampoImporto = null;
    this.isFaseVerificaPagamento = false;

    if (this.servizio.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV2) {
      this.aggiungiCampoImporto();
    }
  }

  aggiungiCampoImporto(): void {
    this.mostraCampoImporto = true;
    this.form.addControl(this.importoNomeCampo, this.importoFormControl);
    this.model[this.importoNomeCampo] = null;
  }

  rimuoviCampoImporto(): void {
    this.mostraCampoImporto = false;
    this.form.removeControl(this.importoNomeCampo);
    delete this.model[this.importoNomeCampo];
  }

  inizializzazioneForm(servizio: FiltroServizio): Observable<any> {
    this.servizio = servizio;
    const isCompilato = this.servizio != null;

    if (isCompilato) {
      this.livelloIntegrazioneId = this.servizio.livelloIntegrazioneId;

      return this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizio.id).pipe(map(campiNuovoPagamento => {
        this.creaForm();
        this.impostaCampi(campiNuovoPagamento.campiTipologiaServizio);
        this.impostaCampi(campiNuovoPagamento.campiServizio);

        this.spinnerService.caricamentoEvent.emit(false);
      }));
    } else {
      return of(null);
    }
  }

  formattaInput(event: any, campo: CampoForm): void {
    const nomeCampo = this.getNomeCampoForm(campo);
    const valoreCampo = this.model[nomeCampo];

    switch (campo.tipoCampo) {
      case TipoCampoEnum.INPUT_TESTUALE:
        if (valoreCampo === '') {
          this.model[nomeCampo] = null;
        }
        break;
    }
    this.salvaParziale(this.model[nomeCampo], campo);
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
      if (campo.disabilitato || !campo.campo_input) {
        campoForm.disable();
      }

      const validatori = [];
      if (campo.obbligatorio) {
        validatori.push(Validators.required);
      }

      if (campo.controllo_logico?.regex) {
        validatori.push(Validators.pattern(campo.controllo_logico.regex));
      }

      if (!campo.lunghezzaVariabile) {
        validatori.push(Validators.minLength(campo.lunghezza));
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
      this.listaCampiDinamici.push(campo);
    });
  }

  getCampoDettaglioTransazione(nomeCampo: string) {
    const campoForms: CampoForm[] = this.listaCampiDinamici.filter((value: CampoForm) => value.campoDettaglioTransazione && value.campoDettaglioTransazione.toLowerCase() == nomeCampo.toLocaleLowerCase());
    if (campoForms.length > 0) {
      return this.getNomeCampoForm(campoForms[0]);
    } else {
      return null;
    }
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
      } else if (formControl.errors?.minlength) {
        descrizione = 'Il campo deve essere lungo ' + campo.lunghezza + ' caratteri';
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

  aggiornaSelectDipendenti(event: Event, campo: CampoForm): void {

    this.salvaParziale(event, campo);

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
    return this.listaCampiDinamici.filter(item => {
      return item.dipendeDa === campo.id;
    });
  }

  impostaOpzioniSelect(campo: CampoForm): void {
    const opzioniSelect: Array<OpzioneSelect> = [];

    let valoriSelect = JSON.parse(localStorage.getItem(campo.tipologica));

    if (valoriSelect) {

      // Se la select dipende da un'altra select, filtro i valori da inserire nelle opzioni
      if (campo.dipendeDa) {
        const selectPadre = this.listaCampiDinamici.find(item => item.id === campo.dipendeDa);
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

  creaListaBollettini(): Bollettino[] {
    const bollettini: Bollettino[] = [];
    const bollettino = this.creaBollettino();
    bollettini.push(bollettino);
    return bollettini;
  }

  private creaBollettino() {
    const bollettino: Bollettino = new Bollettino();
    bollettino.servizioId = this.servizio.id;
    bollettino.enteId = this.servizio.enteId;
    bollettino.numero = this.getNumDocumento();
    bollettino.anno = this.model[this.getCampoDettaglioTransazione('anno_documento')];
    bollettino.causale = this.model[this.getCampoDettaglioTransazione('causale')];
    bollettino.iuv = this.model[this.getCampoDettaglioTransazione('iuv')];
    bollettino.cfpiva = this.model[this.getCampoDettaglioTransazione('codice_fiscale_pagatore')];
    bollettino.importo = this.model[this.importoNomeCampo];

    bollettino.listaCampoDettaglioTransazione = [];
    this.listaCampiDinamici.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);
      const field: CampoDettaglioTransazione = new CampoDettaglioTransazione();
      field.titolo = nomeCampo;
      field.valore = this.model[nomeCampo];
      bollettino.listaCampoDettaglioTransazione.push(field);
    });
    return bollettino;
  }

  aggiungiAlCarrello() {
    this.spinnerService.caricamentoEvent.emit(true);

    const anonimo = localStorage.getItem('nome') === 'null' && localStorage.getItem('cognome') === 'null';
    let observable: Observable<any>;
    if (anonimo) {
      const numeroDoc = this.getNumDocumento();
      observable = this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .pipe(map((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem('boll-' + numeroDoc, JSON.stringify(this.creaBollettino()));
            // cancellaBollettinoParziale()
            return null;
          } else {
            // show err
            this.showMessage();
            return of('error');
          }

          this.spinnerService.caricamentoEvent.emit(false);
        }));
    } else {
      observable = this.nuovoPagamentoService.inserimentoBollettino(this.creaListaBollettini())
        .pipe(flatMap((result) => {
          if (result.length > 0) {
            const value: DettaglioTransazioneEsito = result[0];
            if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {
              const dettaglio: DettagliTransazione = new DettagliTransazione();
              dettaglio.listaDettaglioTransazioneId.push(value.dettaglioTransazioneId);
              return this.nuovoPagamentoService.inserimentoCarrello(dettaglio);
            } else {
              // show err
              this.showMessage();
              return of('error');
            }
          }
        }));
    }
    observable.subscribe((result) => {
      if (result != 'error') {
        this.aggiornaPrezzoCarrello();
        this.clickPulisci();
        this.spinnerService.caricamentoEvent.emit(false);
      }
    });
  }

  pagaOra() {
    this.spinnerService.caricamentoEvent.emit(true);

    const anonimo = localStorage.getItem('nome') === 'null' && localStorage.getItem('cognome') === 'null';
    if (anonimo) {
      const numeroDoc = this.getNumDocumento();
      this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .subscribe((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem('boll-' + numeroDoc, JSON.stringify(this.creaBollettino()));
            this.aggiornaPrezzoCarrello();
            this.router.navigateByUrl('/carrello');
          } else {
            // show err
            this.showMessage();
            return of('error');
          }

          this.spinnerService.caricamentoEvent.emit(false);
        });
    } else {
      const observable: Observable<any> = this.nuovoPagamentoService.inserimentoBollettino(this.creaListaBollettini())
        .pipe(flatMap((result) => {
          if (result.length > 0) {
            const value: DettaglioTransazioneEsito = result[0];
            if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {
              const dettaglio: DettagliTransazione = new DettagliTransazione();
              dettaglio.listaDettaglioTransazioneId.push(value.dettaglioTransazioneId);
              return this.nuovoPagamentoService.inserimentoCarrello(dettaglio);
            } else {
              // show err
              this.showMessage();
              return of('error');
            }
          }
        }));
      observable.subscribe((result) => {
        if (result !== 'error') {
          this.aggiornaPrezzoCarrello();
          this.spinnerService.caricamentoEvent.emit(false);
          this.router.navigateByUrl('/carrello');
        }
      });
    }
  }

  salvaPerDopo() {
    this.spinnerService.caricamentoEvent.emit(true);

    const observable = this.nuovoPagamentoService.inserimentoBollettino(this.creaListaBollettini())
      .pipe(flatMap((result) => {
        if (result.length > 0) {
          const value: DettaglioTransazioneEsito = result[0];
          if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {
            const dettaglio: DettagliTransazione = new DettagliTransazione();
            dettaglio.listaDettaglioTransazioneId.push(value.dettaglioTransazioneId);
            return this.nuovoPagamentoService.salvaPerDopo(dettaglio);
          } else {
            // show err
            this.showMessage();
            return of('error');
          }
        }

        this.spinnerService.caricamentoEvent.emit(false);
      }));
    observable.subscribe((result) => {
      if (result !== 'error') {
        this.router.navigateByUrl('/iMieiPagamenti');
      }
    });
  }

  private showMessage() {
    const banner: Banner = {
      titolo: 'Operazione non consentita!',
      testo: 'Il bollettino è già stato pagato o in corso di pagamento. Per maggiori informazioni consultare la sezione i miei pagamenti o contattare l’help desk',
      tipo: getBannerType(LivelloBanner.ERROR)
    };
    this.bannerService.bannerEvent.emit([banner]);
  }

  salvaParziale(event: any, campo: CampoForm, nomeCampo: string = null) {
    if (this.isUtenteAnonimo) {
      let item;
      if (localStorage.getItem('parziale') != null) {
        item = JSON.parse(localStorage.getItem('parziale'));
      } else {
        item = {};
      }
      item[campo == null ? nomeCampo : this.getNomeCampoForm(campo)] = event;
      localStorage.setItem('parziale', JSON.stringify(item));
    }
  }
}
