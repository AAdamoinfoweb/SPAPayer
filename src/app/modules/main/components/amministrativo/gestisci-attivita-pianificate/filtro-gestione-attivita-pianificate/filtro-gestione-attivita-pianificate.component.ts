import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {ParametriRicercaStatistiche} from '../../../../model/statistica/ParametriRicercaStatistiche';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {NgForm, NgModel} from '@angular/forms';
import {Utils} from '../../../../../../utils/Utils';
import * as moment from 'moment';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';

@Component({
  selector: 'app-filtro-gestione-attivita-pianificate',
  templateUrl: './filtro-gestione-attivita-pianificate.component.html',
  styleUrls: ['../gestisci-attivita-pianificate.component.scss', './filtro-gestione-attivita-pianificate.component.scss']
})
export class FiltroGestioneAttivitaPianificateComponent extends FiltroGestioneElementiComponent implements OnInit {

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  filtroGestioneAttivitaPianificata: ParametriRicercaStatistiche;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaStatistiche> = new EventEmitter<ParametriRicercaStatistiche>();

  idFunzione;

  constructor(protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.filtroGestioneAttivitaPianificata = new ParametriRicercaStatistiche();
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

  pulisciFiltri(filtroGestioneAttivitaForm: NgForm): void {
    filtroGestioneAttivitaForm.resetForm();
    this.filtroGestioneAttivitaPianificata = new ParametriRicercaStatistiche();
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    const filtro = {...this.filtroGestioneAttivitaPianificata};

    if ('attiva' in filtro) {
      this.filtroGestioneAttivitaPianificata.attiva = filtro.attiva;
    } else {
      this.filtroGestioneAttivitaPianificata.attiva = false;
      // @ts-ignore
      filtro.attiva = false;
    }
    filtro.avvioSchedulazione = filtro.avvioSchedulazione ? moment(filtro.avvioSchedulazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtro.fineSchedulazione = filtro.fineSchedulazione ? moment(filtro.fineSchedulazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;

    this.onChangeFiltri.emit(filtro);
  }

  disabilitaBottone(filtroGestioneAttivitaForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneAttivitaForm.value).some(key => filtroGestioneAttivitaForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued && this.filtroGestioneAttivitaPianificata.attiva == null;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneAttivitaForm.valid;
    }
  }

}
