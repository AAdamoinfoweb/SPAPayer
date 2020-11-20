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
import {ComponenteDinamico} from "../../../../../model/ComponenteDinamico";

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
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(isFormValid));
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
    this.onChangeDatiContoCorrente.emit(this.setComponenteDinamico(true));
    this.display = false;
  }
}
