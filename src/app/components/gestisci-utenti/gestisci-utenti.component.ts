import {Component, OnInit} from '@angular/core';
import {tipoColonna} from '../../enums/TipoColonna.enum';
import {tipoTabella} from '../../enums/TipoTabella.enum';
import {tipoUtente} from '../../enums/TipoUtente.enum';
import {tool} from '../../enums/Tool.enum';

@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent implements OnInit {


  constructor() {
  }

  tabs = [{header: 'Tutti'},
    {header: 'Attivi'},
    {header: 'Disabilitati'}];

  tableData = {
    rows: [{
      name: 'Austin', gender: 'assets/img/sprite.svg#it-check', company: 'Swimlane',
      link: 'link company href:https://www.google.com/', importo: '89.21'
    },
      {
        name: 'Dany', gender: 'assets/img/sprite.svg#it-delete', company: 'KFC',
        link: 'href:https://www.google.com/', importo: '43'
      },
      {
        name: 'Molly', gender: 'assets/img/sprite.svg#it-mail', company: 'Burger King',
        link: 'href:https://www.google.com/', importo: '10'
      }],
    cols: [
      {field: 'name', header: 'Name', type: tipoColonna.TESTO},
      {field: 'gender', header: 'Gender', type: tipoColonna.ICONA},
      {field: 'company', header: 'Company', type: tipoColonna.TESTO},
      {field: 'link', header: 'Link', type: tipoColonna.LINK},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO}
    ],
    dataKey: 'name',
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
       tabRows = tabRows.filter(value1 => value1.name.startsWith('A'));
    } else if (value === tipoUtente.DISABILITATI.value) {
      tabRows = tabRows.filter(value1 => value1.name.startsWith('M'));
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

}
