import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ParametriRicercaRendicontazione} from '../../../../../model/rendicontazione/ParametriRicercaRendicontazione';
import {NgForm, NgModel} from '@angular/forms';
import {BottoneEnum} from '../../../../../../../enums/bottone.enum';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {GestisciPortaleService} from '../../../../../../../services/gestisci-portale.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-filtro-rendicontazione',
  templateUrl: './filtro-rendicontazione.component.html',
  styleUrls: ['./filtro-rendicontazione.component.scss']
})
export class FiltroRendicontazioneComponent extends FiltroGestioneElementiComponent implements OnInit {

  idFunzione;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaRendicontazione> = new EventEmitter<ParametriRicercaRendicontazione>();

  filtroRicercaRendicontazione: ParametriRicercaRendicontazione;

  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  listaSocieta: Array<OpzioneSelect> = [];

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private gestisciPortaleService: GestisciPortaleService) {
    super(activatedRoute, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaFiltri();
    this.recuperoFiltroSocieta();
  }

  inizializzaFiltri(): void {
    this.filtroRicercaRendicontazione = new ParametriRicercaRendicontazione();
    this.filtroRicercaRendicontazione.societaId = null;
    this.filtroRicercaRendicontazione.livelloTerritorialeId = null;
    this.filtroRicercaRendicontazione.enteId = null;
    this.filtroRicercaRendicontazione.servizioId = null;
    this.filtroRicercaRendicontazione.transazioneId = null;
    this.filtroRicercaRendicontazione.tipologiaServizioId = null;
    this.filtroRicercaRendicontazione.canaleId = null;
    this.filtroRicercaRendicontazione.dataPagamentoDa = null;
    this.filtroRicercaRendicontazione.dataPagamentoA = null;
    this.filtroRicercaRendicontazione.importoTransazioneDa = null;
    this.filtroRicercaRendicontazione.importoTransazioneA = null;
    this.filtroRicercaRendicontazione.flussoRendicontazioneId = null;
    this.filtroRicercaRendicontazione.dataCreazioneRendicontoDa = null;
    this.filtroRicercaRendicontazione.dataCreazioneRendicontoA = null;
    this.filtroRicercaRendicontazione.tipoFlussoId = null;
  }

  recuperoFiltroSocieta(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroSocieta(this.idFunzione).pipe(map(listaSocieta => {
      listaSocieta.forEach(societa => {
        this.listaSocieta.push({
          value: societa.id,
          label: societa.nome
        });
      });
      Utils.ordinaOpzioniSelect(this.listaSocieta);
    })).subscribe();
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (TipoCampoEnum.DATEDDMMYY === tipo) {
        return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  cercaElementi(): void {
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  private formattaFiltri() {
    const filtri: ParametriRicercaRendicontazione = JSON.parse(JSON.stringify(this.filtroRicercaRendicontazione));
    filtri.dataPagamentoDa = filtri.dataPagamentoDa
      ? moment(filtri.dataPagamentoDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME)
      : null;
    filtri.dataPagamentoA = filtri.dataPagamentoA
      ? moment(filtri.dataPagamentoA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO)
      : null;
    filtri.dataCreazioneRendicontoDa = filtri.dataCreazioneRendicontoDa
      ? moment(filtri.dataCreazioneRendicontoDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME)
      : null;
    filtri.dataCreazioneRendicontoA = filtri.dataCreazioneRendicontoA
      ? moment(filtri.dataCreazioneRendicontoA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO)
      : null;
    return filtri;
  }

  pulisciFiltri(filtroRendicontazioneForm: NgForm): void {
    filtroRendicontazioneForm.resetForm();
    this.filtroRicercaRendicontazione = new ParametriRicercaRendicontazione();
    this.onChangeFiltri.emit(null);
  }

  disabilitaBottone(filtroRendicontazioneForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroRendicontazioneForm.value).some(key => filtroRendicontazioneForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroRendicontazioneForm.valid;
    }
  }

}
