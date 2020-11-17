import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Statistica} from '../../../../model/statistica/Statistica';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {Destinatario} from '../../../../model/statistica/Destinatario';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {Utils} from '../../../../../../utils/Utils';
import {ContoCorrente} from "../../../../model/ente/ContoCorrente";

@Component({
  selector: 'app-dati-statistica',
  templateUrl: './dati-statistica.component.html',
  styleUrls: ['./dati-statistica.component.scss']
})
export class DatiStatisticaComponent implements OnInit {
  constructor() {
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
  idFunzione;
  @Input()
  datiStatistica: Statistica;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiStatistica: EventEmitter<Statistica> = new EventEmitter<Statistica>();


  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;
  opzioniTimeZone: OpzioneSelect[] = [];
  emailRegex: string = Utils.EMAIL_REGEX;

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
      return campo?.errors != null || this.controlloDate(this.datiStatistica);
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
      if (this.datiStatistica[campo.name]) {
        this.datiStatistica[campo.name] = null;
      } else {
        this.datiStatistica.schedulazione[campo.name] = null;
      }
    }
    let isFineBeforeInizio = false;
    if (this.datiStatistica.schedulazione.fine != null) {
      isFineBeforeInizio = this.controlloDate(this.datiStatistica);
    }
    this.onChangeDatiStatistica.emit(this.datiStatistica);
    const isValid = form.valid && !isFineBeforeInizio;
    this.isFormValid.emit(isValid);
  }

  controlloDate(statistica: Statistica): boolean {
    const statisticaCopy: Statistica = JSON.parse(JSON.stringify(statistica))
    const inizio = statisticaCopy.schedulazione.inizio;
    const fine = statisticaCopy.schedulazione.fine;
    const isFineBeforeInzio = Utils.isBefore(fine, inizio);
    const ret = this.funzione === FunzioneGestioneEnum.DETTAGLIO ? false : isFineBeforeInzio;
    return ret;
  }

  aggiungiDestinatario(form: NgForm) {
    const destinatario: Destinatario = new Destinatario();
    destinatario.email = null;
    this.datiStatistica.destinatari.push(destinatario);
    this.onChangeModel(form);
  }

  eliminaDestinatario(form: NgForm, campo: NgModel, currentIndex) {
    form.getControl(campo).patchValue(null);
    this.datiStatistica.destinatari = this.datiStatistica.destinatari
      .filter((value, index) => index !== currentIndex);
    this.onChangeModel(form);
  }

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
