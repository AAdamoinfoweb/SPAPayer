import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {Banner} from '../../../../model/banner/Banner';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-dati-banner',
  templateUrl: './dati-banner.component.html',
  styleUrls: ['../gestisci-banner.component.scss', './dati-banner.component.scss']
})
export class DatiBannerComponent implements OnInit {

  @Input() datiBanner: Banner;
  @Input() funzione: FunzioneGestioneEnum;
  @Output() onValidaForm = new EventEmitter<boolean>();

  public editor = ClassicEditor;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format(Utils.FORMAT_DATE_CALENDAR);
  readonly tipoData = ECalendarValue.String;

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  constructor() { }

  ngOnInit(): void {
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
    return this.datiBanner.inizio != null
      ? (this.isDataInizioMaggioreDataFine() || campo?.errors != null)
      : campo?.errors != null;
  }

  isDataInizioMaggioreDataFine(): boolean {
    const momentDataInizio = moment(this.datiBanner.inizio, Utils.FORMAT_DATE_CALENDAR);
    const momentDataFine = moment(this.datiBanner.fine, Utils.FORMAT_DATE_CALENDAR);
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

  onChangeForm(datiBannerForm: NgForm) {
    const model = {...datiBannerForm.value};

    if (datiBannerForm.valid) {
      for (const nomeCampo in model) {
        if (model[nomeCampo] !== undefined && model[nomeCampo]) {
          if (nomeCampo === 'inizio' || nomeCampo === 'fine') {
            model[nomeCampo] = moment(model[nomeCampo], Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME);
          }
        } else {
          model[nomeCampo] = null;
        }
      }
      this.onValidaForm.emit(true);
    } else {
      this.onValidaForm.emit(false);
    }
  }

}
