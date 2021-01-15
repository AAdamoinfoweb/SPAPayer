import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../../enums/funzioneGestione.enum';
import {Tabella} from '../../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../../enums/TipoTabella.enum';
import {ComponenteDinamico} from '../../../../../../model/ComponenteDinamico';
import {ContoCorrente} from '../../../../../../model/ente/ContoCorrente';
import * as moment from 'moment';
import {Utils} from '../../../../../../../../utils/Utils';

@Component({
  selector: 'app-seleziona-conto-corrente',
  templateUrl: './seleziona-conto-corrente.component.html',
  styleUrls: ['./seleziona-conto-corrente.component.scss']
})
export class SelezionaContoCorrenteComponent implements OnInit, AfterViewInit, OnChanges {

  constructor() {
  }

  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  @Input() funzione: FunzioneGestioneEnum;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onClick: EventEmitter<ContoCorrente> = new EventEmitter<ContoCorrente>();

  // class var
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

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.listaContiCorrente != null) {
      this.impostaTabellaContiCorrente();
    }
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
        flussoRiversamentoPagoPA: contoCorrente.flussoRiversamentoPagoPA
      };
      rows.push(row);
    });
    this.tableData.rows = rows;
  }

  showDialog() {
    this.display = !this.display;
  }

  onClickRow(row: any) {
    const contoCorrente: ContoCorrente = new ContoCorrente();
    contoCorrente.iban = row.iban.value;
    contoCorrente.intestazione = row.intestazione.value;
    contoCorrente.ibanCCPostale = row.ibanCCPostale.value;
    contoCorrente.intestazioneCCPostale = row.intestazioneCCPostale.value;
    contoCorrente.inizioValidita = row.attivazione.value;
    contoCorrente.fineValidita = row.scadenza.value;
    contoCorrente.flussoRiversamentoPagoPA = row.flussoRiversamentoPagoPA;
    this.onClick.emit(contoCorrente);
    this.display = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listaContiCorrente != null) {
      this.impostaTabellaContiCorrente();
    }
  }
}
