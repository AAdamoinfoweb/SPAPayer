import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {ParametriRicercaServizio} from '../../../../model/servizio/ParametriRicercaServizio';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {CampoTipologiaServizioService} from '../../../../../../services/campo-tipologia-servizio.service';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {NgForm, NgModel} from '@angular/forms';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {TipologiaServizio} from '../../../../model/tipologiaServizio/TipologiaServizio';
import {ConfiguraServizioService} from "../../../../../../services/configura-servizio.service";
import * as _ from 'lodash';
import {FiltroSelect} from '../../../../model/servizio/FiltroSelect';

@Component({
  selector: 'app-filtro-gestione-servizio',
  templateUrl: './filtro-gestione-servizio.component.html',
  styleUrls: ['./filtro-gestione-servizio.component.scss']
})
export class FiltroGestioneServizioComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaServizio> = new EventEmitter<ParametriRicercaServizio>();

  TipoCampoEnum = TipoCampoEnum;

  isCalendarOpen = false;
  readonly minDateDDMMYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  @Input()
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.AGGIUNGI;
  FunzioneGestioneEnum = FunzioneGestioneEnum;

  opzioniRaggruppamento: OpzioneSelect[] = [];

  filtriRicerca: ParametriRicercaServizio = new ParametriRicercaServizio();

  @Input()
  filtriIniziali: ParametriRicercaServizio;

  listaCodiciTipologia = [];
  listaCodiciTipologiaFiltrati = [];
  labelOggettoTipologia: string;

  disabilitaFiltri = false;

  constructor(
    protected amministrativoService: AmministrativoService, protected route: ActivatedRoute,
    private raggruppamentoTipologiaServizioService: RaggruppamentoTipologiaServizioService,
    private configuraServizioService: ConfiguraServizioService,
    private campoTipologiaServizioService: CampoTipologiaServizioService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaOpzioniRaggruppamento();
    if (this.isPaginaGestione()) {
      this.caricaCodiciTipologia();
    }
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.filtriIniziali?.currentValue) {
      this.filtriRicerca = this.filtriIniziali;
      this.disabilitaFiltri = false;
    }

  }

  inizializzaOpzioniRaggruppamento(): void {
    this.raggruppamentoTipologiaServizioService.ricercaRaggruppamentoTipologiaServizio(null, this.idFunzione)
      .subscribe(listaRaggruppamenti => {
        if (listaRaggruppamenti) {
          listaRaggruppamenti.forEach(raggruppamento => {
            this.opzioniRaggruppamento.push({
              value: raggruppamento.id,
              label: raggruppamento.descrizione
            });
          });
          this.opzioniRaggruppamento = _.sortBy(this.opzioniRaggruppamento, ['label']);
        }
      });
  }

  selezionaRaggruppamento(): void {
    this.filtriRicerca.tipologiaServizio = new TipologiaServizio();
    this.listaCodiciTipologia = [];
    this.listaCodiciTipologiaFiltrati = [];

    if (this.filtriRicerca.raggruppamentoId) {
      this.caricaCodiciTipologia();
    }
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  creaTipologia(): void {
    this.disabilitaFiltri = true;
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  caricaCodiciTipologia(): void {
    let observable;

    // Nella pagina Gestione carico solo le tipologie per cui sono abilitato, indipendentemente dal raggruppamento; Nella pagina Form carico tutti i filtri collegati ad un determinato raggruppamento
    if (this.isPaginaGestione()) {
      observable = this.configuraServizioService.configuraServiziFiltroTipologia(this.idFunzione);
      this.labelOggettoTipologia = 'nome';
    } else {
      observable = this.campoTipologiaServizioService.recuperaTipologieServizio(this.filtriRicerca, this.idFunzione);
      this.labelOggettoTipologia = 'codice';
    }

    observable.subscribe(listaTipologieServizio => {
      if (listaTipologieServizio) {
        listaTipologieServizio = _.sortBy(listaTipologieServizio, [this.labelOggettoTipologia]);
        this.listaCodiciTipologia = listaTipologieServizio;
        this.listaCodiciTipologiaFiltrati = this.listaCodiciTipologia;
      }
    });
  }

  filtraCodiciTipologia(event): void {
    const input = event.query;
    this.listaCodiciTipologiaFiltrati = this.listaCodiciTipologia.filter(value => value[this.labelOggettoTipologia].toLowerCase().startsWith(input.toLowerCase()));
  }

  setPlaceholder(campo: NgModel, tipoCampo: TipoCampoEnum): string {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return null;
    } else if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'inserisci testo';
        case TipoCampoEnum.DATEDDMMYY:
          return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  pulisciFiltri(form: NgForm): void {
    form.reset();
    this.onChangeFiltri.emit(null);
  }

  isPaginaGestione(): boolean {
    return this.funzione === undefined;
  }

  disabilitaFiltroRaggruppamento(): boolean {
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI && this.disabilitaFiltri) {
      return true;
    } else if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return true;
    } else {
      return null;
    }
  }

  disabilitaFiltroCodice(): boolean {
    return !this.filtriRicerca.raggruppamentoId || this.disabilitaFiltri;
  }

  disabilitaBottonePulisci(): boolean {
    return !this.filtriRicerca.raggruppamentoId && !this.filtriRicerca.tipologiaServizio ? true : null;
  }

  disabilitaPulsanteCrea(): boolean {
    return !this.filtriRicerca.raggruppamentoId || !this.filtriRicerca.tipologiaServizio
      || !this.filtriRicerca.nomeServizio || !this.filtriRicerca.abilitaDa || !this.filtriRicerca.abilitaA || this.disabilitaFiltri;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  disabilitaCampi() {
    return this.disabilitaFiltri;
  }
}
