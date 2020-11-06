import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Beneficiario} from '../../../../../model/ente/Beneficiario';
import {BeneficiarioSingolo} from '../../../../../model/ente/BeneficiarioSingolo';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ContoCorrenteSingolo} from '../../../../../model/ente/ContoCorrenteSingolo';
import {NgForm, NgModel} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-conto-corrente',
  templateUrl: './dati-conto-corrente.component.html',
  styleUrls: ['./dati-conto-corrente.component.scss']
})
export class DatiContoCorrenteComponent implements OnInit, AfterViewInit {

  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  testoTooltipIconaElimina = 'Elimina dati conto corrente';

  // calendar
  isCalendarOpen = false;
  // todo verificare data attivazione minima
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  @Input() indexDatiContoCorrente: number;
  @Input() datiContoCorrente: ContoCorrente;
  @Input() funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiContoCorrente: EventEmitter<ContoCorrenteSingolo> = new EventEmitter<ContoCorrenteSingolo>();
  @Output()
  onDeleteDatiContoCorrente: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // bind button collapse to new section beneficiario
    const collapseButton = document.getElementById('buttonCCCollapse' + this.indexDatiContoCorrente.toString());
    collapseButton.dataset.target = '#collapseCC' + this.indexDatiContoCorrente;
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiContoCorrente.emit(this.indexDatiContoCorrente);
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
    this.onChangeDatiContoCorrente.emit(this.setContoCorrenteSingolo());
  }

  setContoCorrenteSingolo(): ContoCorrenteSingolo {
    const contoCorrenteSingolo: ContoCorrenteSingolo = new ContoCorrenteSingolo();
    contoCorrenteSingolo.index = this.indexDatiContoCorrente;
    contoCorrenteSingolo.contoCorrente = this.datiContoCorrente;
    return contoCorrenteSingolo;
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
}
