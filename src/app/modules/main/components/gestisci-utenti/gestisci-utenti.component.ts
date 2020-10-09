import {Component, OnInit} from '@angular/core';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {tipoUtente} from '../../../../enums/TipoUtente.enum';
import {tool} from '../../../../enums/Tool.enum';
import {Utils} from '../../../../utils/Utils';
import {UtenteService} from '../../../../services/utente.service';
import {RicercaUtente} from '../../model/utente/RicercaUtente';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as FILESAVER from 'file-saver';


@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent implements OnInit {

  readonly tooltipGestisciUtentiTitle = 'In questa pagina puoi consultare la lista completa degli utenti e filtrarli';

  listaUtente: Array<RicercaUtente> = new Array<RicercaUtente>();

  toolbarIcons = [
    {type: tool.INSERT},
    {type: tool.UPDATE, disabled: true},
    {type: tool.EXPORT_PDF},
    {type: tool.EXPORT_XLS}
  ];

  tabs = [{header: 'Tutti'},
    {header: 'Attivi'},
    {header: 'Disabilitati'}];

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
    this.utenteService.ricercaUtenti(null, null, null, null, null,
      null, null, null, null, null).pipe(map(utenti => {
      utenti.forEach(utente => {
        this.listaUtente.push(utente);
        this.tableData.rows.push(this.creaRigaTabella(utente));
      });
    })).subscribe();
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

    if (value === tipoUtente.ATTIVI.value) {
      tabRows = tabRows.filter(row => row.iconaUtente.display === 'inline');
    } else if (value === tipoUtente.DISABILITATI.value) {
      tabRows = tabRows.filter(row => row.iconaUtente.display === 'none');
    }

    this.tempTableData.rows = tabRows;
  }

  // todo logica azioni tool
  eseguiAzioni(azioneTool) {
    if (azioneTool.value === tool.INSERT.value) {
      // inserisci utente
    } else if (azioneTool.value === tool.UPDATE.value) {
      // aggiorna utente
    } else if (azioneTool.value === tool.EXPORT_PDF.value) {
      // esporta in pdf
    } else if (azioneTool.value === tool.EXPORT_XLS.value) {
      this.esportaInFileExcel();
    }
  }

  esportaInFileExcel(): void {
    let dataTable = JSON.parse(JSON.stringify(this.tableData));
    const customHeaders = dataTable.cols.map(col => col.header);
    dataTable.rows = dataTable.rows.map(row => {
      let newRow = row;
      newRow.iconaUtente = row.iconaUtente.display === 'none' ? 'DISABILITATO' : 'ATTIVO';
      newRow.ultimoAccesso = row.ultimoAccesso?.testo;
      return newRow;
    });

    let worksheet = XLSX.utils.json_to_sheet(dataTable.rows);
    worksheet = XLSX.utils.sheet_add_aoa(worksheet, [customHeaders]);
    const workbook = { Sheets: { 'Utenti': worksheet }, SheetNames: ['Utenti'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.salvaComeFileExcel(excelBuffer, 'Lista Utenti');
  }

  salvaComeFileExcel(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FILESAVER.saveAs(data, fileName + '_export_' + moment().format('DD-MM-YYYY HH:mm') + EXCEL_EXTENSION);
  }

  onChangeListaUtenti(listaUtentiFiltrati: RicercaUtente[]): void {
    this.tableData.rows.length = 0;
    listaUtentiFiltrati.forEach(utente => {
      this.tableData.rows.push(this.creaRigaTabella(utente));
    });
  }

  getTestoConNumeroUtentiAttiviDisabilitati(): string {
    const numeroUtentiAttivi = this.tableData.rows.filter(row => row.iconaUtente.display === 'inline').length;
    const numeroUtentiDisabilitati = this.tableData.rows.filter(row => row.iconaUtente.display === 'none').length;
    return '\b Di cui attivi: ' + numeroUtentiAttivi + '\b\b Di cui disabilitati: ' + numeroUtentiDisabilitati;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.toolbarIcons[1].disabled = rowsChecked.length !== 1;
  }

}
