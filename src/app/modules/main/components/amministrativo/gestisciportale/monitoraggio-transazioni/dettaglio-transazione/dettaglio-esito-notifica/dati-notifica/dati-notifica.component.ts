import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EsitoNotifica} from '../../../../../../../model/transazione/EsitoNotifica';
import {ToolEnum} from '../../../../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../../../enums/TipoTabella.enum';
import {EsitoTransazione} from '../../../../../../../model/transazione/EsitoTransazione';
import * as moment from 'moment';
import {GestisciPortaleService} from '../../../../../../../../../services/gestisci-portale.service';
import {ActivatedRoute} from '@angular/router';
import {Utils} from '../../../../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-notifica',
  templateUrl: './dati-notifica.component.html',
  styleUrls: ['./dati-notifica.component.scss']
})
export class DatiNotificaComponent implements OnInit, OnChanges {

  @Input() datiNotifica: EsitoNotifica;

  @Input() idFunzione: string;

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
    dataKey: 'notificaId.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  righeSelezionate: any[];

  constructor(private activatedRoute: ActivatedRoute, private gestisciPortaleService: GestisciPortaleService) {
  }

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
      notificaId: {value: esitoTransazione.notificaId},
      numeroTentativi: {value: esitoTransazione.numeroTentativi},
      data: {value: esitoTransazione.data ? moment(esitoTransazione.data).format('DD/MM/YYYY HH:mm:ss') : null},
      esito: {value: esitoTransazione.esitoNome}
    };
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    if (azioneTool === ToolEnum.PRINT_COMMIT_MSG) {
      let listaNotificaIdSelezionati = [];
      if (this.righeSelezionate) {
        if (this.righeSelezionate.length === 0) {
          const tableTemp = JSON.parse(JSON.stringify(this.tableData));
          listaNotificaIdSelezionati = tableTemp.rows.map(riga => riga.notificaId.value);
        } else {
          listaNotificaIdSelezionati = this.righeSelezionate.map(riga => riga.notificaId.value);
        }
      }
      this.stampaCommitMsgInTxtFile(listaNotificaIdSelezionati);
    }
  }

  stampaCommitMsgInTxtFile(listaNotificaIdSelezionati: Array<number>): void {
    const transazioneId = parseInt(this.activatedRoute.snapshot.paramMap.get('transazioneId'));
    this.gestisciPortaleService.stampaCommitMsg(transazioneId, listaNotificaIdSelezionati, this.idFunzione).subscribe(listaCommitMsg => {
      listaCommitMsg.forEach((commitMsg, index) => {
        Utils.downloadBase64ToTxtFile(commitMsg, 'commit_msg' + index);
      });
    });
  }

  getNumeroRecord(): string {
    return 'Totale ' + this.tableData.rows.length + ' esiti transazione';
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

}
