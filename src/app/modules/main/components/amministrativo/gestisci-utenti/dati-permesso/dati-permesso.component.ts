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
import {PermessoSingolo} from '../../../../model/permesso/PermessoSingolo';
import {CheckboxChange} from 'design-angular-kit';
import {Funzione} from '../../../../model/Funzione';
import {PermessoFunzione} from '../../../../model/permesso/PermessoFunzione';
import {SocietaService} from '../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Societa} from '../../../../model/Societa';
import {NuovoPagamentoService} from '../../../../../../services/nuovo-pagamento.service';
import {Ente} from '../../../../model/Ente';
import {FiltroServizio} from '../../../../model/FiltroServizio';

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
  mapPermessoFunzione: Map<number, PermessoFunzione> = new Map();

  listaSocieta: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioni: Array<any> = [];

  @Output()
  onChangeDatiPermesso: EventEmitter<PermessoSingolo> = new EventEmitter<PermessoSingolo>();

  @Output()
  onDeletePermesso: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('datiPermessoForm') datiPermessoForm: NgForm;


  constructor(private funzioneService: FunzioneService, private societaService: SocietaService,
              private amministrativoService: AmministrativoService, private nuovoPagamentoService: NuovoPagamentoService) {
  }


  ngOnInit(): void {
    this.datiPermesso = new PermessoCompleto();

    // TODO liste Società, Ente relative all'utente amministratore inserito/modificato mockate temporaneamente in attesa di informazioni su come recuperarle
    this.societaService.ricercaSocieta(null, this.amministrativoService.idFunzione).pipe(map((listaSocieta: Societa[]) => {
      listaSocieta.forEach(societa => {
        const societaElement = {value: societa.id, label: societa.nome};
        this.listaSocieta.push(societaElement);
      });
      // prevalorizzo il campo societaId con la società avente id minore nella lista recuperata
      if (this.listaSocieta.length > 0) {
        if (this.listaSocieta.length > 1) {
          this.datiPermesso.societaId = this.listaSocieta.reduce((prev, curr) => prev.value < curr.value ? prev : curr).value;
        } else {
          this.datiPermesso.societaId = this.listaSocieta[0].value;
        }
        this.letturaEnti();
      } else {
        this.datiPermesso.societaId = null;
      }
    })).subscribe();

    this.datiPermesso.enteId = null;
    this.datiPermesso.dataInizioValidita = moment().format(Utils.FORMAT_DATE_CALENDAR);
  }

  letturaEnti(): void {
    this.datiPermesso.enteId = undefined;
    this.listaEnti = [];

    this.nuovoPagamentoService.recuperaFiltroEnti(null, this.datiPermesso.societaId, null).pipe(map((listaEnti: Ente[]) => {
      listaEnti.forEach(ente => {
        const enteElement = {value: ente.id, label: ente.nome};
        this.listaEnti.push(enteElement);
      });

      this.listaEnti.push({value: null, label: 'Tutto'});
    })).subscribe();
  }

  letturaServizi(): void {
    this.datiPermesso.servizioId = null;
    this.listaServizi = [];
    this.listaFunzioni = [];

    // TODO lista Servizio relativa all'utente amministratore inserito/modificato mockata temporaneamente in attesa di informazioni su come recuperarla
    if(this.datiPermesso.enteId != null) {
    this.nuovoPagamentoService.recuperaFiltroServizi(this.datiPermesso.enteId).pipe(map((listaServizi: FiltroServizio[]) => {
      listaServizi.forEach(servizio => {
        const servizioElement = {value: servizio.id, label: servizio.nome};
        this.listaServizi.push(servizioElement);
      });
    })).subscribe();

    this.letturaFunzioniGestioneUtente();
    }
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

  isSelectValida(valoreCampo: number | string, listaOpzioniSelect: Array<OpzioneSelect>): boolean {
    return valoreCampo !== undefined && valoreCampo !== listaOpzioniSelect[listaOpzioniSelect.length - 1]?.value;;
  }

  getNomeEnte(enteId: number | string): string {
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
    if (campo?.name === 'societaId') {
      this.letturaEnti();
    } else if (campo?.name === 'enteId') {
      this.letturaServizi();
    }
    const permesso: PermessoSingolo = this.setPermessoSingolo();
    this.onChangeDatiPermesso.emit(permesso);
  }

  onChangeCheckBox($event: CheckboxChange, funzione: Funzione) {
    if (this.mapPermessoFunzione.has(funzione.id) && $event.checked === false) {
      this.mapPermessoFunzione.delete(funzione.id);
    } else if ($event.checked === true) {
      // inserimento NUOVO permesso
      const permessoFunzione: PermessoFunzione = new PermessoFunzione();
      permessoFunzione.permessoId = null;
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
