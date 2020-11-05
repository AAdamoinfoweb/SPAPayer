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
import {OverlayService} from '../../../../../../services/overlay.service';

@Component({
  selector: 'app-dati-utente',
  templateUrl: './dati-utente.component.html',
  styleUrls: ['./dati-utente.component.scss']
})
export class DatiUtenteComponent implements OnInit {

  readonly minCharsToRetrieveCF = 1;
  listaCodiciFiscali: string[] = [];
  codiceFiscaleExists = false;

  readonly emailRegex = Utils.EMAIL_REGEX;
  readonly telefonoRegex = Utils.TELEFONO_REGEX;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  @ViewChild('datiUtenteForm') form: NgForm;

  @Input() codiceFiscale: string;
  datiUtente: InserimentoModificaUtente;
  isModificaUtente = false;
  @Input() isDettaglio: boolean;
  @Input() idFunzione;

  @Output()
  onChangeDatiUtente: EventEmitter<InserimentoModificaUtente> = new EventEmitter<InserimentoModificaUtente>();

  @Output()
  onValidaFormDatiUtenti: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private utenteService: UtenteService, private amministrativoService: AmministrativoService) {
  }

  ngOnInit(): void {
    this.datiUtente = new InserimentoModificaUtente();
    this.onValidaFormDatiUtenti.emit(true);

    this.utenteService.utentePermessiAsyncSubject.subscribe((value) => {
      if (value) {
        if (this.codiceFiscale) {
          this.isModificaUtente = true;
          const parametriRicerca = new ParametriRicercaUtente();
          parametriRicerca.codiceFiscale = this.codiceFiscale;
          this.ricercaUtente(parametriRicerca);
        } else {
          this.codiceFiscale = null;
          this.datiUtente.attivazione = moment().format(Utils.FORMAT_DATE_CALENDAR);
        }
      }
    });
  }

  ricercaUtente(parametriRicerca: ParametriRicercaUtente): void {
    this.utenteService.ricercaUtenti(parametriRicerca, this.idFunzione).pipe(map(utenti => {
      const utente = utenti[0];
      this.datiUtente.nome = utente?.nome;
      this.datiUtente.cognome = utente?.cognome;
      this.datiUtente.email = utente?.email;
      this.datiUtente.telefono = utente?.telefono;
      this.datiUtente.attivazione = utente?.dataInizioValidita ?
        moment(utente?.dataInizioValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
      this.datiUtente.scadenza = utente?.dataFineValidita ?
        moment(utente?.dataFineValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
    })).subscribe();
  }

  loadSuggestions(event): void {
    const inputCf = event.query;

    if (inputCf.length < this.minCharsToRetrieveCF) {
      this.listaCodiciFiscali = [];
    } else if (inputCf.length >= this.minCharsToRetrieveCF) {
      // disabilitazione bottone in attesa di caricamento utenti
      this.utenteService.codiceFiscaleEvent.emit(null);
      this.utenteService.letturaCodiceFiscale(inputCf, this.idFunzione).subscribe(data => {
        this.listaCodiciFiscali = data;
        this.listaCodiciFiscali = this.listaCodiciFiscali.filter(cf => cf.toLowerCase().indexOf(inputCf.toLowerCase()) === 0);
      });
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
    if (campo?.name === 'attivazione' || campo?.name === 'scadenza') {
      return this.controlloDate(campo, campo.model);
    } else {
      return campo?.errors != null;
    }
  }

  controlloDate(campo: NgModel, value: string): boolean {
    const dataDaControllare = value;
    const dataSistema = moment().format(Utils.FORMAT_DATE_CALENDAR);
    const ret = Utils.isBefore(dataDaControllare, dataSistema) ||
      campo?.errors != null;
    return !this.isModificaUtente ? ret : false;
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
