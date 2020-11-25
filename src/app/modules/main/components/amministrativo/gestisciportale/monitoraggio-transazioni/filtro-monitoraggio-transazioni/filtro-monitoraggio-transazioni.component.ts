import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ParametriRicercaTransazioni} from '../../../../../model/transazione/ParametriRicercaTransazioni';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {OpzioneSelect} from "../../../../../model/OpzioneSelect";

@Component({
  selector: 'app-filtro-monitoraggio-transazioni',
  templateUrl: './filtro-monitoraggio-transazioni.component.html',
  styleUrls: ['./filtro-monitoraggio-transazioni.component.scss']
})
export class FiltroMonitoraggioTransazioniComponent extends FiltroGestioneElementiComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService) {
    super(activatedRoute, amministrativoService);
  }

  idFunzione;
  @Output()
  onChangeFiltri: EventEmitter<any> = new EventEmitter<any>();

  filtroRicercaTransazioni: ParametriRicercaTransazioni = new ParametriRicercaTransazioni();

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  // opzioni per select
  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriale: OpzioneSelect[] = [];
  opzioniFiltroEnte: OpzioneSelect[] = [];
  opzioniFiltroTipologiaServizio: OpzioneSelect[] = [];
  opzioniFiltroServizio: OpzioneSelect[] = [];
  opzioniFiltroIdentificativoTransazione: OpzioneSelect[] = [];
  opzioniFiltroCanale: OpzioneSelect[] = [];
  opzioniFiltroVersanteIndirizzoIP: OpzioneSelect[] = [];
  opzioniFiltroStatoTransazione: OpzioneSelect[] = [];

  ngOnInit(): void {
  }

  cercaElementi(): void {
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  private formattaFiltri() {
    const filtri: ParametriRicercaTransazioni = JSON.parse(JSON.stringify(this.filtroRicercaTransazioni));
    filtri.dataTransazioneDa = filtri.dataTransazioneDa ?
      moment(filtri.dataTransazioneDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtri.dataTransazioneA = filtri.dataTransazioneA ?
      moment(filtri.dataTransazioneA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    return filtri;
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

}
