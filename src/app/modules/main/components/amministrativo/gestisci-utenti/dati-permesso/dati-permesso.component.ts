import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {PermessoCompleto} from '../../../../model/permesso/PermessoCompleto';
import {NgForm, NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {FunzioneService} from '../../../../../../services/funzione.service';
import {map} from 'rxjs/operators';
import {GruppoEnum} from '../../../../../../enums/gruppo.enum';
import {Utils} from '../../../../../../utils/Utils';
import {CheckboxChange} from 'design-angular-kit';
import {Funzione} from '../../../../model/Funzione';
import {PermessoFunzione} from '../../../../model/permesso/PermessoFunzione';
import {SocietaService} from '../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Societa} from '../../../../model/Societa';
import {NuovoPagamentoService} from '../../../../../../services/nuovo-pagamento.service';
import {Ente} from '../../../../model/Ente';
import {FiltroServizio} from '../../../../model/FiltroServizio';
import {AsyncSubject} from 'rxjs';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ComponenteDinamico} from '../../../../model/ComponenteDinamico';
import * as _ from 'lodash';

@Component({
  selector: 'app-dati-permesso',
  templateUrl: './dati-permesso.component.html',
  styleUrls: ['./dati-permesso.component.scss']
})


export class DatiPermessoComponent implements OnInit {
  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina permesso';

  @Input() indexSezionePermesso: number;
  @Input() codiceFiscale: string;
  @Input() uuid: string;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  @Input() datiPermesso: PermessoCompleto;
  @Input() idFunzione;
  @Input() funzione: FunzioneGestioneEnum;

  listaPermessoFunzione: PermessoFunzione[] = [];
  mapPermessoFunzione: Map<number, PermessoFunzione> = new Map();

  listaSocieta: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioni: Array<any> = [];
  asyncSubject: AsyncSubject<Array<any>> = new AsyncSubject<Array<any>>();

  @Output()
  onChangeDatiPermesso: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();

  @Output()
  onDeletePermesso: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();

  @ViewChild('datiPermessoForm') datiPermessoForm: NgForm;

  constructor(private funzioneService: FunzioneService, private societaService: SocietaService,
              private amministrativoService: AmministrativoService, private nuovoPagamentoService: NuovoPagamentoService) {
  }


  ngOnInit(): void {
    if (this.datiPermesso == null) {
      this.datiPermesso = new PermessoCompleto();
      // TODO liste Società, Ente relative all'utente amministratore inserito/modificato mockate temporaneamente in attesa di informazioni su come recuperarle
      this.letturaSocieta(null).subscribe();

      this.datiPermesso.enteId = undefined;
      this.datiPermesso.dataInizioValidita = moment().format(Utils.FORMAT_DATE_CALENDAR);
    } else {
      // init spinner modifica e dettaglio per lettura permessi
      this.letturaSocieta(this.datiPermesso.societaId).subscribe((value) => {
        const mapPermessoFunzioni: Map<number, PermessoFunzione> =
          new Map(this.datiPermesso.listaFunzioni.map(permessoFunzione => [permessoFunzione.funzioneId, permessoFunzione]));
        this.mapPermessoFunzione = mapPermessoFunzioni;
        this.letturaServizi(this.datiPermesso.enteId);
        this.creaFunzioni();
      });
    }
  }

  private creaFunzioni() {
    this.asyncSubject.subscribe((listaFunzioni) => {
      this.listaFunzioni = [];
      listaFunzioni.forEach(funzione => {
        if (this.mapPermessoFunzione.has(funzione.value.id)) {
          funzione.checked = true;
        }
        this.listaFunzioni.push(funzione);
      });
      //this.onChangeDatiPermesso.emit(this.setComponenteDinamico());
    });
  }

  letturaSocieta(societaId: number) {
    return this.societaService.ricercaSocieta(societaId, this.idFunzione).pipe(map((listaSocieta: Societa[]) => {
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
    }));
  }

  letturaEnti(): void {
    this.listaEnti = [];

    this.nuovoPagamentoService.recuperaFiltroEnti(null, this.datiPermesso.societaId, null).pipe(map((listaEnti: Ente[]) => {
      listaEnti.forEach(ente => {
        const enteElement = {value: ente.id, label: ente.nome};
        this.listaEnti.push(enteElement);
      });

      this.listaEnti.push({value: null, label: 'Tutto'});
    })).subscribe();
  }

  letturaServizi(enteId: number): void {
    this.listaServizi = [];
    this.listaFunzioni = [];

    // TODO lista Servizio relativa all'utente amministratore inserito/modificato mockata temporaneamente in attesa di informazioni su come recuperarla
    if (enteId != null) {
      this.nuovoPagamentoService.recuperaFiltroServizi(enteId).pipe(map((listaServizi: FiltroServizio[]) => {
        listaServizi.forEach(servizio => {
          const servizioElement = {value: servizio.id, label: servizio.nome};
          this.listaServizi.push(servizioElement);
        });
      })).subscribe();

      this.letturaFunzioniGestioneUtente();
    }
  }

  letturaFunzioniGestioneUtente(): void {
    this.funzioneService.letturaFunzioni().pipe(map((funzioniAbilitate) => {
      funzioniAbilitate.forEach(funzione => {
        if (GruppoEnum.GESTIONE === funzione.gruppo) {
          this.listaFunzioni.push({
            value: funzione,
            label: funzione.nome,
            checked: false
          });
        }
      });
      this.asyncSubject.next(this.listaFunzioni);
      this.asyncSubject.complete();
    })).subscribe();
  }

  isSelectValida(valoreCampo: number | string, listaOpzioniSelect: Array<OpzioneSelect>): boolean {
    return valoreCampo !== undefined && valoreCampo !== listaOpzioniSelect[listaOpzioniSelect.length - 1]?.value;
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
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      this.onDeletePermesso.emit(this.setComponenteDinamico());
    } else {
      const mapPermessoFunzione: Map<number, PermessoFunzione> = new Map<number, PermessoFunzione>();
      this.mapPermessoFunzione.forEach((permessoFunzione: PermessoFunzione, key: number) => {
        permessoFunzione.permessoCancellato = true;
        mapPermessoFunzione.set(key, permessoFunzione);
      });
      this.mapPermessoFunzione = mapPermessoFunzione;
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico());
      this.onDeletePermesso.emit(this.setComponenteDinamico());
    }
  }

  onChangeModel(campo: NgModel) {
    if (campo?.name === 'societaId') {
      this.datiPermesso.enteId = undefined;
      this.letturaEnti();
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico(campo));
    } else if (campo?.name === 'enteId') {
      if (campo.value == null) {
        this.mapPermessoFunzione = new Map<number, PermessoFunzione>();
      }
      this.datiPermesso.servizioId = null;
      this.letturaServizi(campo.value);
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico(campo));
      this.datiPermesso.enteId = campo.value;
    } else if (campo?.name === 'servizioId') {
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico(campo));
      this.datiPermesso.servizioId = campo.value;
    } else if (campo?.name === 'dataInizioValidita') {
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico(campo));
      this.datiPermesso.dataInizioValidita = campo.value;
    } else if (campo?.name === 'dataFineValidita') {
      this.onChangeDatiPermesso.emit(this.setComponenteDinamico(campo));
      this.datiPermesso.dataFineValidita = campo.value;
    }
  }

  onChangeCheckBox($event: CheckboxChange, funzione: Funzione) {
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      if (this.mapPermessoFunzione.has(funzione.id) && $event.checked === false) {
        this.mapPermessoFunzione.delete(funzione.id);
      } else if ($event.checked === true) {
        // inserimento NUOVO permesso
        const permessoFunzione: PermessoFunzione = new PermessoFunzione();
        permessoFunzione.permessoId = null;
        permessoFunzione.funzioneId = funzione.id;
        permessoFunzione.permessoCancellato = false;
        permessoFunzione.nomeFunzione = funzione.nome;
        this.mapPermessoFunzione.set(funzione.id, permessoFunzione);
      }
    } else {
      // modifica NUOVO permesso
      if (this.mapPermessoFunzione.has(funzione.id) && $event.checked === false) {
        const permessoFunzione: PermessoFunzione = this.mapPermessoFunzione.get(funzione.id);
        permessoFunzione.permessoCancellato = true;
        this.mapPermessoFunzione.set(funzione.id, permessoFunzione);
      } else if (this.mapPermessoFunzione.has(funzione.id) && $event.checked === true) {
        const permessoFunzione: PermessoFunzione = this.mapPermessoFunzione.get(funzione.id);
        permessoFunzione.permessoCancellato = false;
        this.mapPermessoFunzione.set(funzione.id, permessoFunzione);
      } else if ($event.checked === true) {
        // inserimento NUOVO permesso
        const permessoFunzione: PermessoFunzione = new PermessoFunzione();
        permessoFunzione.permessoId = null;
        permessoFunzione.funzioneId = funzione.id;
        permessoFunzione.permessoCancellato = false;
        permessoFunzione.nomeFunzione = funzione.nome;
        this.mapPermessoFunzione.set(funzione.id, permessoFunzione);
      }
    }

    this.onChangeDatiPermesso.emit(this.setComponenteDinamico());
  }

  private setComponenteDinamico(campo?: NgModel): ComponenteDinamico {
    this.listaPermessoFunzione = Array.from(this.mapPermessoFunzione, ([name, value]) => value);
    let dati = _.cloneDeep(this.datiPermesso);
    if (campo)
      dati[campo.name] = campo.value;
    let permessoCompleto = new PermessoCompleto();
    permessoCompleto = JSON.parse(JSON.stringify(dati));
    permessoCompleto.listaFunzioni = this.listaPermessoFunzione;
    return new ComponenteDinamico(this.uuid, this.indexSezionePermesso, permessoCompleto);
  }

  disabilitaCheckboxFunzione(funzione, campo: NgModel) {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO ||
      (funzione.value.nome !== 'quadratura' && funzione.value.nome !== 'iuv senza bonifico' && campo.value == null)) {
      funzione.checked = false;
      return true;
    } else {
      return false;
    }
  }
}
