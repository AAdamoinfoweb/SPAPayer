import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DettaglioQuadratura} from '../../../../../model/quadratura/DettaglioQuadratura';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {DettaglioTransazione} from '../../../../../model/transazione/DettaglioTransazione';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {Colonna} from '../../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../../model/tabella/ImmaginePdf';
import {ToolEnum} from '../../../../../../../enums/Tool.enum';

@Component({
  selector: 'app-dati-quadratura',
  templateUrl: './dati-quadratura.component.html',
  styleUrls: ['./dati-quadratura.component.scss']
})
export class DatiQuadraturaComponent implements OnInit, OnChanges {

  @Input() datiQuadratura: DettaglioQuadratura;

  societaId = null;
  flussoId = null;
  pspId = null;
  listaDettaglioTransazione = null;

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'dataTransazione', header: 'Data transazione', type: tipoColonna.TESTO},
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'pagatore', header: 'Pagatore (Cod. fiscale)', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'stato', header: 'Stato', type: tipoColonna.TESTO},
      {field: 'allarme', header: '', type: tipoColonna.ICONA}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.TEMPLATING
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiQuadratura) {
      this.societaId = this.datiQuadratura.societaId;
      this.flussoId = this.datiQuadratura.flussoId;
      this.pspId = this.datiQuadratura.pspId;
      this.listaDettaglioTransazione = this.datiQuadratura.listaDettaglioTransazione;
      this.impostaTabella(this.listaDettaglioTransazione);
    }
    window.scrollTo(0, 0);
  }

  impostaTabella(listaDettaglioTransazione: DettaglioTransazione[]): void {
    this.tableData.rows = [];
    if (listaDettaglioTransazione) {
      listaDettaglioTransazione.forEach(elemento => {
        this.tableData.rows.push(this.creaRigaTabella(elemento));
      });
    }
  }

  creaRigaTabella(dettaglioTransazione: DettaglioTransazione) {
    const isTransazioneScartata = dettaglioTransazione.stato === 'Scartata';

    return {
      dataTransazione: {value: dettaglioTransazione.dataTransazione
          ? moment(dettaglioTransazione.dataTransazione).format(Utils.FORMAT_DATE_CALENDAR) : null},
      iuv: {value: dettaglioTransazione.iuv},
      pagatore: {value: dettaglioTransazione.pagatoreCodiceFiscale},
      importo: {value: dettaglioTransazione.importo},
      stato: {value: dettaglioTransazione.stato},
      allarme: Utils.creaIcona('assets/img/exclamation-triangle-solid.svg#alert-icon', '#B06202',
        isTransazioneScartata ? dettaglioTransazione.motivoPagamentoScartato : null,
        isTransazioneScartata ? 'inline' : 'none', 'top'),
      id: {value: dettaglioTransazione.dettaglioTransazioneId}
    };
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Dettagli Transazione');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Dettagli Transazione');
        break;
    }
  }

  esportaTabellaInFileExcel(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const headerColonne = this.getColonneFileExcel(copiaTabella.cols).map(col => col.header);
    const righe = this.getRigheFileExcel(copiaTabella.rows);

    const fogli = {};
    fogli[nomeFile] = null;
    const workbook = {Sheets: fogli, SheetNames: []};
    Utils.creaFileExcel(righe, headerColonne, nomeFile, [nomeFile], workbook, nomeFile);
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      const rigaFormattata = riga;
      rigaFormattata.dataTransazione = riga.dataTransazione.value;
      rigaFormattata.iuv = riga.iuv.value;
      rigaFormattata.pagatore = riga.pagatore.value;
      rigaFormattata.importo = riga.importo.value;
      rigaFormattata.stato = riga.stato.value;
      delete rigaFormattata.allarme;
      delete rigaFormattata.id;

      return rigaFormattata;
    });
  }

  esportaTabellaInFilePdf(tabella: Tabella, nomeFile: string): void {
    const copiaTabella = JSON.parse(JSON.stringify(tabella));
    const colonne = this.getColonneFilePdf(copiaTabella.cols);
    const righe = this.getRigheFilePdf(copiaTabella.rows);
    let immagini = this.getImmaginiFilePdf(righe);
    if (!immagini) {
      immagini = [];
    }
    Utils.esportaTabellaInFilePdf(colonne, righe, nomeFile, immagini);
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    const iconaAllarme = new ImmaginePdf();
    iconaAllarme.indiceColonna = 5;
    iconaAllarme.srcIcona = 'assets/img/exclamation-triangle-solid-pdf-img.png';
    iconaAllarme.posizioneX = 0;
    iconaAllarme.posizioneY = 0;
    iconaAllarme.larghezza = 18;
    iconaAllarme.altezza = 18;

    return [iconaAllarme];
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' dettagli transazione';
  }

  redirectToMonitoraggioTransazioni(): void {
    const quadraturaId = parseInt(this.activatedRoute.snapshot.paramMap.get('quadraturaId'));
    const urlMonitoraggioTransazione = '/monitoraggioTransazioni?flussoQuadratura=' + quadraturaId;
    this.router.navigateByUrl(urlMonitoraggioTransazione);
  }

}
