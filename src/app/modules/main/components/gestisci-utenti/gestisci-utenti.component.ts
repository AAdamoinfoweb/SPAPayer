import {Component, OnInit} from '@angular/core';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {TipoUtenteEnum} from '../../../../enums/TipoUtente.enum';
import {tool} from '../../../../enums/Tool.enum';
import {Utils} from '../../../../utils/Utils';
import {UtenteService} from '../../../../services/utente.service';
import {RicercaUtente} from '../../model/utente/RicercaUtente';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {ParametriRicercaUtente} from '../../model/utente/ParametriRicercaUtente';


@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent implements OnInit {

  readonly tooltipGestisciUtentiTitle = 'In questa pagina puoi consultare la lista completa degli utenti e filtrarli';

  breadcrumbList = [];

  listaUtente: Array<RicercaUtente> = new Array<RicercaUtente>();

  toolbarIcons = [
    {type: tool.INSERT},
    {type: tool.UPDATE, disabled: true},
    {type: tool.EXPORT_PDF},
    {type: tool.EXPORT_XLS}
  ];

  tabs = [
    {value: TipoUtenteEnum.TUTTI},
    {value: TipoUtenteEnum.ATTIVI},
    {value: TipoUtenteEnum.DISABILITATI}
  ];

  nomeTabCorrente: string;

  tableData = {
    rows: [],
    cols: [
      {field: 'iconaUtente', header: '', type: tipoColonna.ICONA},
      {field: 'id', header: 'User ID (Cod. Fisc.)', type: tipoColonna.TESTO},
      {field: 'nome', header: 'Cognome e Nome', type: tipoColonna.TESTO},
      {field: 'gruppoAbilitazioni', header: 'Gruppi Abilitazioni', type: tipoColonna.TESTO},
      {field: 'scadenza', header: 'Scadenza', type: tipoColonna.TESTO},
      {field: 'ultimoAccesso', header: 'Ultimo accesso', type: tipoColonna.LINK}
    ],
    dataKey: 'nome',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;

  constructor(private utenteService: UtenteService) {
    this.inizializzaBreadcrumbList();

    const parametriRicercaUtente = new ParametriRicercaUtente();
    this.utenteService.ricercaUtenti(parametriRicercaUtente).pipe(map(utenti => {
      utenti.forEach(utente => {
        this.listaUtente.push(utente);
        this.tableData.rows.push(this.creaRigaTabella(utente));
      });
    })).subscribe();
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', null, null));
  }

  ngOnInit(): void {
    this.tempTableData = Object.assign({}, this.tableData);
  }

  creaRigaTabella(utente: RicercaUtente): object {
    const dataSistema = moment();
    const nomeUtente = utente.cognome.charAt(0).toUpperCase() + utente.cognome.slice(1) + ' ' + utente.nome.charAt(0).toUpperCase() + utente.nome.slice(1);

    // TODO sostituire link mockato con redirect a monitoraAccessi
    const ultimoAccesso = utente.ultimoAccesso ? Utils.creaLink(moment(utente.ultimoAccesso).format('DD/MM/YYYY'), 'www.dxc.com') : null;

    let row;

    row = {
      iconaUtente: Utils.creaIcona('assets/img/sprite.svg#it-user', '#ef8157', nomeUtente, 'none'),
      id: utente.codiceFiscale.toUpperCase(),
      nome: nomeUtente,
      gruppoAbilitazioni: utente.gruppo,
      scadenza: utente.dataFineValidita ? moment(utente.dataFineValidita).format('DD/MM/YYYY') : null,
      ultimoAccesso: ultimoAccesso
    };

    if (utente.dataFineValidita === null
          || (moment(utente.dataInizioValidita) <= dataSistema && moment(utente.dataFineValidita) >= dataSistema)) {
      // UTENTE ATTIVO
      row.iconaUtente = Utils.creaIcona('assets/img/sprite.svg#it-user', '#ef8157', nomeUtente, 'inline');
    } else if (moment(utente.dataInizioValidita) > dataSistema || moment(utente.dataFineValidita) < dataSistema) {
      // UTENTE DISABILITATO
      row.iconaUtente = Utils.creaIcona('assets/img/sprite.svg#it-user', '#ef8157', nomeUtente, 'none');
    }

    return row;
  }

  onChangeTab(value) {
    let tabRows = this.tableData.rows.map(row => row);

    if (value === TipoUtenteEnum.ATTIVI) {
      tabRows = tabRows.filter(row => row.iconaUtente.display === 'inline');
    } else if (value === TipoUtenteEnum.DISABILITATI) {
      tabRows = tabRows.filter(row => row.iconaUtente.display === 'none');
    }

    this.tempTableData.rows = tabRows;
    this.nomeTabCorrente = value;
  }

  // todo logica azioni tool
  eseguiAzioni(azioneTool) {
    const dataTable = JSON.parse(JSON.stringify(this.tempTableData));

    if (azioneTool.value === tool.INSERT.value) {
      window.open('/aggiungiUtentePermessi', '_self');
    } else if (azioneTool.value === tool.UPDATE.value) {
      // aggiorna utente
    } else if (azioneTool.value === tool.EXPORT_PDF.value) {
      this.esportaTabellaInFilePdf(dataTable);
    } else if (azioneTool.value === tool.EXPORT_XLS.value) {
      this.esportaTabellaInFileExcel(dataTable);
    }
  }

  esportaTabellaInFilePdf(dataTable: any): void {
    const customHeaders = dataTable.cols.map(col => col.header);
    const customRows = [];
    dataTable.rows.forEach(row => {
      const rows = [];
      for (let key in row) {
        let temp = null;
        if (key === 'iconaUtente') {
          temp = row[key]?.display === 'inline' ? '' : null;
        } else if (key === 'ultimoAccesso') {
          temp = row[key]?.testo;
        } else {
          temp = row[key];
        }
        rows.push(temp);
      }
      customRows.push(rows);
    });

    const filePdf = new jsPDF.default('l', 'pt', 'a4');
    filePdf.setProperties({ title: 'Lista Utenti' });
    // @ts-ignore
    filePdf.autoTable(customHeaders, customRows, {
      didDrawCell: data => {
        if (data.section === 'body' && data.column.index === 0 && data.row.raw[0] != null) {
          let activeUserIcon = new Image();
          activeUserIcon.src = 'assets/img/active-user.png';
          filePdf.addImage(activeUserIcon, 'PNG', data.cell.x + 2, data.cell.y + 2, 18, 17);
        }
      }
    });
    const blob = filePdf.output('blob');
    window.open(URL.createObjectURL(blob));
  }

  esportaTabellaInFileExcel(dataTable: any): void {
    const customHeaders = dataTable.cols.map(col => col.header);
    dataTable.rows = dataTable.rows.map(row => {
      let newRow = row;
      newRow.iconaUtente = row.iconaUtente.display === 'none' ? 'DISABILITATO' : 'ATTIVO';
      newRow.ultimoAccesso = row.ultimoAccesso?.testo;
      return newRow;
    });

    const workbook = { Sheets: { 'Utenti': null}, SheetNames: [] };
    Utils.creaFileExcel(dataTable.rows, customHeaders, 'Utenti', ['Utenti'], workbook, 'Lista Utenti');
  }

  onChangeListaUtenti(listaUtentiFiltrati: RicercaUtente[]): void {
    this.tableData.rows.length = 0;
    listaUtentiFiltrati.forEach(utente => {
      this.tableData.rows.push(this.creaRigaTabella(utente));
    });
    this.onChangeTab(this.nomeTabCorrente);
  }

  getTotaliPerRecord(): string {
    const numeroUtentiAttivi = this.tableData.rows.filter(row => row.iconaUtente.display === 'inline').length;
    const numeroUtentiDisabilitati = this.tableData.rows.filter(row => row.iconaUtente.display === 'none').length;
    return 'Totale: ' + this.tableData.rows.length + '\b Di cui attivi: ' + numeroUtentiAttivi + '\b\b Di cui disabilitati: ' + numeroUtentiDisabilitati;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.toolbarIcons[1].disabled = rowsChecked.length !== 1;
  }

}
