import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {PermessoCompleto} from '../../model/permesso/PermessoCompleto';
import {NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../enums/tipoCampo.enum';
import {OpzioneSelect} from '../../model/OpzioneSelect';
import {FunzioneService} from '../../../../services/funzione.service';
import {map} from 'rxjs/operators';
import {GruppoEnum} from '../../../../enums/gruppo.enum';

@Component({
  selector: 'app-dati-permesso',
  templateUrl: './dati-permesso.component.html',
  styleUrls: ['./dati-permesso.component.scss']
})
export class DatiPermessoComponent implements OnInit {

  @Input() indexSezionePermesso: number;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.Moment;

  datiPermesso: PermessoCompleto;

  listaSocieta: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioni: Array<any> = [];

  @Output()
  onChangeDatiPermesso: EventEmitter<PermessoCompleto> = new EventEmitter<PermessoCompleto>();

  @Output()
  onDeletePermesso: EventEmitter<any> = new EventEmitter<any>();

  constructor(private funzioneService: FunzioneService) { }

  ngOnInit(): void {
    this.datiPermesso = new PermessoCompleto();

    // TODO liste Società, Ente relative all'utente amministratore inserito/modificato mockate temporaneamente in attesa di informazioni su come recuperarle
    this.listaSocieta = [
      {value: 1, label: 'Lepida ScpA'},
      {value: 2, label: 'Societa di prova'}
    ];
    this.listaEnti = [
      {value: 1, label: 'Comune di Bologna'},
      {value: 2, label: 'Tutto'}
    ];

    // prevalorizzo il campo societaId con la società avente id minore nella lista recuperata
    this.datiPermesso.societaId = this.listaSocieta.reduce((prev, curr) => prev.value < curr.value ? prev : curr).value;
    this.datiPermesso.enteId = null;
    this.datiPermesso.dataInizioValidita = moment();
  }

  selezionaServizio(): void {
    this.datiPermesso.servizioId = null;

    // TODO lista Servizio relativa all'utente amministratore inserito/modificato mockata temporaneamente in attesa di informazioni su come recuperarla
    this.listaServizi = [
      {value: 7, label: 'Multe per il comune di Bologna'},
      {value: 8, label: 'Tutto'}
    ];

    this.letturaFunzioniGestioneUtente();
  }

  letturaFunzioniGestioneUtente(): void {
    this.funzioneService.letturaFunzioni().pipe(map(funzioniAbilitate => {
      funzioniAbilitate.forEach(funzione => {
        if (GruppoEnum.GESTIONE === funzione.gruppo) {
          this.listaFunzioni.push({
            value: funzione,
            label: funzione.nome
          });
        }
      });
    })).subscribe();
  }

  setListaFunzioniPerServizio(): void {
    this.listaFunzioni = this.listaFunzioni.filter(funzione => funzione.value.applicabileAServizio === this.datiPermesso.servizioId);
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

  onClickDeleteIcon(event) {
    this.onDeletePermesso.emit(event.currentTarget.id);
  }

}
