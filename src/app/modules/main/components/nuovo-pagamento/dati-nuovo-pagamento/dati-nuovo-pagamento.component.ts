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
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {Router} from '@angular/router';
import {CampoDettaglioTransazione} from '../../../model/bollettino/CampoDettaglioTransazione';
import {Observable, of} from 'rxjs';
import {DettagliTransazione} from '../../../model/bollettino/DettagliTransazione';
import {DettaglioTransazioneEsito} from '../../../model/bollettino/DettaglioTransazioneEsito';
import {Banner} from '../../../model/Banner';
import {getBannerType, LivelloBanner} from '../../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../../services/banner.service';

import {JSONPath} from 'jsonpath-plus';
import {OverlayService} from '../../../../../services/overlay.service';
import {MenuService} from '../../../../../services/menu.service';
import {DatiPagamento} from '../../../model/bollettino/DatiPagamento';
import {MappingCampoInputPrecompilazioneEnum} from '../../../../../enums/mappingCampoInputPrecompilazione.enum';
import {MappingCampoOutputPrecompilazioneEnum} from '../../../../../enums/mappingCampoOutputPrecompilazione.enum';

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit, OnChanges {

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private router: Router,
              private bannerService: BannerService,
              private overlayService: OverlayService,
              public menuService: MenuService,
              private cdr: ChangeDetectorRef) {
  }

  readonly TipoCampoEnum = TipoCampoEnum;
  readonly LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;
  livelloIntegrazioneId: number = null;

  isFaseVerificaPagamento = false;

  readonly tipoData = ECalendarValue.String;

  @Input()
  servizio: FiltroServizio = null;

  @Input()
  datiPagamento: DatiPagamento;
  isBollettinoPagato: boolean;

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
  readonly minInputPrezzo = 0;
  readonly cifreDecimaliPrezzo = 2;

  readonly lunghezzaMaxCol1: number = 5;
  readonly lunghezzaMaxCol2: number = 10;
  readonly lunghezzaMaxCol3: number = 15;

  isVisibile = true;
  tooltipBottoneSalvaPerDopo: string = null;

  ngOnInit(): void {
    this.checkUtenteLoggato();
    this.inizializzazioneForm(this.servizio).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.servizio) {
      this.inizializzazioneForm(this.servizio).subscribe();
    }
  }

  impostaDettaglioPagamento(): void {
    this.isFaseVerificaPagamento = true;
    this.isBollettinoPagato = this.datiPagamento.esitoPagamento === EsitoEnum.OK || this.datiPagamento.esitoPagamento === EsitoEnum.PENDING;

    if (this.datiPagamento.importo) {
      this.model[this.importoNomeCampo] = this.datiPagamento.importo;
    } else {
      console.log('Importo mancante');
      this.overlayService.gestisciErrore();
    }

    if (this.datiPagamento.numeroDocumento) {
      const campoNumeroDocumento = this.listaCampiDinamici.find(campo => campo.jsonPath && campo.jsonPath.endsWith(MappingCampoOutputPrecompilazioneEnum.numeroDocumento));
      if (campoNumeroDocumento) {
        this.model[this.getNomeCampoForm(campoNumeroDocumento)] = this.datiPagamento.numeroDocumento;
      } else {
        console.log('Campo numero documento mancante');
        this.overlayService.gestisciErrore();
      }
    }

    if (this.datiPagamento.codiceAvviso) {
      const campoCodiceAvviso = this.listaCampiDinamici.find(campo => campo.jsonPath === MappingCampoInputPrecompilazioneEnum.codiceAvviso);
      if (campoCodiceAvviso) {
        this.model[this.getNomeCampoForm(campoCodiceAvviso)] = this.datiPagamento.codiceAvviso;
      } else {
        console.log('Campo codice avviso mancante');
        this.overlayService.gestisciErrore();
      }
    }

    if (this.datiPagamento.dettaglioTransazioneId) {
      this.nuovoPagamentoService.letturaBollettino(this.datiPagamento.dettaglioTransazioneId).subscribe((bollettino) => {
        if (bollettino.cfpiva) {
          const campoCfpiva = this.listaCampiDinamici.find(campo => campo.jsonPath === MappingCampoInputPrecompilazioneEnum.cfpiva);
          if (campoCfpiva) {
            this.model[this.getNomeCampoForm(campoCfpiva)] = bollettino.cfpiva;
          } else {
            console.log('Campo cfpiva mancante');
            this.overlayService.gestisciErrore();
          }
        }
        if (bollettino.iuv) {
          const campoIuv = this.listaCampiDinamici.find(campo => campo.jsonPath && campo.jsonPath.endsWith(MappingCampoOutputPrecompilazioneEnum.iuv));
          if (campoIuv) {
            this.model[this.getNomeCampoForm(campoIuv)] = bollettino.iuv;
          } else {
            console.log('Campo iuv mancante');
            this.overlayService.gestisciErrore();
          }
        }
        if (bollettino.listaCampoDettaglioTransazione) {
          bollettino.listaCampoDettaglioTransazione.forEach(dettaglio => {
            const campo = this.listaCampiDinamici.find(campo => this.getTitoloCampo(campo) === dettaglio.titolo);
            if (campo) {
              this.model[this.getNomeCampoForm(campo)] = dettaglio.valore;
            } else {
              console.log('Campo dettaglio transazione mancante');
              this.overlayService.gestisciErrore();
            }
          });
        }
        this.overlayService.caricamentoEvent.emit(false);
      });
    } else {
      // Un pagamento può non avere il dettaglioTransazioneId (quindi non essere sul db) solo se è di un servizio LV3 esterno
      if (this.servizio.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV3) {
        const valoriPerPrecompilazione = {};
        valoriPerPrecompilazione[MappingCampoInputPrecompilazioneEnum.codiceAvviso] = this.datiPagamento.codiceAvviso;

        this.nuovoPagamentoService.recuperaValoriCampiPrecompilati(this.servizio.id, this.servizio.enteId, this.servizio.tipologiaServizioId,
          this.servizio.livelloIntegrazioneId, valoriPerPrecompilazione)
          .subscribe((valoriCampiPrecompilati) => {
            this.impostaValoriCampiOutput(valoriCampiPrecompilati);

            // Per i pagamenti lv3 da servizio esterno, non abbiamo il cfpiva, dobbiamo recuperarlo dalla response
            const cfpiva = this.recuperaCodicePagatoreDaPagamentoLv3Esterno(valoriCampiPrecompilati);
            if (cfpiva) {
              const campoCodicePagatore = this.listaCampiDinamici.find(campo => campo.jsonPath === MappingCampoInputPrecompilazioneEnum.cfpiva);
              this.model[this.getNomeCampoForm(campoCodicePagatore)] = cfpiva;
            }

            this.overlayService.caricamentoEvent.emit(false);
          });
      } else {
        console.log('Dettaglio transazione id mancante su servizio diverso da LV3');
        this.overlayService.gestisciErrore();
      }
    }
  }

  private recuperaCodicePagatoreDaPagamentoLv3Esterno(valoriPrecompilati): string {
    return valoriPrecompilati?.pagamento[0]?.anagrafica_pagatore?.codice_pagatore;
  }

  private restoreParziale() {
    if (this.menuService.isUtenteAnonimo) {
      this.salvaParziale(this.servizio.livelloTerritorialeId, null, 'livelloTerritorialeId');
      this.salvaParziale(this.servizio.enteId, null, 'enteId');
      this.salvaParziale(this.servizio.id, null, 'servizioId');
    } else {
      let item = JSON.parse(localStorage.getItem("parziale"));
      if (item != null) {
        for (var key in this.model) {
          this.model[key] = item[key];
          this.form.controls[key].enable();
        }
      }
      localStorage.removeItem("parziale");
    }
  }

  checkUtenteLoggato(): void {
    this.tooltipBottoneSalvaPerDopo = this.menuService.isUtenteAnonimo
      ? 'É necessario autenticarsi per poter premere questo bottone e salvare il bollettino appena compilato nella sezione \"I miei pagamenti\"'
      : null;
  }

  clickIndietro(): void {
    if (this.datiPagamento) {
      this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(null);
    }

    this.isFaseVerificaPagamento = false;
    this.rimuoviCampoImporto();

    const campiOutput = this.listaCampiDinamici.filter(campo => !campo.campo_input);
    campiOutput.forEach(campo => {
      delete this.model[this.getNomeCampoForm(campo)];
    });
  }

  clickProcedi(): void {
    this.overlayService.caricamentoEvent.emit(true);

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
        // TODO (attendere implementazione backend) testare mapping campi output per servizio LV2BO (NB: al momento la chiamata crasha lato backend per servizio LV2BO)
        this.impostaValoriCampiOutput(valoriCampiPrecompilati);
        this.overlayService.caricamentoEvent.emit(false);
      });
  }

  impostaValoriCampiOutput(valoriCampiPrecompilati): void {
    const campiOutput = this.listaCampiDinamici.filter(campo => !campo.campo_input);
    campiOutput.forEach(campo => {
      this.model[this.getNomeCampoForm(campo)] = JSONPath({
        path: campo.jsonPath,
        json: valoriCampiPrecompilati
      })[0];
    });

    this.model[this.importoNomeCampo] = valoriCampiPrecompilati[this.importoNomeCampo];
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

    if (this.servizio.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV2 || this.datiPagamento) {
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

        this.restoreParziale();

        if (this.datiPagamento) {
          this.impostaDettaglioPagamento();
        } else {
          this.overlayService.caricamentoEvent.emit(false);
        }
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
      if (campo.disabilitato || !campo.campo_input || this.datiPagamento) {
        campoForm.disable();
      }

      const validatori = [];
      if (campo.obbligatorio) {
        validatori.push(Validators.required);
      }

      if (campo.controllo_logico?.regex) {
        validatori.push(Validators.pattern(campo.controllo_logico.regex));
      }

      switch (campo.tipoCampo) {
        case TipoCampoEnum.INPUT_TESTUALE:
          if (!campo.lunghezzaVariabile) {
            validatori.push(Validators.minLength(campo.lunghezza));
          }
          break;
        case TipoCampoEnum.INPUT_NUMERICO:
          // Con i numeri non è possibile usare minLength e maxLength
          validatori.push(Validators.max(this.calcolaMaxInputNumerico(campo)));
          validatori.push(Validators.min(this.calcolaMinInputNumerico(campo)));
          break;
        case TipoCampoEnum.INPUT_PREZZO:
          // Con i numeri non è possibile usare minLength
          validatori.push(Validators.min(this.calcolaMinInputPrezzo(campo)));
          validatori.push(Validators.max(this.calcolaMaxInputNumerico(campo)));
          break;
        case TipoCampoEnum.DATEYY:
          validatori.push(Validators.min(this.minDataYY));
          validatori.push(Validators.max(this.calcolaMaxInputAnno(campo)));
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
    if (this.isFaseVerificaPagamento || this.datiPagamento) {
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

    if (this.isFaseVerificaPagamento) {
      descrizione = '';
    } else {
      if (this.isCampoInvalido(campo)) {
        if (formControl.errors?.required) {
          descrizione = 'Il campo è obbligatorio';
        } else if (formControl.errors?.pattern) {
          descrizione = 'Formato non valido';
        } else if (formControl.errors?.minlength
          || (!campo.lunghezzaVariabile && (formControl.errors?.min || formControl.errors?.max))) {
          descrizione = 'Il campo deve essere lungo ' + campo.lunghezza + ' caratteri';
        } else if (formControl.errors?.min) {
          descrizione = 'Valore inferiore a ' + formControl.errors?.min?.value;
        } else if (formControl.errors?.max) {
          descrizione = 'Valore superiore a ' + formControl.errors?.max?.max;
        } else if (formControl.errors?.format) {
          descrizione = 'Data non valida';
        } else {
          descrizione = 'Campo non valido';
        }
      } else {
        descrizione = campo.informazioni;
      }
    }

    return descrizione;
  }

  apriDatePicker(dp: DatePickerComponent, campo: CampoForm) {
    if (!this.isCampoDisabilitato(campo)) {
      dp.api.open();
    }
  }

  calcolaMinInputNumerico(campo): number {
    // Un numero intero lungo X cifre deve essere grande almeno 10^(X-1)
    return campo.lunghezzaVariabile ? this.minInputNumerico : Math.pow(10, campo.lunghezza - 1);
  }

  calcolaMaxInputNumerico(campo): number {
    // Un numero intero lungo X cifre deve essere grande massimo 10^(X) - 1
    return Math.pow(10, campo.lunghezza) - 1;
  }

  calcolaMinInputPrezzo(campo): number {
    // Un numero decimale lungo X cifre con Y dopo la virgola deve essere grande almeno 10^(X-Y-1)
    return campo.lunghezzaVariabile ? this.minInputPrezzo : Math.pow(10, campo.lunghezza - this.cifreDecimaliPrezzo - 1);
  }

  calcolaMaxInputAnno(campo): number {
    // Data la mancanza di requisiti sulla massima data inseribile, si inserisce come massimo il numero massimo di cifre consentite dal campo
    return this.calcolaMaxInputNumerico(campo);
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
    bollettino.servizio = this.servizio.nome;
    bollettino.enteId = this.servizio.enteId;
    bollettino.ente = this.servizio.enteNome;
    bollettino.numero = this.getNumDocumento();
    bollettino.anno = this.model[this.getCampoDettaglioTransazione('anno_documento')];
    bollettino.causale = this.model[this.getCampoDettaglioTransazione('causale')];
    // rimuovere primi 3 caratteri
    bollettino.iuv = this.model[this.getCampoDettaglioTransazione('iuv')] != null ?
      this.model[this.getCampoDettaglioTransazione('iuv')].toString().substring(3) : null;
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
    this.overlayService.caricamentoEvent.emit(true);

    let observable: Observable<any>;
    if (this.menuService.isUtenteAnonimo) {
      const numeroDoc = this.getNumDocumento();
      observable = this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .pipe(map((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem('boll-' + numeroDoc, JSON.stringify(this.creaBollettino()));
            localStorage.removeItem("parziale");
            return null;
          } else {
            // show err
            this.showMessage();
            return of('error');
          }

          this.overlayService.caricamentoEvent.emit(false);
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
        this.overlayService.caricamentoEvent.emit(false);
      }
    });
  }

  pagaOra() {
    this.overlayService.caricamentoEvent.emit(true);
    if (this.menuService.isUtenteAnonimo) {
      const numeroDoc = this.getNumDocumento();
      this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .subscribe((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem('boll-' + numeroDoc, JSON.stringify(this.creaBollettino()));
            localStorage.removeItem("parziale");
            this.aggiornaPrezzoCarrello();
            this.router.navigateByUrl('/carrello');
          } else {
            // show err
            this.showMessage();
            return of('error');
          }

          this.overlayService.caricamentoEvent.emit(false);
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
          this.overlayService.caricamentoEvent.emit(false);
          this.router.navigateByUrl('/carrello');
        }
      });
    }
  }

  salvaPerDopo() {
    this.overlayService.caricamentoEvent.emit(true);

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

        this.overlayService.caricamentoEvent.emit(false);
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
    if (this.menuService.isUtenteAnonimo) {
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
