import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Schedulazione} from '../../../model/schedulazione/Schedulazione';
import {FunzioneGestioneEnum} from '../../../../../enums/funzioneGestione.enum';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {NgForm, NgModel} from '@angular/forms';
import {Utils} from '../../../../../utils/Utils';
import {HttpErrorResponse} from "@angular/common/http";
import {RegexSchedulazione} from "../../../model/schedulazione/RegexSchedulazione";
import {SchedulazioneService} from "../../../../../services/schedulazione.service";

@Component({
  selector: 'app-schedulazione',
  templateUrl: './schedulazione.component.html',
  styleUrls: ['./schedulazione.component.scss']
})
export class SchedulazioneComponent implements OnInit, OnChanges {

  constructor(private schedulazioneService: SchedulazioneService) {
  }

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
  @Input()
  idFunzione;

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;
  opzioniTimeZone: OpzioneSelect[] = [];

  regexSchedulazione: RegexSchedulazione = new RegexSchedulazione();

  ngOnInit(): void {
    this.inizializzaTimeZone();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idFunzione) {
      if (this.idFunzione) {
        this.recuperaRegexSchedulazione();
      }
    }
  }

  private inizializzaTimeZone() {
    this.opzioniTimeZone.push({
      value: Utils.TIME_ZONE,
      label: Utils.TIME_ZONE
    });
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

  onChangeModel(form: NgForm, campo?: NgModel) {
    if (campo?.value == '') {
      this.schedulazione[campo.name] = null;
    }
    this.isFormValid.emit(form.valid);
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

  private recuperaRegexSchedulazione() {
    this.schedulazioneService.regexSchedulazione(this.idFunzione).subscribe((response) => {
      if (!(response instanceof HttpErrorResponse)) {
        this.regexSchedulazione = response;
      }
    });
  }
}
