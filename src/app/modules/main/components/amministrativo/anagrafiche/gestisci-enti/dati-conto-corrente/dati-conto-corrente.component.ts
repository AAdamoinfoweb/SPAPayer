import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ContoCorrenteSingolo} from '../../../../../model/ente/ContoCorrenteSingolo';
import {NgForm, NgModel} from '@angular/forms';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {Utils} from '../../../../../../../utils/Utils';
import {EnteService} from '../../../../../../../services/ente.service';

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

  @Input() indexDatiContoCorrente: number;
  @Input() datiContoCorrente: ContoCorrente;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onChangeDatiContoCorrente: EventEmitter<ContoCorrenteSingolo> = new EventEmitter<ContoCorrenteSingolo>();
  @Output()
  onDeleteDatiContoCorrente: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // calendar
  isCalendarOpen = false;
  // todo verificare data attivazione minima
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  // modal
  display = false;

  // table
  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'iban', header: 'Iban', type: tipoColonna.TESTO},
      {field: 'intestazione', header: 'Intestazione', type: tipoColonna.TESTO},
      {field: 'ibanCCPostale', header: 'Iban cc postale', type: tipoColonna.TESTO},
      {field: 'intestazioneCCPostale', header: 'Intestazione cc postale', type: tipoColonna.TESTO},
      {field: 'attivazione', header: 'Attivazione', type: tipoColonna.TESTO},
      {field: 'scadenza', header: 'Scadenza', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.TEMPLATING
  };

  constructor(private enteService: EnteService) {
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
    if (this.listaContiCorrente != null) {
      this.impostaTabellaContiCorrente();
    }
    let isFormValid: boolean;
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }
    this.onChangeDatiContoCorrente.emit(this.setContoCorrenteSingolo(isFormValid));
  }

  private impostaTabellaContiCorrente() {
    const rows = [];
    this.listaContiCorrente.forEach((contoCorrente) => {
      const row = {
        id: {value: contoCorrente.id},
        iban: {value: contoCorrente.iban},
        intestazione: {value: contoCorrente.intestazione},
        ibanCCPostale: {value: contoCorrente.ibanCCPostale},
        intestazioneCCPostale: {value: contoCorrente.intestazioneCCPostale},
        attivazione: {
          value: contoCorrente.inizioValidita != null ?
            moment(contoCorrente.inizioValidita, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
              .format(Utils.FORMAT_DATE_CALENDAR) : null
        },
        scadenza: {
          value: contoCorrente.fineValidita != null ?
            moment(contoCorrente.fineValidita, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
              .format(Utils.FORMAT_DATE_CALENDAR) : null
        },
      };
      rows.push(row);
    });
    this.tableData.rows = rows;
  }

  onClickDeleteIcon(event) {
    this.onDeleteDatiContoCorrente.emit(this.indexDatiContoCorrente);
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      if (campo.name === 'fineValidita') {
        return 'Data scadenza antecedente a data attivazione';
      } else {
        return 'Campo non valido';
      }

    }
  }

  isCampoInvalido(campo: NgModel) {
    if (campo?.name === 'fineValidita') {
      return campo?.errors != null || this.controlloDate(this.datiContoCorrente);
    } else {
      return campo?.errors != null;
    }
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiContoCorrente[campo.name] = null;
    }
    this.onChangeDatiContoCorrente.emit(this.setContoCorrenteSingolo(this.controlloForm(form, this.datiContoCorrente)));
  }

  setContoCorrenteSingolo(isFormValid: boolean): ContoCorrenteSingolo {
    const contoCorrenteSingolo: ContoCorrenteSingolo = new ContoCorrenteSingolo();
    contoCorrenteSingolo.index = this.indexDatiContoCorrente;
    contoCorrenteSingolo.contoCorrente = this.datiContoCorrente;
    contoCorrenteSingolo.isFormValid = isFormValid;
    return contoCorrenteSingolo;
  }

  controlloForm(form: NgForm, contoCorrente: ContoCorrente): boolean {
    let ret = false;
    if (contoCorrente.fineValidita != null) {
      ret = this.controlloDate(contoCorrente);
    }
    return form.valid && !ret;
  }

  controlloDate(contoCorrente: ContoCorrente): boolean {
    const dataAttivazione = contoCorrente.inizioValidita;
    const dataScadenza = contoCorrente.fineValidita;
    const dataSistema = moment().format(Utils.FORMAT_DATE_CALENDAR);
    const isDataScadenzaBeforeDataAttivazione = Utils.isBefore(dataScadenza, dataAttivazione);
    const ret = this.funzione === FunzioneGestioneEnum.DETTAGLIO ? false : isDataScadenzaBeforeDataAttivazione;
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

  showDialog() {
    this.display = !this.display;
  }

  onClickRow(row: any) {
    this.datiContoCorrente.iban = row.iban.value;
    this.datiContoCorrente.intestazione = row.intestazione.value;
    this.datiContoCorrente.ibanCCPostale = row.ibanCCPostale.value;
    this.datiContoCorrente.intestazioneCCPostale = row.intestazioneCCPostale.value;
    this.datiContoCorrente.inizioValidita = row.attivazione.value;
    this.datiContoCorrente.fineValidita = row.scadenza.value;
    this.onChangeDatiContoCorrente.emit(this.setContoCorrenteSingolo(true));
    this.display = false;
  }
}
