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

@Component({
  selector: 'app-filtro-gestione-banner',
  templateUrl: './filtro-gestione-banner.component.html',
  styleUrls: ['../gestisci-banner.component.scss', './filtro-gestione-banner.component.scss']
})
export class FiltroGestioneBannerComponent implements OnInit {

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  filtroGestioneBannerApplicato: ParametriRicercaBanner;

  @Input()
  listaBanner: Array<Banner> = new Array<Banner>();

  @Output()
  onChangeListaBanner: EventEmitter<Banner[]> = new EventEmitter<Banner[]>();

  constructor(private bannerService: BannerService, private amministrativoService: AmministrativoService) { }

  ngOnInit(): void {
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      if (campo.errors?.required) {
        return 'Il campo è obbligatorio';
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
    const momentDataInizio = moment(this.filtroGestioneBannerApplicato.inizio, Utils.FORMAT_DATE_CALENDAR);
    const momentDataFine = moment(this.filtroGestioneBannerApplicato.fine, Utils.FORMAT_DATE_CALENDAR);
    return this.filtroGestioneBannerApplicato.inizio != null
      ? (moment(momentDataFine).isBefore(momentDataInizio) || campo?.errors != null)
      : campo?.errors != null;
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
    this.onChangeListaBanner.emit(this.listaBanner);
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
  }

  cercaBanner(filtroGestioneBannerForm: NgForm): void {
    const filtro = {...this.filtroGestioneBannerApplicato};

    Object.keys(filtroGestioneBannerForm.value).forEach(key => {
      const value = filtroGestioneBannerForm.value[key];
      if (value !== undefined && value) {
        if (key === 'inizio' || key === 'fine') {
          filtro[key] = moment(value, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME);
        } else {
          filtro[key] = value;
        }
      } else {
        filtro[key] = null;
      }
    });

    this.bannerService.ricercaBanner(filtro, this.amministrativoService.idFunzione).pipe(map(listaBanner => {
      this.onChangeListaBanner.emit(listaBanner);
    })).subscribe();
  }

  disabilitaBottone(filtroGestioneBannerForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneBannerForm.value).some(key => filtroGestioneBannerForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneBannerForm.valid || !isAtLeastOneFieldValued;
    }
  }

}
