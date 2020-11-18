import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Statistica} from '../../../../model/statistica/Statistica';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {Destinatario} from '../../../../model/statistica/Destinatario';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {Utils} from '../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-attivita-pianificate',
  templateUrl: './dati-attivita-pianificate.component.html',
  styleUrls: ['./dati-attivita-pianificate.component.scss']
})
export class DatiAttivitaPianificateComponent implements OnInit {
  constructor() {
  }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  emailRegex: string = Utils.EMAIL_REGEX;

  @Input()
  idFunzione;
  @Input()
  datiStatistica: Statistica;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSchedulazioneFormValid: boolean;

  ngOnInit(): void {
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
      this.datiStatistica[campo.name] = null;
    }

    this.formsValid(form, this.isSchedulazioneFormValid);
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

  schedulazioneFormValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    this.isSchedulazioneFormValid = isSchedulazioneFormValid;
    this.formsValid(form, this.isSchedulazioneFormValid);
  }

  formsValid(form: NgForm, isSchedulazioneFormValid: boolean) {
    const isValid = form.valid && isSchedulazioneFormValid;
    this.isFormValid.emit(isValid);
  }

}
