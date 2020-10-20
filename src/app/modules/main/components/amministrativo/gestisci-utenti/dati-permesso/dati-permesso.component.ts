import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {PermessoCompleto} from '../../../../model/permesso/PermessoCompleto';
import {FormGroup, NgForm, NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {FunzioneService} from '../../../../../../services/funzione.service';
import {map} from 'rxjs/operators';
import {GruppoEnum} from '../../../../../../enums/gruppo.enum';
import {Utils} from '../../../../../../utils/Utils';
import {PermessoSingolo} from "../../../../model/permesso/PermessoSingolo";
import {CheckboxChange} from "design-angular-kit";
import {Funzione} from "../../../../model/Funzione";
import {PermessoFunzione} from "../../../../model/permesso/PermessoFunzione";

@Component({
  selector: 'app-dati-permesso',
  templateUrl: './dati-permesso.component.html',
  styleUrls: ['./dati-permesso.component.scss']
})


export class DatiPermessoComponent implements OnInit {

  @Input() indexSezionePermesso: number;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = 'DD/MM/YYYY';
  readonly tipoData = ECalendarValue.String;

  datiPermesso: PermessoCompleto;
  listaPermessoFunzione: PermessoFunzione[] = [];
  mapPermessoFunzione: Map<number, PermessoFunzione> = new Map()

  listaSocieta: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioni: Array<any> = [];

  @Output()
  onChangeDatiPermesso: EventEmitter<PermessoSingolo> = new EventEmitter<PermessoSingolo>();

  @Output()
  onDeletePermesso: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('datiPermessoForm') datiPermessoForm: NgForm;


  constructor(private funzioneService: FunzioneService) {
  }


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
    this.datiPermesso.dataInizioValidita = moment().format(Utils.FORMAT_DATE_CALENDAR);
  }

  selezionaServizio(): void {
    this.datiPermesso.servizioId = null;
    this.listaFunzioni = [];

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
        if (GruppoEnum.GESTIONE === funzione.gruppo && funzione.applicabileAServizio === 1) {
          this.listaFunzioni.push({
            value: funzione,
            label: funzione.nome
          });
        }
      });
    })).subscribe();
  }

  isSelectValida(valoreCampo: number, listaOpzioniSelect: Array<OpzioneSelect>): boolean {
    return valoreCampo !== null && valoreCampo !== listaOpzioniSelect[listaOpzioniSelect.length - 1]?.value;
  }

  getNomeEnte(enteId: number): string {
    return this.listaEnti.filter(ente => ente.value === enteId)[0].label;
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
    }
    return campo?.errors;
  }

  controlloDate(campo: NgModel, value: string): boolean {
    const dataDaControllare = value;
    const dataSistema = moment().format(Utils.FORMAT_DATE_CALENDAR);
    const ret = Utils.isBefore(dataDaControllare, dataSistema) ||
      campo?.errors != null;
    return ret;
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
    this.onDeletePermesso.emit(this.indexSezionePermesso);
  }

  onChangeModel(campo: NgModel) {
    if (campo?.name === 'enteId') {
      this.selezionaServizio();
    }
    const permesso: PermessoSingolo = this.setPermessoSingolo();
    this.onChangeDatiPermesso.emit(permesso);
  }

  onChangeCheckBox($event: CheckboxChange, funzione: Funzione) {
    if (this.mapPermessoFunzione.has(funzione.id) && $event.checked === false) {
        this.mapPermessoFunzione.delete(funzione.id);
    } else if ($event.checked === true) {
      const permessoFunzione: PermessoFunzione = new PermessoFunzione();
      permessoFunzione.funzioneId = funzione.id;
      permessoFunzione.permessoCancellato = false;
      this.mapPermessoFunzione.set(funzione.id, permessoFunzione);
    }
    const permesso: PermessoSingolo = this.setPermessoSingolo();
    this.onChangeDatiPermesso.emit(permesso);
  }

  private setPermessoSingolo(): PermessoSingolo {
    const permesso = new PermessoSingolo();
    permesso.index = this.indexSezionePermesso;
    this.listaPermessoFunzione = Array.from(this.mapPermessoFunzione, ([name, value]) => value);
    this.datiPermesso.listaFunzioni = this.listaPermessoFunzione;
    permesso.permessoCompleto = this.datiPermesso;
    return permesso;
  }
}
