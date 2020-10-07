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


@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent implements OnInit {

  readonly tooltipGestisciUtentiTitle = 'In questa pagina puoi consultare la lista completa degli utenti e filtrarli';

  isSubsectionListaUtentiVisible = true;
  arrowType = 'assets/img/sprite.svg#it-collapse';

  listaUtente: Array<RicercaUtente> = new Array<RicercaUtente>();

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
    let row;

    row = {
      iconaUtente: Utils.creaIcona('assets/img/sprite.svg#it-user', '#ef8157', nomeUtente, 'none'),
      id: utente.codiceFiscale.toUpperCase(),
      nome: nomeUtente,
      gruppoAbilitazioni: utente.gruppo,
      scadenza: utente.dataFineValidita ? moment(utente.dataFineValidita).format('DD/MM/YYYY[; h. ] HH:mm') : null,
      ultimoAccesso: utente.ultimoAccesso ? moment(utente.ultimoAccesso).format('DD/MM/YYYY[; h. ] HH:mm') : null
    };

    if (moment(utente.dataInizioValidita) <= dataSistema && moment(utente.dataFineValidita) >= dataSistema) {
      // UTENTE ABILITATO
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

  onChangeListaUtenti(listaUtentiFiltrati: RicercaUtente[]): void {
    this.tableData.rows.length = 0;
    listaUtentiFiltrati.forEach(utente => {
      this.tableData.rows.push(this.creaRigaTabella(utente));
    });
    this.listaUtente = listaUtentiFiltrati;
  }

  getTestoConNumeroUtentiAttiviDisabilitati(): string {
    const numeroUtentiAttivi = this.tableData.rows.filter(row => row.iconaUtente.display === 'inline').length;
    const numeroUtentiDisabilitati = this.tableData.rows.filter(row => row.iconaUtente.display === 'none').length;
    return '\b Di cui attivi: ' + numeroUtentiAttivi + '\b\b Di cui disabilitati: ' + numeroUtentiDisabilitati;
  }

}
