import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Rendicontazione} from '../../../../../model/rendicontazione/Rendicontazione';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {TransazioneFlusso} from '../../../../../model/transazione/TransazioneFlusso';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {ToolEnum} from '../../../../../../../enums/Tool.enum';
import {GestisciElementoComponent} from '../../../gestisci-elemento.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {Observable} from 'rxjs';
import {Colonna} from '../../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../../model/tabella/ImmaginePdf';
import {GestisciPortaleService} from '../../../../../../../services/gestisci-portale.service';

@Component({
  selector: 'app-dati-rendicontazione',
  templateUrl: './dati-rendicontazione.component.html',
  styleUrls: ['./dati-rendicontazione.component.scss']
})
export class DatiRendicontazioneComponent extends GestisciElementoComponent implements OnInit, OnChanges {

  filtriRicerca: any;
  righeSelezionate: any[];

  @Input() datiRendicontazione: Rendicontazione;

  id = null;
  societa = null;
  ente = null;
  servizio = null;
  listaTransazioniFlusso = [];

  toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'},
    {type: ToolEnum.PRINT_RT, tooltip: 'Stampa RT (Ricevuta Telematica)'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'dataTransazione', header: 'Data transazione', type: tipoColonna.TESTO},
      {field: 'id', header: 'ID transazione', type: tipoColonna.TESTO},
      {field: 'pagatore', header: 'Pagatore (Cod. Fiscale)', type: tipoColonna.TESTO},
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'importoNetto', header: 'Importo netto', type: tipoColonna.IMPORTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private gestisciPortaleService: GestisciPortaleService) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiRendicontazione) {
      this.id = this.datiRendicontazione.id;
      this.societa = this.datiRendicontazione.societa;
      this.ente = this.datiRendicontazione.ente;
      this.servizio = this.datiRendicontazione.servizio;
      this.listaTransazioniFlusso = this.datiRendicontazione.listaTransazioniFlusso;
      this.impostaTabella(this.listaTransazioniFlusso);
    }
  }

  creaRigaTabella(transazioneFlusso: TransazioneFlusso) {
    return {
      dataTransazione: {value: transazioneFlusso.dataTransazione
          ? moment(transazioneFlusso.dataTransazione).format(Utils.FORMAT_DATE_CALENDAR) : null},
      id: {value: transazioneFlusso.idTransazione.toString()},
      pagatore: {value: transazioneFlusso.pagatore},
      iuv: {value: transazioneFlusso.iuv},
      importoNetto: {value: transazioneFlusso.importoNetto}
    };
  }

  callbackPopolaLista() {
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Transazioni');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Transazioni');
        break;
      case ToolEnum.PRINT_RT:
        this.stampaRicevutaTelematicaInTxtFile(this.getListaIdElementiSelezionati());
        break;
    }
  }

  // @ts-ignore
  getObservableFunzioneRicerca(): Observable<any> {
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      const rigaFormattata = riga;
      rigaFormattata.dataTransazione = riga.dataTransazione.value;
      rigaFormattata.id = riga.id.value;
      rigaFormattata.pagatore = riga.pagatore.value;
      rigaFormattata.iuv = riga.iuv.value;
      rigaFormattata.importoNetto = riga.importoNetto.value;
      return rigaFormattata;
    });
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    return [];
  }

  stampaRicevutaTelematicaInTxtFile(listaTransazioneId: Array<number>): void {
    if (listaTransazioneId.length === 0) {
      const tableTemp = JSON.parse(JSON.stringify(this.tableData));
      listaTransazioneId = tableTemp.rows.map(riga => riga.id.value);
    }
    this.gestisciPortaleService.stampaRT(null, listaTransazioneId, this.idFunzione).subscribe(listaRT => {
      listaRT.forEach((rt, index) => {
        Utils.downloadBase64ToTxtFile(rt, 'rt' + index);
      });
    });
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' transazioni';
  }

  // TODO collegare link Monitoraggio Transazioni alla componente ancora in fase di sviluppo

}
