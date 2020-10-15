import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UtenteService} from '../../../../services/utente.service';
import {InserimentoModificaUtente} from '../../model/utente/InserimentoModificaUtente';
import {NgForm, NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../enums/tipoCampo.enum';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'app-dati-utente',
  templateUrl: './dati-utente.component.html',
  styleUrls: ['./dati-utente.component.scss']
})
export class DatiUtenteComponent implements OnInit {

  readonly minCharsToRetrieveCF = 1;
  listaCodiciFiscali: string[] = [];
  codiceFiscaleExists = false;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.Moment;

  @ViewChild('datiUtenteForm') form: NgForm;

  codiceFiscale: string;
  datiUtente: InserimentoModificaUtente;

  @Output()
  onChangeDatiUtente: EventEmitter<InserimentoModificaUtente> = new EventEmitter<InserimentoModificaUtente>();

  @Output()
  onValidaFormDatiUtenti: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private utenteService: UtenteService) { }

  ngOnInit(): void {
    this.codiceFiscale = null;
    this.datiUtente = new InserimentoModificaUtente();
    this.datiUtente.attivazione = moment();
  }

  loadSuggestions(event): void {
    const inputCf = event.query;

    if (inputCf.length < this.minCharsToRetrieveCF) {
      this.listaCodiciFiscali = [];
    } else if (inputCf.length === this.minCharsToRetrieveCF) {
      this.utenteService.letturaCodiceFiscale(inputCf).subscribe(data => {
        this.listaCodiciFiscali = data;
      });
    } else {
      this.listaCodiciFiscali = this.listaCodiciFiscali.filter(cf => cf.toLowerCase().indexOf(inputCf.toLowerCase()) === 0);
    }
  }

  clearAutocompleteCodiceFiscale(): void {
    this.listaCodiciFiscali = [];
    const model = {...this.datiUtente};
    this.utenteService.codiceFiscaleEvent.emit(null);
    this.onChangeDatiUtente.emit(model);
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
    return campo?.errors;
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

  onChangeModel(): void {
    let model = {...this.form.value};

    if (this.form.valid) {
      for (let nomeCampo in model) {
        if (model[nomeCampo] !== undefined && model[nomeCampo]) {
          if (nomeCampo === 'codiceFiscale') {
            this.codiceFiscaleExists = this.listaCodiciFiscali.includes(this.codiceFiscale);
            if (this.codiceFiscaleExists) {
              this.utenteService.codiceFiscaleEvent.emit(null);
            } else {
              this.utenteService.codiceFiscaleEvent.emit(this.codiceFiscale);
            }
          } else if (typeof model[nomeCampo] === 'object') {
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

}