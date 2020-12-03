import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ParametriRicercaStatistiche} from '../../../../model/statistica/ParametriRicercaStatistiche';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';

@Component({
  selector: 'app-filtro-gestisci-statistiche',
  templateUrl: './filtro-gestisci-statistiche.component.html',
  styleUrls: ['./filtro-gestisci-statistiche.component.scss']
})
export class FiltroGestisciStatisticheComponent extends FiltroGestioneElementiComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService) {
    super(activatedRoute, amministrativoService);
  }

  idFunzione;
  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaStatistiche> = new EventEmitter<ParametriRicercaStatistiche>();

  filtroRicercaStatistiche: ParametriRicercaStatistiche = new ParametriRicercaStatistiche();

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  ngOnInit(): void {
    this.filtroRicercaStatistiche = new ParametriRicercaStatistiche();
  }

  cercaElementi(): void {
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  private formattaFiltri() {
    const filtri: ParametriRicercaStatistiche = JSON.parse(JSON.stringify(this.filtroRicercaStatistiche));
    filtri.avvioSchedulazione = filtri.avvioSchedulazione ? moment(filtri.avvioSchedulazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtri.fineSchedulazione = filtri.fineSchedulazione ? moment(filtri.fineSchedulazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    return filtri;
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.filtroRicercaStatistiche = new ParametriRicercaStatistiche();
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

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroForm.value).some(key => filtroForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued && this.filtroRicercaStatistiche.attiva == null;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroForm.valid;
    }
  }

}
