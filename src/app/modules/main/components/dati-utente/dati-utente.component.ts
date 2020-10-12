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

  @ViewChild('aggiungiUtenteForm') form: NgForm;

  datiUtente: InserimentoModificaUtente;

  @Output()
  onChangeDatiUtente: EventEmitter<InserimentoModificaUtente> = new EventEmitter<InserimentoModificaUtente>();

  constructor(private utenteService: UtenteService) { }

  ngOnInit(): void {
    this.datiUtente = new InserimentoModificaUtente();
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
    let model = {...this.datiUtente};
    model.codiceFiscale = null;
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

  modificaModel(nomeCampo: string, valoreCampo: any): void {
    let model = {...this.datiUtente};
    if (this.form.valid) {
      if (nomeCampo === 'codiceFiscale') {
        this.codiceFiscaleExists = this.listaCodiciFiscali.includes(valoreCampo);
        model.codiceFiscale = this.codiceFiscaleExists ? null : valoreCampo;
      } else {
        model[nomeCampo] = valoreCampo;
      }
    } else {
      model = null;
    }
    this.onChangeDatiUtente.emit(model);
  }

}
