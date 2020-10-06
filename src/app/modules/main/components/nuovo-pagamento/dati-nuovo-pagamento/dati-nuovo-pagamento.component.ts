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

@Component({
  selector: 'app-dati-nuovo-pagamento',
  templateUrl: './dati-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento.component.scss', './dati-nuovo-pagamento.component.scss']
})
export class DatiNuovoPagamentoComponent implements OnInit {
  TipoCampoEnum = TipoCampoEnum; // per passare l'enum al template html

  LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;
  livelloIntegrazioneId: number = null;

  isFaseVerificaPagamento = false;

  tipoData = ECalendarValue.String;

  @Input()
  servizio: Servizio = null;

  listaCampiTipologiaServizio: Array<CampoForm> = [];
  listaCampiServizio: Array<CampoForm> = [];
  listaCampi: Array<CampoForm> = [];

  importoFormControl: FormControl = new FormControl();
  form: FormGroup = new FormGroup({importo: this.importoFormControl});
  model = {importo: null};

  minDataDDMMYY = '01/01/1900';
  minDataMMYY = '01/1900';
  minDataYY = 1900;

  minInputNumerico = 0;

  lunghezzaMaxCol1: number = 5;
  lunghezzaMaxCol2: number = 10;
  lunghezzaMaxCol3: number = 15;

  mesi: Array<OpzioneSelect> = [
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

  isVisibile = true;

  isUtenteAnonimo: boolean = null;
  tooltipBottoneSalvaPerDopo: string = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.checkUtenteLoggato();
    this.compila(this.servizio);
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

  procediAVerificaPagamento(): void {
    this.isFaseVerificaPagamento = true;
    // TODO logica bottone procedi
  }

  aggiornaVisibilita(): void {
    this.isVisibile = !this.isVisibile;
  }

  mockCampiForm(): Array<CampoForm> {
    const campiMockati: Array<CampoForm> = [];
    let campo;

    campo = {
      id: 1,
      titolo: 'Importo',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.INPUT_PREZZO,
      informazioni: 'Inserisci un importo',
      lunghezzaVariabile: true,
      lunghezza: 5,
      campoFisso: true,
      disabilitato: false,
      posizione: 1,
      chiave: false,
      controllo_logico: null,
      campo_input: false,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 2,
      titolo: 'Provincia residenza',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.SELECT,
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
      tipologica: TipologicaSelectEnum.PROVINCE,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 3,
      titolo: 'Comune residenza',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.SELECT,
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
      tipologica: TipologicaSelectEnum.COMUNI,
      dipendeDa: 2
      // dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 4,
      titolo: 'Testo',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.INPUT_TESTUALE,
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

    campo = {
      id: 5,
      titolo: 'Data small',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.DATEDDMMYY,
      informazioni: 'Inserisci una data',
      lunghezzaVariabile: true,
      lunghezza: 5,
      campoFisso: true,
      disabilitato: false,
      posizione: 5,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 6,
      titolo: 'Data large',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.DATEDDMMYY,
      informazioni: 'Inserisci una data',
      lunghezzaVariabile: true,
      lunghezza: 20,
      campoFisso: true,
      disabilitato: false,
      posizione: 6,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 7,
      titolo: 'DataMMYY',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.DATEMMYY,
      informazioni: 'Inserisci un mese e un anno',
      lunghezzaVariabile: true,
      lunghezza: 15,
      campoFisso: true,
      disabilitato: false,
      posizione: 7,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    campo = {
      id: 8,
      titolo: 'DataYY',
      obbligatorio: true,
      TipoCampoEnum: TipoCampoEnum.DATEYY,
      informazioni: 'Inserisci un anno',
      lunghezzaVariabile: true,
      lunghezza: 5,
      campoFisso: true,
      disabilitato: false,
      posizione: 8,
      chiave: false,
      controllo_logico: null,
      campo_input: true,
      json_path: null,
      tipologica: null,
      dipendeDa: null
    };
    campiMockati.push(campo);

    return campiMockati;
  }

  calcolaDimensioneCampo(campo: CampoForm): string {
    let classe;

    if (this.servizio?.livelloIntegrazioneId === LivelloIntegrazioneEnum.LV2_BACK_OFFICE
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

  pulisciCampiForm(): void {
    this.form.reset();

    this.listaCampi.forEach(campo => {
      const nomeCampo = this.getNomeCampoForm(campo);

      this.model[nomeCampo] = null;

      if (campo.tipoCampo === TipoCampoEnum.SELECT && campo.dipendeDa) {
        this.form.controls[nomeCampo].disable();
        campo.opzioni = [];
      }
    });
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
    // TODO logica precompila campi form, in caso di LV2_BACK_OFFICE
  }

  aggiornaPrezzoCarrello(): void {
    this.nuovoPagamentoService.prezzoEvent.emit(this.model.importo);
  }

  compila(servizio: Servizio): void {
    this.servizio = servizio;
    const isCompilato = this.servizio != null;

    if (isCompilato) {
      this.livelloIntegrazioneId = this.servizio.livelloIntegrazioneId;

      this.nuovoPagamentoService.recuperaCampiSezioneDati(this.servizio.id).pipe(map(campiNuovoPagamento => {
        this.listaCampiTipologiaServizio = campiNuovoPagamento.campiTipologiaServizio;
        this.listaCampiServizio = campiNuovoPagamento.campiServizio;
        // this.listaCampiTipologiaServizio = this.mockCampiForm();

        this.listaCampi = [];
        this.form = new FormGroup({importo: this.importoFormControl});
        this.model = {
          importo: null
        };
        this.impostaCampi(this.listaCampiTipologiaServizio);
        this.impostaCampi(this.listaCampiServizio);
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
      if (campo.controllo_logico?.regex) { validatori.push(Validators.pattern(campo.controllo_logico.regex)); }

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

  creaBollettino(): Array<Bollettino> {
    const bollettini: Array<Bollettino> = new Array<Bollettino>();
    // TODO logica di conversione fra oggetto model e array di bollettini

    return bollettini;
  }

  aggiungiAlCarrello() {
    this.aggiornaPrezzoCarrello();

    const anonimo = localStorage.getItem('nome') === 'null' && localStorage.getItem('cognome') === 'null';
    if (anonimo) {
      const numeroDoc = this.getNumDocumento();
      this.nuovoPagamentoService.verificaBollettino(numeroDoc)
        .subscribe((result) => {
          if (result !== EsitoEnum.OK && result !== EsitoEnum.PENDING) {
            localStorage.setItem(numeroDoc, JSON.stringify(this.model));
            this.pulisciCampiForm();
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
}
