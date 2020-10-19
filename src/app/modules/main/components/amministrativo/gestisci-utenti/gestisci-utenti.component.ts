import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {TipoUtenteEnum} from '../../../../../enums/TipoUtente.enum';
import {Utils} from '../../../../../utils/Utils';
import {UtenteService} from '../../../../../services/utente.service';
import {RicercaUtente} from '../../../model/utente/RicercaUtente';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {Breadcrumb} from '../../../dto/Breadcrumb';
import {ParametriRicercaUtente} from '../../../model/utente/ParametriRicercaUtente';
import {ActivatedRoute, Router} from '@angular/router';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {OverlayService} from '../../../../../services/overlay.service';
import {AmministrativoParentComponent} from "../amministrativo-parent.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestisci-utenti.component.html',
  styleUrls: ['./gestisci-utenti.component.scss']
})
export class GestisciUtentiComponent extends AmministrativoParentComponent implements OnInit, AfterViewInit {

  readonly tooltipGestisciUtentiTitle = 'In questa pagina puoi consultare la lista completa degli utenti e filtrarli';

  breadcrumbList = [];

  codiceFiscaleUtenteDaModificare: string;
  listaUtente: Array<RicercaUtente> = new Array<RicercaUtente>();

  toolbarIcons = [
    {type: ToolEnum.INSERT},
    {type: ToolEnum.UPDATE, disabled: true},
    {type: ToolEnum.EXPORT_PDF},
    {type: ToolEnum.EXPORT_XLS}
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
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;

  constructor(router: Router, private utenteService: UtenteService, overlayService: OverlayService,
              route: ActivatedRoute, http: HttpClient,
              private renderer: Renderer2, private el: ElementRef) {
    super(router, overlayService, route, http);
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', null, null));
  }

  ngOnInit(): void {
    if (!this.waiting) {
      this.inizializzaBreadcrumbList();

      const parametriRicercaUtente = new ParametriRicercaUtente();
      this.overlayService.caricamentoEvent.emit(true);
      this.utenteService.ricercaUtenti(parametriRicercaUtente).pipe(map(utenti => {
        utenti.forEach(utente => {
          this.listaUtente.push(utente);
          this.tableData.rows.push(this.creaRigaTabella(utente));
        });
        this.overlayService.caricamentoEvent.emit(false);
      })).subscribe();
      this.tempTableData = Object.assign({}, this.tableData);
    }
  }

  ngAfterViewInit(): void {
    if (!this.waiting)
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  creaRigaTabella(utente: RicercaUtente): object {
    const dataSistema = moment();

    let nomeUtente;
    if (utente.cognome && utente.nome) {
      nomeUtente = utente.cognome?.charAt(0).toUpperCase() + utente.cognome?.slice(1) + ' ' + utente.nome?.charAt(0).toUpperCase() + utente.nome?.slice(1);
    } else {
      if (utente.cognome) {
        nomeUtente = utente.cognome?.charAt(0).toUpperCase() + utente.cognome?.slice(1);
      } else if (utente.nome) {
        nomeUtente = utente.nome?.charAt(0).toUpperCase() + utente.nome?.slice(1);
      } else {
        nomeUtente = null;
      }
    }

    // TODO sostituire link mockato con redirect a monitoraAccessi
    const ultimoAccesso = utente.ultimoAccesso ? Utils.creaLink(moment(utente.ultimoAccesso).format('DD/MM/YYYY'), 'www.dxc.com') : null;

    let row;

    row = {
      iconaUtente: Utils.creaIcona('#it-user', '#ef8157', nomeUtente, 'none'),
      id: {value: utente.codiceFiscale.toUpperCase()},
      nome: {value: nomeUtente},
      gruppoAbilitazioni: {value: utente.gruppo},
      scadenza: {value: utente.dataFineValidita ? moment(utente.dataFineValidita).format('DD/MM/YYYY') : null},
      ultimoAccesso: ultimoAccesso
    };

    if (utente.dataFineValidita === null
      || (moment(utente.dataInizioValidita) <= dataSistema && moment(utente.dataFineValidita) >= dataSistema)) {
      // UTENTE ATTIVO
      row.iconaUtente = Utils.creaIcona('#it-user', '#ef8157', nomeUtente, 'inline');
    } else if (moment(utente.dataInizioValidita) > dataSistema || moment(utente.dataFineValidita) < dataSistema) {
      // UTENTE DISABILITATO
      row.iconaUtente = Utils.creaIcona('#it-user', '#ef8157', nomeUtente, 'none');
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

  eseguiAzioni(azioneTool) {
    const dataTable = JSON.parse(JSON.stringify(this.tempTableData));
    if (azioneTool === ToolEnum.INSERT) {
      this.router.navigateByUrl('/aggiungiUtentePermessi');
    } else if (azioneTool === ToolEnum.UPDATE) {
      this.router.navigate(['/modificaUtentePermessi', this.codiceFiscaleUtenteDaModificare]);
    } else if (azioneTool === ToolEnum.EXPORT_PDF) {
      this.esportaTabellaInFilePdf(dataTable);
    } else if (azioneTool === ToolEnum.EXPORT_XLS) {
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
          temp = row[key]?.value;
        }
        rows.push(temp);
      }
      customRows.push(rows);
    });

    const filePdf = new jsPDF.default('l', 'pt', 'a4');
    filePdf.setProperties({title: 'Lista Utenti'});
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
      newRow.id = row.id.value;
      newRow.nome = row.nome.value;
      newRow.gruppoAbilitazioni = row.gruppoAbilitazioni.value;
      newRow.scadenza = row.scadenza.value;
      newRow.ultimoAccesso = row.ultimoAccesso?.testo;
      return newRow;
    });

    const workbook = {Sheets: {'Utenti': null}, SheetNames: []};
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
    if (rowsChecked.length === 1) {
      this.codiceFiscaleUtenteDaModificare = rowsChecked[0].id.value;
      this.toolbarIcons[1].disabled = false;
    } else {
      this.codiceFiscaleUtenteDaModificare = null;
      this.toolbarIcons[1].disabled = true;
    }
  }

}
