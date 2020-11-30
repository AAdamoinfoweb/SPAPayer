import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EsitoNotifica} from '../../../../../../../model/transazione/EsitoNotifica';
import {ToolEnum} from '../../../../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../../../enums/TipoTabella.enum';
import {EsitoTransazione} from '../../../../../../../model/transazione/EsitoTransazione';
import * as moment from 'moment';

@Component({
  selector: 'app-dati-notifica',
  templateUrl: './dati-notifica.component.html',
  styleUrls: ['./dati-notifica.component.scss']
})
export class DatiNotificaComponent implements OnInit, OnChanges {

  @Input() datiNotifica: EsitoNotifica;

  enteImpositore = null;
  esitoNotifica = null;
  listaEsitiTransazione = [];

  toolbarIcons = [
    {type: ToolEnum.PRINT_COMMIT_MSG, tooltip: 'Stampa COMMIT MSG'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'numeroTentativi', header: 'Numero tentativi', type: tipoColonna.TESTO},
      {field: 'data', header: 'Data ora', type: tipoColonna.TESTO},
      {field: 'esito', header: 'Esito', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  righeSelezionate: any[];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiNotifica) {
      this.enteImpositore = this.datiNotifica.enteImpositore;
      this.esitoNotifica = this.datiNotifica.esitoNotifica;
      this.listaEsitiTransazione = this.datiNotifica.listaEsitiTransazione;
      this.impostaTabellaEsitiTransazione(this.listaEsitiTransazione);
    }
  }

  impostaTabellaEsitiTransazione(listaEsitiTransazione: EsitoTransazione[]): void {
    this.tableData.rows = [];
    if (listaEsitiTransazione) {
      listaEsitiTransazione.forEach(esitoTransazione => {
        this.tableData.rows.push(this.creaRigaTabella(esitoTransazione));
      });
    }
  }

  creaRigaTabella(esitoTransazione: EsitoTransazione): any {
    return {
      numeroTentativi: {value: esitoTransazione.numeroTentativi},
      data: {value: esitoTransazione.data ? moment(esitoTransazione.data).format('DD/MM/YYYY HH:mm:ss') : null},
      esito: {value: esitoTransazione.esitoNome}
    };
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    // TODO implementare logica per stampa COMMIT MSG
  }

  getNumeroRecord(): string {
    return 'Totale ' + this.tableData.rows.length + ' esiti transazione';
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

}
