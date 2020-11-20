import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {ComponenteDinamico} from '../../../../../model/ComponenteDinamico';

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


  // calendar
  isCalendarOpen = false;
  // todo verificare data attivazione minima
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;


  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCCCollapse' + this.indexDatiContoCorrente.toString());
    collapseButton.dataset.target = '#collapseCC' + this.indexDatiContoCorrente;
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

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiContoCorrente[campo.name] = null;
    }
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(this.controlloForm(form)));
  }

  setComponenteDinamico(isFormValid?: boolean): ComponenteDinamico {
    const contoCorrente = JSON.parse(JSON.stringify(this.datiContoCorrente));
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
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(true));
  }
}
