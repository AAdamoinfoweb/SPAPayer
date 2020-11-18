import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Schedulazione} from '../../../model/statistica/Schedulazione';
import {FunzioneGestioneEnum} from '../../../../../enums/funzioneGestione.enum';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {NgForm, NgModel} from '@angular/forms';
import {Utils} from '../../../../../utils/Utils';

@Component({
  selector: 'app-schedulazione',
  templateUrl: './schedulazione.component.html',
  styleUrls: ['./schedulazione.component.scss']
})
export class SchedulazioneComponent implements OnInit {

  constructor() { }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  tooltipFestivita = 'Definisce date o ore in cui il lavoro non deve essere eseguito.' +
    '\nQueste date possono essere definite utilizzando espressioni cron di Quartz come spiegato nella documentazione di CronCalendar, con ciascuna definizione di festività su una nuova riga.' +
    '\nIn alternativa, è possibile utilizzare codice groovy, con il codice che restituisce un Calendar o un elenco di Calendar.' +
    '\nSe si utilizza codice groovy, il campo dovrebbe iniziare con "g [" e terminare con "] g".';
  tooltipSchedulazioniExtra = 'Definizioni di schedulazioni extra su cui eseguire il lavoro, oltre alla schedulazione principale definita nei singoli campi della schedulazione.' +
    '\nLe pianificazioni possono essere definite come espressioni cron di Quartz, con ciascuna schedulazione su una nuova riga.' +
    '\nIn alternativa, è possibile utilizzare codice groovy, con il codice che restituisce un Trigger o un elenco di Trigger.' +
    '\nSe si utilizza codice groovy, il campo dovrebbe iniziare con "g [" e terminare con "] g".';


  @Input()
  schedulazione: Schedulazione;
  @Input()
  funzione: FunzioneGestioneEnum;

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;
  opzioniTimeZone: OpzioneSelect[] = [];

  ngOnInit(): void {
    this.inizializzaTimeZone();
  }

  private inizializzaTimeZone() {
    this.opzioniTimeZone.push({
      value: Utils.TIME_ZONE,
      label: Utils.TIME_ZONE
    });
  }

  isCampoInvalido(campo: NgModel) {
    if (campo?.name === 'fineSchedulazione') {
      return campo?.errors != null || this.controlloDate(this.schedulazione);
    } else {
      return campo?.errors != null;
    }
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }
  onChangeModel(form: NgForm, campo?: NgModel) {
    if (campo?.value == '') {
        this.schedulazione[campo.name] = null;
    }
    let isFineBeforeInizio = false;
    if (this.schedulazione.fine != null) {
      isFineBeforeInizio = this.controlloDate(this.schedulazione);
    }

    const isValid = form.valid && !isFineBeforeInizio;
    this.isFormValid.emit(isValid);
  }

  controlloDate(schedulazione: Schedulazione): boolean {
    const schedulazioneCopy: Schedulazione = JSON.parse(JSON.stringify(schedulazione));
    const inizio = schedulazioneCopy.inizio;
    const fine = schedulazioneCopy.fine;
    const isFineBeforeInzio = Utils.isBefore(fine, inizio);
    const ret = this.funzione === FunzioneGestioneEnum.DETTAGLIO ? false : isFineBeforeInzio;
    return ret;
  }

  // funzioni calendar
  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  setMinDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').add(1, 'day').format('DD/MM/YYYY') : this.minDateDDMMYYYY;
  }

  setMaxDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').subtract(1, 'day').format('DD/MM/YYYY') : null;
  }
}
