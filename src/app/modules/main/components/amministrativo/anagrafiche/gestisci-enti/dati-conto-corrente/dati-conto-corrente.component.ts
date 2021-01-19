import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {FormControl, NgForm, NgModel, ValidatorFn} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {ComponenteDinamico} from '../../../../../model/ComponenteDinamico';
import {TipoCampoEnum} from "../../../../../../../enums/tipoCampo.enum";
import {FlussoRiversamentoPagoPA} from "../../../../../model/servizio/FlussoRiversamentoPagoPA";

@Component({
  selector: 'app-dati-conto-corrente',
  templateUrl: './dati-conto-corrente.component.html',
  styleUrls: ['./dati-conto-corrente.component.scss']
})
export class DatiContoCorrenteComponent implements OnInit, AfterViewInit {

  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina dati conto corrente';
  ibanRegex = Utils.IBAN_ITALIA_REGEX;

  @Input() uuid: string;
  @Input() indexDatiContoCorrente: number;
  @Input() datiContoCorrente: ContoCorrente;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onChangeDatiContoCorrente: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();
  @Output()
  onDeleteDatiContoCorrente: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();

  flussoRiversamentoPagoPA = new FlussoRiversamentoPagoPA();

  TipoCampoEnum = TipoCampoEnum;

  // calendar
  isCalendarOpen = false;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  contoSelezionato = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.datiContoCorrente.flussoRiversamentoPagoPA)
      this.flussoRiversamentoPagoPA = this.datiContoCorrente.flussoRiversamentoPagoPA;
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCCCollapse' + this.uuid.toString());
    collapseButton.dataset.target = '#collapseCC' + this.uuid;
    this.inizializzaDatiContoCorrente();
  }

  private inizializzaDatiContoCorrente() {
    let isFormValid: boolean;
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(isFormValid));
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiContoCorrente.emit(this.setComponenteDinamico());
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  onChangeModelFlusso(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.flussoRiversamentoPagoPA[campo.name] = null;
    } else
      this.flussoRiversamentoPagoPA[campo.name] = campo.value;
    this.datiContoCorrente.flussoRiversamentoPagoPA = this.flussoRiversamentoPagoPA;
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(this.controlloForm(form)));
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiContoCorrente[campo.name] = null;
    }
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(this.controlloForm(form)));
  }

  setComponenteDinamico(isFormValid?: boolean): ComponenteDinamico {
    const replacer = (key, value) =>
      typeof value === 'undefined' ? null : value;
    const contoCorrente = JSON.parse(JSON.stringify(this.datiContoCorrente, replacer));
    const componenteDinamico: ComponenteDinamico =
      new ComponenteDinamico(this.uuid, this.indexDatiContoCorrente, contoCorrente, isFormValid);
    return componenteDinamico;
  }

  controlloForm(form: NgForm): boolean {
    return form.valid;
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

  onClickRow(contoCorrente: ContoCorrente) {
    this.datiContoCorrente.iban = contoCorrente.iban;
    this.datiContoCorrente.intestazione = contoCorrente.intestazione;
    this.datiContoCorrente.ibanCCPostale = contoCorrente.ibanCCPostale;
    this.datiContoCorrente.intestazioneCCPostale = contoCorrente.intestazioneCCPostale;
    this.datiContoCorrente.inizioValidita = contoCorrente.inizioValidita;
    this.datiContoCorrente.fineValidita = contoCorrente.fineValidita;
    this.flussoRiversamentoPagoPA = contoCorrente.flussoRiversamentoPagoPA;
    this.contoSelezionato = true;
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(true));
  }

  campiDisabiitati(campo?: NgModel) {
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI && campo?.value != null &&
      this.datiContoCorrente.id && !this.contoSelezionato) {
      return true;
    } else {
      return false;
    }
  }

  disabilitaSelezionaCC() {
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI &&
      this.datiContoCorrente.id && !this.contoSelezionato) {
      return false;
    } else {
      return true;
    }
  }

  isCampoInvalido(campo: NgModel | FormControl) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel | FormControl, tipoCampo: TipoCampoEnum): string {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return null;
    } else if (campo instanceof NgModel && campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'Seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'Inserisci testo';
        case TipoCampoEnum.DATEDDMMYY:
          return 'Inserisci data';
      }
    }
  }

  getPlaceholderRequired(label: string, required: boolean) {
    if (required) {
      return label + ' *';
    }
    return label;
  }

  disabilitaCampi() {
    return this.funzione == FunzioneGestioneEnum.DETTAGLIO;
  }

  changeEmailFlussoPagoPA(form: NgForm, event: boolean) {
    if (!this.datiContoCorrente.flussoRiversamentoPagoPA)
      this.datiContoCorrente.flussoRiversamentoPagoPA = new FlussoRiversamentoPagoPA();
    this.datiContoCorrente.flussoRiversamentoPagoPA.flagNotificaEmail = event;
    let res = !event || (event && this.datiContoCorrente.flussoRiversamentoPagoPA.email != null);
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(res));
  }

  changeFtpFlussoPagoPA(form: NgForm, event: boolean) {
    if (!this.datiContoCorrente.flussoRiversamentoPagoPA)
      this.datiContoCorrente.flussoRiversamentoPagoPA = new FlussoRiversamentoPagoPA();
    this.datiContoCorrente.flussoRiversamentoPagoPA.flagNotificaFtp = event;
    let res = !event || (event && this.datiContoCorrente.flussoRiversamentoPagoPA.server != null &&
      this.datiContoCorrente.flussoRiversamentoPagoPA.username != null && this.datiContoCorrente.flussoRiversamentoPagoPA.password != null &&
      this.datiContoCorrente.flussoRiversamentoPagoPA.directory != null);
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(res));
  }

  validateUrl() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '(http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?';
        if (!new RegExp(regex).test(control.value)) {
          return {url: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }


  validateServer() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?';
        const regexIp = '^([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})$';
        if (new RegExp(regex).test(control.value) || new RegExp(regexIp).test(control.value)) {
          return null;
        } else {
          return {url: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }

  validateEmail() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
        if (!new RegExp(regex).test(control.value)) {
          return {email: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }
}
