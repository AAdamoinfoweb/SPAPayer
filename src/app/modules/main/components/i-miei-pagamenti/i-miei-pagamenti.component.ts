import {Component, OnInit} from '@angular/core';
import {tipoUtente} from "../../../../enums/TipoUtente.enum";
import {tool} from "../../../../enums/Tool.enum";
import {tipoColonna} from "../../../../enums/TipoColonna.enum";
import {tipoTabella} from "../../../../enums/TipoTabella.enum";
import {Utils} from "../../../../utils/Utils";
import {Breadcrumb} from "../../dto/Breadcrumb";

@Component({
  selector: 'app-i-miei-pagamenti',
  templateUrl: './i-miei-pagamenti.component.html',
  styleUrls: ['./i-miei-pagamenti.component.scss']
})
export class IMieiPagamentiComponent implements OnInit {

  tooltipOnPageTitle = 'In questa pagina puoi consultare la lista completa dei pagamenti e filtrarli';
  tooltipPendenzaNotInsertedFromEnte = 'Attenzione: questo non è un pagamento inserito automaticamente dall\'Ente';
  tooltipNewPagamento = 'Nuovo Pagamento';
  tooltipDeletePagamento = 'Elimina Pagamento';
  tooltipVisualizeDownloadPagamento = 'Visualizza/Scarica gli attestati del pagamento';
  tooltipAddToCarrello = 'Aggiungi al carrello';

  // breadcrumb
  breadcrumbList = [];

  isSubsectionFiltriVisible: boolean;
  isSubsectionListaPagamentiVisible: boolean;

  listaLivelliTerritoriali: Array<any> = [
    {value: 'mock livello1 val', label: 'mock livello1 label'},
    {value: 'mock livello2 val', label: 'mock livello2 label'}
  ];

  listaEnti: Array<any> = [
    {value: 'mock ente1 val', label: 'mock ente1 label'},
    {value: 'mock ente2 val', label: 'mock ente2 label'}
  ];

  listaServizi: Array<any> = [
    {value: 'mock servizio1 val', label: 'mock servizio1 label'},
    {value: 'mock servizio2 val', label: 'mock servizio2 label'}
  ];

  livelloTerritorialeSelezionato: string;
  enteSelezionato: string;
  servizioSelezionato: string;

  // collapse
  isSubsectionListaUtentiVisible = true;
  arrowType = 'assets/img/sprite.svg#it-collapse';

  // tabs
  tabs = [{header: 'Tutti'},
    {header: 'In Attesa'},
    {header: 'Pagati'}];

  // table
  tableData = {
    rows: [],
    cols: [
      {field: 'icona', header: '', type: tipoColonna.ICONA},
      {field: 'numero', header: 'N.ro Documento', type: tipoColonna.TESTO},
      {field: 'descrizione', header: 'Descrizione', type: tipoColonna.TESTO},
      {field: 'ente', header: 'Ente', type: tipoColonna.TESTO},
      {field: 'scadenza', header: 'Scadenza', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'data', header: 'Data Pagamento', type: tipoColonna.TESTO}
    ],
    dataKey: 'numero',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;


  constructor() {
    // init breadcrumb
    this.inizializzaBreadcrumb();
  }

  private inizializzaBreadcrumb() {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', null, null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Pagamenti', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'I Miei Pagamenti', null, null));
  }

  ngOnInit(): void {
    this.isSubsectionListaPagamentiVisible = true;
    this.riempiTabella();
    this.tempTableData = Object.assign({}, this.tableData);
  }

  setArrowType(): void {
    this.isSubsectionListaUtentiVisible = !this.isSubsectionListaUtentiVisible;
    this.arrowType = !this.isSubsectionListaUtentiVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

  onChangeTab(value) {
    // let tabRows = this.tableData.rows.map(row => row);
    //
    // if (value === tipoUtente.ATTIVI.value) {
    //   tabRows = tabRows.filter(row => row.iconaUtente.display === 'inline');
    // } else if (value === tipoUtente.DISABILITATI.value) {
    //   tabRows = tabRows.filter(row => row.iconaUtente.display === 'none');
    // }
    //
    // this.tempTableData.rows = tabRows;
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
      // esporta in excel
    }
  }

  getTestoConNumeroUtentiAttiviDisabilitati(): string {
  return '';
  }

  riempiTabella() {
    this.tableData.rows = [{
      icona: Utils.creaIcona('assets/img/sprite.svg#it-pencil', '#ef8157', 'tooltip', null),
      numero: '12345',
      descrizione: 'descrizione',
      ente: 'Comune di Bologna',
      scadenza: '10/2020',
      importo: 100,
      data: '20/10/2020'
    }];
  }
}
