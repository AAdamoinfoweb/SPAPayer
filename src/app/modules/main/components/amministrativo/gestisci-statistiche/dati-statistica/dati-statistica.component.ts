import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Statistica} from '../../../../model/statistica/Statistica';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {Destinatario} from '../../../../model/statistica/Destinatario';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';

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

  // dati
  destinatari: Map<number, string>;

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  ngOnInit(): void {
    this.destinatari = new Map<number, string>();
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

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiStatistica[campo.name] = null;
    }
    this.onChangeDatiStatistica.emit(this.datiStatistica);
    this.isFormValid.emit(form.valid);
  }

  aggiungiDestinatario() {
    const destinatario: Destinatario = new Destinatario();
    destinatario.email = null;
    this.datiStatistica.destinatari.push(destinatario);
  }

  eliminaDestinatario(currentIndex) {
    this.datiStatistica.destinatari = this.datiStatistica.destinatari
      .filter((value, index) => index !== currentIndex );
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

}
