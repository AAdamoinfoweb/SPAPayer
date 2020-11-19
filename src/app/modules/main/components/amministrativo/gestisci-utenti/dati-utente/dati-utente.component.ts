import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UtenteService} from '../../../../../../services/utente.service';
import {InserimentoModificaUtente} from '../../../../model/utente/InserimentoModificaUtente';
import {NgForm, NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {ParametriRicercaUtente} from '../../../../model/utente/ParametriRicercaUtente';
import {map} from 'rxjs/operators';
import {Utils} from '../../../../../../utils/Utils';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";

@Component({
  selector: 'app-dati-utente',
  templateUrl: './dati-utente.component.html',
  styleUrls: ['./dati-utente.component.scss']
})
export class DatiUtenteComponent implements OnInit {
  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  readonly emailRegex = Utils.EMAIL_REGEX;
  readonly telefonoRegex = Utils.TELEFONO_REGEX;
  readonly codiceFiscaleRegex = Utils.CODICE_FISCALE_REGEX;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  @ViewChild('datiUtenteForm') form: NgForm;

  @Input() codiceFiscale: string;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() idFunzione;

  @Input() datiUtente: InserimentoModificaUtente;

  @Output()
  onChangeDatiUtente: EventEmitter<InserimentoModificaUtente> = new EventEmitter<InserimentoModificaUtente>();
  @Output()
  onValidaFormDatiUtenti: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private utenteService: UtenteService) {
  }

  ngOnInit(): void {
    this.onValidaFormDatiUtenti.emit(true);
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      if (campo.errors?.required) {
        return 'Il campo è obbligatorio';
      } else {
        return 'campo non valido';
      }
    } else {
      if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      } else if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (tipo === 'email') {
        return 'inserisci indirizzo e-mail';
      } else {
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

  setMinDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').add(1, 'day').format('DD/MM/YYYY') : this.minDateDDMMYYYY;
  }

  setMaxDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').subtract(1, 'day').format('DD/MM/YYYY') : null;
  }

  onChangeForm(datiUtenteForm: NgForm) {
    const model = {...datiUtenteForm.value};

    if (datiUtenteForm.valid) {
      for (const nomeCampo in model) {
        if (model[nomeCampo] !== undefined && model[nomeCampo]) {
          if (typeof model[nomeCampo] === 'object') {
            model[nomeCampo] = moment(model[nomeCampo]).format('YYYY-MM-DD[T]HH:mm:ss');
          }
        } else {
          model[nomeCampo] = null;
        }
      }
      delete model.codiceFiscale;
      this.onChangeDatiUtente.emit(model);
      this.onValidaFormDatiUtenti.emit(true);
    } else {
      this.onValidaFormDatiUtenti.emit(false);
    }
  }

  controlloCodiceFiscale($event) {
    this.utenteService.codiceFiscaleEvent.emit($event);
  }

}
