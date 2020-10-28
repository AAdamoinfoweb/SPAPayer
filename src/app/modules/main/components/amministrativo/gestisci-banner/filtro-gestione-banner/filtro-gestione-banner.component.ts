import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Utils} from '../../../../../../utils/Utils';
import {ParametriRicercaBanner} from '../../../../model/banner/ParametriRicercaBanner';
import {Banner} from '../../../../model/banner/Banner';
import {NgForm, NgModel} from '@angular/forms';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';
import {map} from 'rxjs/operators';
import {BannerService} from '../../../../../../services/banner.service';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';

@Component({
  selector: 'app-filtro-gestione-banner',
  templateUrl: './filtro-gestione-banner.component.html',
  styleUrls: ['../gestisci-banner.component.scss', './filtro-gestione-banner.component.scss']
})
export class FiltroGestioneBannerComponent extends FiltroGestioneElementiComponent implements OnInit {

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly currentDate = moment().format(Utils.FORMAT_DATE_CALENDAR);
  readonly tipoData = ECalendarValue.String;

  filtroGestioneBannerApplicato: ParametriRicercaBanner;

  @Input()
  listaElementi: Array<Banner> = new Array<Banner>();

  @Output()
  onChangeListaElementi: EventEmitter<Banner[]> = new EventEmitter<Banner[]>();

  constructor(private bannerService: BannerService, private amministrativoService: AmministrativoService) {
    super();
  }

  ngOnInit(): void {
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      if (campo.name === 'inizio' && campo.model && this.isDataInizioMaggioreDataFine()) {
        return 'Inizio maggiore della fine';
      } else {
        return 'campo non valido';
      }
    } else {
      if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (TipoCampoEnum.DATEDDMMYY === tipo) {
        return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    if (campo?.name === 'inizio' || campo?.name === 'fine') {
      return this.controlloDate(campo);
    } else {
      return campo?.errors != null;
    }
  }

  controlloDate(campo: NgModel): boolean {
    return this.filtroGestioneBannerApplicato.inizio != null
      ? (this.isDataInizioMaggioreDataFine() || campo?.errors != null)
      : campo?.errors != null;
  }

  isDataInizioMaggioreDataFine(): boolean {
    const momentDataInizio = moment(this.filtroGestioneBannerApplicato.inizio, Utils.FORMAT_DATE_CALENDAR);
    const momentDataFine = moment(this.filtroGestioneBannerApplicato.fine, Utils.FORMAT_DATE_CALENDAR);
    return moment(momentDataFine).isBefore(momentDataInizio);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  setMinDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, Utils.FORMAT_DATE_CALENDAR).add(1, 'day').format(Utils.FORMAT_DATE_CALENDAR)
      : this.minDateDDMMYYYY;
  }

  setMaxDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, Utils.FORMAT_DATE_CALENDAR).subtract(1, 'day').format(Utils.FORMAT_DATE_CALENDAR) : null;
  }

  pulisciFiltri(filtroGestioneBannerForm: NgForm): void {
    filtroGestioneBannerForm.resetForm();
    this.onChangeListaElementi.emit(this.listaElementi);
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
  }

  cercaElementi(): void {
    const filtro = {...this.filtroGestioneBannerApplicato};

    if ('attivo' in filtro) {
      this.filtroGestioneBannerApplicato.attivo = filtro.attivo;
    } else {
      this.filtroGestioneBannerApplicato.attivo = false;
      filtro.attivo = false;
    }
    filtro.inizio = filtro.inizio ? moment(filtro.inizio, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtro.fine = filtro.fine ? moment(filtro.fine, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;

    this.bannerService.ricercaBanner(filtro, this.amministrativoService.idFunzione).pipe(map(listaBanner => {
      this.onChangeListaElementi.emit(listaBanner);
    })).subscribe();
  }

  disabilitaBottone(filtroGestioneBannerForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneBannerForm.value).some(key => filtroGestioneBannerForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued && this.filtroGestioneBannerApplicato.attivo == null;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneBannerForm.valid;
    }
  }

}
