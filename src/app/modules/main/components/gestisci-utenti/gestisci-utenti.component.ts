import {Component, OnInit} from '@angular/core';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {tipoUtente} from '../../../../enums/TipoUtente.enum';
import {tool} from '../../../../enums/Tool.enum';
import {Utils} from '../../../../utils/Utils';


@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent implements OnInit {

  tooltipGestisciUtentiTitle = 'In questa pagina puoi consultare la lista completa degli utenti e filtrarli';

  isSubsectionListaUtentiVisible: boolean = true;
  arrowType: string = 'assets/img/sprite.svg#it-collapse';

  constructor() {
  }

  tabs = [{header: 'Tutti'},
    {header: 'Attivi'},
    {header: 'Disabilitati'}];

  tableData = {
    rows: [{
      iconaUtente: Utils.creaIcona('assets/img/sprite.svg#it-user', '#ef8157', 'ciao'),
      id: 'RBNGNN94C11A662V',
      nome: 'Giovanni Rubino',
      societa: Utils.creaLink('DXC Technology', 'www.dxc.com'),
      ente: Utils.creaLink('INPS', 'www.inps.it'),
      gruppoAbilitazioni: 'Amministra',
      scadenza: '10/12/2020'
    }],
    cols: [
      {field: 'iconaUtente', header: '', type: tipoColonna.ICONA},
      {field: 'id', header: 'User ID (Cod. Fisc.)', type: tipoColonna.TESTO},
      {field: 'nome', header: 'Cognome e Nome', type: tipoColonna.TESTO},
      {field: 'societa', header: 'Società', type: tipoColonna.LINK},
      {field: 'ente', header: 'Ente', type: tipoColonna.LINK},
      {field: 'gruppoAbilitazioni', header: 'Gruppi Abilitazioni', type: tipoColonna.TESTO},
      {field: 'scadenza', header: 'Scadenza', type: tipoColonna.TESTO},
      {field: 'ultimoAccesso', header: 'Ultimo accesso', type: tipoColonna.LINK}
    ],
    dataKey: 'nome',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;

  //  todo popolare la tabella utenti
  ngOnInit(): void {
    this.tempTableData = Object.assign({}, this.tableData);
  }

  // todo logica filtro per utenti attivi
  onChangeTab(value) {
    let tabRows = this.tableData.rows.map(row => row);
    if (value === tipoUtente.ATTIVI.value) {
      tabRows = tabRows.filter(value1 => value1.nome.startsWith('A'));
    } else if (value === tipoUtente.DISABILITATI.value) {
      tabRows = tabRows.filter(value1 => value1.nome.startsWith('M'));
    }

    this.tempTableData.rows = tabRows;
  }

  // todo logica azioni tool
  eseguiAzioni(azioneTool) {
    if (azioneTool.value === tool.INSERT.value) {
      // inserisci utente
    } else if (azioneTool.value === tool.UPDATE.value) {
      // aggiorna utente
    } else if (azioneTool.value === tool.DELETE.value) {
      // cancella utente
    } else if (azioneTool.value === tool.EXPORT_PDF.value) {
      // esporta in pdf
    } else if (azioneTool.value === tool.EXPORT_PDF.value) {
      // esporta in excel
    }
  }

  setArrowType(): void {
    this.isSubsectionListaUtentiVisible = !this.isSubsectionListaUtentiVisible;
    this.arrowType = !this.isSubsectionListaUtentiVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

}
