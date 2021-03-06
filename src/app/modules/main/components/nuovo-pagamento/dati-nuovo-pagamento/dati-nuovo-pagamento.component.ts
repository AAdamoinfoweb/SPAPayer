import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {Banner} from '../../../model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../../services/banner.service';

import {JSONPath} from 'jsonpath-plus';
import {OverlayService} from '../../../../../services/overlay.service';
import {MenuService} from '../../../../../services/menu.service';
import {DatiPagamento} from '../../../model/bollettino/DatiPagamento';
import {MappingCampoInputPrecompilazioneEnum} from '../../../../../enums/mappingCampoInputPrecompilazione.enum';
import {Utils} from "../../../../../utils/Utils";
import {TipoModaleEnum} from "../../../../../enums/tipoModale.enum";
import {ConfirmationService} from "primeng/api";
import * as moment from "moment";
import * as _ from 'lodash';

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
              private confirmationService: ConfirmationService) {
  }

  readonly TipoCampoEnum = TipoCampoEnum;
  readonly LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;
  livelloIntegrazioneId: number = null;

  isBollettinoPrecompilato: boolean;
  isFaseVerificaPagamento: boolean;

  readonly nomeCampoAnnoBollettinoLV1 = 'anno';
  readonly nomeCampoCausaleBollettinoLV1 = 'causale';
  readonly nomeCampoDocumentoBollettinoLV1 = 'documento';

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

    // In modalit?? compilazione automatica, carico tutte le opzioni per le select dipendenti (in quanto i valori delle select da cui dipendono potrebbero arrivare successivamente)
    this.listaCampiDinamici.forEach(campo => {
      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        campo.dipendeDa = null;
        this.impostaOpzioniSelect(campo);
      }
    });

    if (this.datiPagamento.dettaglioTransazioneId) {
      this.nuovoPagamentoService.letturaBollettino(this.datiPagamento.dettaglioTransazioneId).subscribe((bollettino) => {
        // I pagamenti lv1 (legati alla fase1) non hanno la logica dei campi dettaglio transazione, quindi leggo i valori dei campi dagli attributi di bollettino
        if (this.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV1) {
          this.model[this.nomeCampoAnnoBollettinoLV1] = bollettino.anno;
          this.model[this.nomeCampoCausaleBollettinoLV1] = bollettino.causale;
          this.model[this.nomeCampoDocumentoBollettinoLV1] = bollettino.numero;
          this.model[this.importoNomeCampo] = bollettino.importo;
        } else {
          if (bollettino.listaCampoDettaglioTransazione) {
            this.impostaCampi(this.getCampiBollettinoInterno(bollettino.listaCampoDettaglioTransazione));
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
        }
      });
    } else if (this.isBollettinoEsterno()) {
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
            // Valorizzo il campo codice fiscale (se presente)
            if (campoCodicePagatore) {
              this.model[this.getNomeCampoForm(campoCodicePagatore)] = cfpiva;
            }
          }

        });
    } else {
      console.log('Dettaglio transazione id mancante su servizio diverso da LV3');
      this.overlayService.gestisciErrore();
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
      ? 'Per attivare il bottone accedi o registrati'
      : null;
  }

  clickIndietro(): void {
    if (this.datiPagamento) {
      this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(null);
    }

    this.isFaseVerificaPagamento = false;
    this.rimuoviCampoImporto();

    const campiOutput = this.listaCampiDinamici.filter(campo => !campo.campoInput);
    campiOutput.forEach(campo => {
      delete this.model[this.getNomeCampoForm(campo)];
    });
  }

  clickProcedi(): void {

    // Mapping valori dei campi input da usare per la precompilazione
    const valoriPerPrecompilazione = {};
    this.listaCampiDinamici.forEach(campo => {
      if (campo.campoInput && campo.jsonPath) {
        valoriPerPrecompilazione[campo.jsonPath] = this.model[this.getNomeCampoForm(campo)];
      }
    });

    // Mapping valori dei campi output precompilati
    this.nuovoPagamentoService.recuperaValoriCampiPrecompilati(this.servizio.id, this.servizio.enteId, this.servizio.tipologiaServizioId,
      this.servizio.livelloIntegrazioneId, valoriPerPrecompilazione)
      .subscribe((valoriCampiPrecompilati) => {
        this.isFaseVerificaPagamento = true;
        this.aggiungiCampoImporto();

        // TODO (attendere implementazione backend) testare mapping campi output per servizio LV2BO (NB: al momento la chiamata crasha lato backend per servizio LV2BO)
        this.impostaValoriCampiOutput(valoriCampiPrecompilati);
      });
  }

  impostaValoriCampiOutput(valoriCampiPrecompilati): void {
    const campiOutput = this.listaCampiDinamici.filter(campo => !campo.campoInput);
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

    if (this.isBollettinoPrecompilato
      && !campo.campoInput
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
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.pulisci();
        },
        TipoModaleEnum.ANNULLA,
      )
    );

  }

  private pulisci() {
    this.form.reset();

    this.listaCampiDinamici.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);

      this.model[nomeCampo] = null;

      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        this.form.controls[nomeCampo].disable();
        campo.opzioni = [];
      }
    });

    localStorage.removeItem("parziale");
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

    // Per i pagamenti lv1 aperti in modale, leggo la chiave (numero documento) dall'esterno, e non la formatto
    if (!this.datiPagamento) {
      chiave = chiave.replace('/', '');
    }

    return chiave;
  }

  aggiornaPrezzoCarrello(): void {
    this.nuovoPagamentoService.prezzoEvent.emit({value: this.model[this.importoNomeCampo], type: 'add'});
  }

  creaForm(): void {
    this.listaCampiDinamici = [];
    this.form = new FormGroup({});
    this.model = {};
    this.importoFormControl.reset();
    this.mostraCampoImporto = null;
    this.isFaseVerificaPagamento = false;

    if (!this.isBollettinoPrecompilato || this.datiPagamento) {
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

  impostaLivelloIntegrazione(livelloIntegrazione: LivelloIntegrazioneEnum): void {
    this.livelloIntegrazioneId = livelloIntegrazione;

    switch (livelloIntegrazione) {
      case LivelloIntegrazioneEnum.LV1:
        this.isBollettinoPrecompilato = false;
        this.isFaseVerificaPagamento = null;
        break;
      case LivelloIntegrazioneEnum.LV2:
        this.isBollettinoPrecompilato = false;
        this.isFaseVerificaPagamento = null;
        break;
      case LivelloIntegrazioneEnum.LV2_BACK_OFFICE:
        this.isBollettinoPrecompilato = true;
        this.isFaseVerificaPagamento = false;
        break;
      case LivelloIntegrazioneEnum.LV3:
        this.isBollettinoPrecompilato = true;
        this.isFaseVerificaPagamento = false;
        break;
    }
  }

  scaleToFit(img, canvas) {
    const context = canvas.getContext('2d');
    // get the scale
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  inizializzazioneForm(servizio: FiltroServizio): Observable<any> {
    this.servizio = servizio;
    this.nuovoPagamentoService.getLogoEnte(this.servizio.enteId).subscribe(logo => {
      if (logo) {
        const canvas: any = document.getElementById('canvas');
        if (canvas != null) {
          const context = canvas.getContext('2d');
          const reader = new FileReader();
          // @ts-ignore
          reader.readAsDataURL(Utils.b64toBlob(logo.contenuto));
          reader.onload = () => {
            const imageObj = new Image();
            if (typeof reader.result === 'string') {
              imageObj.src = reader.result;
            }
            imageObj.onload = () => {
              context.clearRect(0, 0, canvas.width, canvas.height);
              this.scaleToFit(imageObj, canvas);
            };
          };
        }
      }
    });
    const isCompilato = this.servizio != null;

    if (isCompilato) {
      this.impostaLivelloIntegrazione(servizio.livelloIntegrazioneId);
      this.creaForm();

      // Nella modale occorre gestire anche i pagamenti lv1, che hanno dei campi statici
      if (this.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV1) {
        const campi = this.getCampiPagamentoLV1();
        this.impostaCampi(campi);
        if (this.datiPagamento) {
          this.impostaDettaglioPagamento();
        }
        return of(null);
      } else if (this.datiPagamento && this.datiPagamento.dettaglioTransazioneId) {
        /*
        Nel caso della modale dettaglio pagamento legata ad un pagamento presente sul db (con dettaglioTransazioneId),
        leggo i campi da listaCampiDettaglioTransazione, anzich?? dalla GET di campi pagamento,
        dato che i campi potrebbero essere cambiati rispetto a quando fu inserito il pagamento nel db
         */
        this.impostaDettaglioPagamento();
        return of(null);
      } else {
        return this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizio.id).pipe(map(campiNuovoPagamento => {
          this.impostaCampi(campiNuovoPagamento.campiTipologiaServizio, true);
          this.impostaCampi(campiNuovoPagamento.campiServizio, false);

          this.restoreParziale();

          if (this.datiPagamento) {
            this.impostaDettaglioPagamento();
          }
        }));
      }
    } else {
      return of(null);
    }
  }

  getCampiPagamentoLV1(): CampoForm[] {
    const campiPagamentoLV1: CampoForm[] = [];

    const campoAnno = new CampoForm();
    campoAnno.id = 1;
    campoAnno.titolo = this.nomeCampoAnnoBollettinoLV1;
    campoAnno.tipoCampo = TipoCampoEnum.INPUT_TESTUALE;
    campoAnno.posizione = 1;
    campoAnno.chiave = false;
    campoAnno.campoInput = true;
    campiPagamentoLV1.push(campoAnno);

    const causale = new CampoForm();
    causale.id = 2;
    causale.titolo = this.nomeCampoCausaleBollettinoLV1;
    causale.tipoCampo = TipoCampoEnum.INPUT_TESTUALE;
    causale.posizione = 2;
    campoAnno.chiave = false;
    causale.campoInput = true;
    campiPagamentoLV1.push(causale);

    const documento = new CampoForm();
    documento.id = 3;
    documento.titolo = this.nomeCampoDocumentoBollettinoLV1;
    documento.tipoCampo = TipoCampoEnum.INPUT_TESTUALE;
    documento.posizione = 3;
    campoAnno.chiave = true;
    documento.campoInput = true;
    campiPagamentoLV1.push(documento);

    return campiPagamentoLV1;
  }

  getCampiBollettinoInterno(listaCampoDettaglioTransazione: CampoDettaglioTransazione[]): CampoForm[] {
    const campi: CampoForm[] = [];
    if (listaCampoDettaglioTransazione) {
      listaCampoDettaglioTransazione.forEach((dettaglio, index) => {
        const campo = new CampoForm();
        campo.id = index;
        campo.titolo = dettaglio.titolo;
        campo.tipoCampo = TipoCampoEnum.INPUT_TESTUALE;
        campo.posizione = index;
        campo.chiave = false;
        campo.campoInput = true;
        campi.push(campo);
      });
    }
    return campi;
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

  impostaCampi(campi: Array<CampoForm>, isTipologiaServizio: boolean = null): void {
    campi = _.sortBy(campi, ['posizione']);

    campi.forEach(campo => {
      const campoForm = new FormControl();
      if (campo.disabilitato || !campo.campoInput || this.datiPagamento) {
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
          // Con i numeri non ?? possibile usare minLength e maxLength
          validatori.push(Validators.max(this.calcolaMaxInputNumerico(campo)));
          validatori.push(Validators.min(this.calcolaMinInputNumerico(campo)));
          break;
        case TipoCampoEnum.INPUT_PREZZO:
          // Con i numeri non ?? possibile usare minLength
          validatori.push(Validators.min(this.calcolaMinInputPrezzo(campo)));
          validatori.push(Validators.max(this.calcolaMaxInputNumerico(campo)));
          break;
        case TipoCampoEnum.DATEYY:
          validatori.push(Validators.min(this.minDataYY));
          validatori.push(Validators.max(this.calcolaMaxInputAnno(campo)));
          break;
        case TipoCampoEnum.SELECT:
          // I campi select vanno impostati dopo che tutti i campi sono stati caricati, per poter gestire il dipendeDa
          break;
      }

      campoForm.setValidators(validatori);

      campo.isCampoTipologiaServizio = isTipologiaServizio;
      this.model[this.getNomeCampoForm(campo)] = null;
      this.form.addControl(this.getNomeCampoForm(campo), campoForm);
      this.listaCampiDinamici.push(campo);
    });

    const campiSelect = campi.filter(campo => campo.tipoCampo === TipoCampoEnum.SELECT);
    if (campiSelect) {
      campiSelect.forEach(campoSelect => {
        this.impostaOpzioniSelect(campoSelect);
        if (!campoSelect.opzioni?.length) {
          this.form.controls[this.getNomeCampoForm(campoSelect)].disable();
        }
      });
    }
  }

  getCampoDettaglioTransazione(campoDettaglioTransazione: string) {
    const campoForms: CampoForm[] = this.listaCampiDinamici.filter((value: CampoForm) => value.campoDettaglioTransazione && value.campoDettaglioTransazione.toLowerCase() == campoDettaglioTransazione.toLocaleLowerCase());
    if (campoForms.length > 0) {
      return this.getNomeCampoForm(campoForms[0]);
    } else {
      return null;
    }
  }

  /*
    Metodo usato per astrarre il formato della chiave con cui leggere/scrivere sul model il valore di un oggetto CampoForm.
    Da non confondere con il metodo getTitoloCampo che restituisce l'attributo titolo di un oggetto CampoForm.
  */
  getNomeCampoForm(campo: CampoForm): string {
    if (campo.isCampoTipologiaServizio === null) {
      // Per i casi in cui i campi sono generati manualmente invece di chiamare la GET, usiamo l'id generato manualmente
      return '' + campo.id;
    } else {
      return campo.isCampoTipologiaServizio ? 'TS' + campo.id : 'S' + campo.id;
    }
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
          descrizione = 'Il campo ?? obbligatorio';
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

  getIdCampo(campo: CampoForm) {
    return campo.id;
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
    campo.opzioni = [];

    const valoriTipologica = JSON.parse(localStorage.getItem(campo.tipologica));

    if (valoriTipologica) {

      // Converto i valori in oggetti OpzioneSelect
      valoriTipologica.forEach(valore => {
        switch (campo.tipologica) {
          // Inserire qui logica per l'impostazione delle opzioni di nuove tipologiche di select

          case TipologicaSelectEnum.PROVINCE:
            campo.opzioni.push({
              id: valore.codice,
              value: valore.nome,
              label: valore.nome
            });
            break;
          case TipologicaSelectEnum.COMUNI:
            campo.opzioni.push({
              id: valore.codiceIstat,
              value: valore.nome,
              label: valore.nome
            });
            break;
        }
      });

      // Se la select dipende da un'altra select, filtro le opzioni
      if (campo.dipendeDa) {
        const campoPadre = this.listaCampiDinamici.find(item => item.id === campo.dipendeDa);
        // Controllo di sicurezza in caso di malfunzionamenti (Con un corretto funzionamento della logica di dipendenza il campo padre ?? sempre presente)
        if (campoPadre) {
          const valoreCampoPadre = this.model[this.getNomeCampoForm(campoPadre)];
          this.filtraOpzioniSelectDipendente(campo, campoPadre, valoreCampoPadre);
        }
      }

      // Ordino le opzioni della select
      campo.opzioni = _.sortBy(campo.opzioni, ['label']);
    }
  }

  filtraOpzioniSelectDipendente(campo: CampoForm, campoPadre: CampoForm, valoreCampoPadre: any) {
    /*
        Inserire qui altre regole di dipendenza custom fra le tipologiche.
        In mancanza di una regola custom, la select dipendente avr?? tutte le opzioni se la select padre ?? selezionata, e nessuna opzione se la select padre NON ?? selezionata
     */

    if (campoPadre.tipoCampo === TipoCampoEnum.SELECT && valoreCampoPadre) {
      if (campo.tipologica === TipologicaSelectEnum.COMUNI && campoPadre.tipologica === TipologicaSelectEnum.PROVINCE) {
        const idOpzioneSelezionataCampoPadre = campoPadre.opzioni.find(opzione => opzione.value === valoreCampoPadre)?.id;
        // inserisco nelle opzioni solo i comuni che hanno l'id (codiceIstat) che inizia con le 3 cifre dell'id (codice) della provincia
        campo.opzioni = campo.opzioni.filter(opzione => opzione.id?.substring(0, 3) === idOpzioneSelezionataCampoPadre);
      } else {
        // Le opzioni non vengono filtrate
        campo.opzioni = campo.opzioni;
      }
    } else {
      campo.opzioni = [];
    }
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

    bollettino.anagraficaPagatore = this.model[this.getCampoDettaglioTransazione('anagrafica_pagatore')];
    bollettino.anno = this.model[this.getCampoDettaglioTransazione('anno_documento')];
    bollettino.causale = this.model[this.getCampoDettaglioTransazione('causale')];

    bollettino.iuv = this.model[this.getCampoDettaglioTransazione('iuv')] != null ?
      this.model[this.getCampoDettaglioTransazione('iuv')].toString() : null;

    // rimuovere primi 3 caratteri
    if (bollettino.iuv == null)
      bollettino.iuv = this.model[this.getCampoDettaglioTransazione('iuv (da codice_avviso)')] != null ?
        this.model[this.getCampoDettaglioTransazione('iuv (da codice_avviso)')].toString().substring(3) : null;

    bollettino.cfpiva = this.model[this.getCampoDettaglioTransazione('codice_fiscale_pagatore')];
    bollettino.dataScadenza = this.model[this.getCampoDettaglioTransazione('data_scadenza')] ? moment(this.model[this.getCampoDettaglioTransazione('data_scadenza')], Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    bollettino.dataSanzione = this.model[this.getCampoDettaglioTransazione('data_sanzione')] ? moment(this.model[this.getCampoDettaglioTransazione('data_sanzione')], Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    bollettino.targa = this.model[this.getCampoDettaglioTransazione('targa')];
    bollettino.importo = this.model[this.importoNomeCampo];

    bollettino.listaCampoDettaglioTransazione = [];
    this.listaCampiDinamici.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);
      const field: CampoDettaglioTransazione = new CampoDettaglioTransazione();
      field.titolo = this.getTitoloCampo(campo);
      field.valore = this.model[nomeCampo];
      bollettino.listaCampoDettaglioTransazione.push(field);
    });
    return bollettino;
  }

  aggiungiAlCarrello() {
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

        }));
    } else {
      observable = this.getObservableAggiungiAlCarrello();
    }
    observable.subscribe((result) => {
      if (result != 'error') {
        this.aggiornaPrezzoCarrello();
        this.pulisci();
        if (this.datiPagamento) {
          this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(null);
        }

      } else {
        this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(null);
      }
    });
  }

  isBollettinoEsterno(): boolean {
    return this.datiPagamento && this.servizio.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV3 && !this.datiPagamento.dettaglioTransazioneId;
  }

  isBollettinoDaInserire(): boolean {
    // Il bollettino NON va inserito nel caso in cui si ?? nella modale di miei pagamenti e si sceglie un pagamento gi?? presente sul db; altrimenti, va inserito
    return (this.datiPagamento && this.isBollettinoEsterno()) || !this.datiPagamento;
  }

  getObservableAggiungiAlCarrello(): Observable<any> {
    if (this.isBollettinoDaInserire()) {
      return this.nuovoPagamentoService.inserimentoBollettino(this.creaListaBollettini())
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
    } else {
      const dettagliTransazione = new DettagliTransazione();
      dettagliTransazione.listaDettaglioTransazioneId = [];
      dettagliTransazione.listaDettaglioTransazioneId.push(this.datiPagamento.dettaglioTransazioneId);
      return this.nuovoPagamentoService.inserimentoCarrello(dettagliTransazione);
    }
  }

  pagaOra() {
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

        });
    } else {
      const observable: Observable<any> = this.getObservableAggiungiAlCarrello();
      observable.subscribe((result) => {
        if (result !== 'error') {
          this.aggiornaPrezzoCarrello();

          // Se sono nella modale, la chiudo dopo aver aggiunto il pagamento al carrello
          if (this.datiPagamento) {
            this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(null);
          }

          this.router.navigateByUrl('/carrello');
        }
      });
    }
  }

  salvaPerDopo() {
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
      testo: 'Il bollettino ?? gi?? stato pagato o in corso di pagamento. Per maggiori informazioni consultare la sezione i miei pagamenti o contattare l???help desk',
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
