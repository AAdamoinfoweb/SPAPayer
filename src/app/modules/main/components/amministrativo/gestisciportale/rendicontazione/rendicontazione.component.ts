import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {SintesiRendicontazione} from '../../../../model/rendicontazione/SintesiRendicontazione';
import {ParametriRicercaRendicontazione} from '../../../../model/rendicontazione/ParametriRicercaRendicontazione';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {Observable} from 'rxjs';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';

@Component({
  selector: 'app-rendicontazione',
  templateUrl: './rendicontazione.component.html',
  styleUrls: ['./rendicontazione.component.scss']
})
export class RendicontazioneComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei flussi di rendicontazione agli enti che utilizzano Payer e filtrarli';

  breadcrumbList = [];

  listaElementi: Array<SintesiRendicontazione> = new Array<SintesiRendicontazione>();
  filtriRicerca: ParametriRicercaRendicontazione = null;

  righeSelezionate: any[];

  toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'},
    {type: ToolEnum.VISUALIZE_STATISTICS, tooltip: 'Statistiche'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'ente', header: 'Ente', type: tipoColonna.LINK},
      {field: 'servizio', header: 'Servizio', type: tipoColonna.TESTO},
      {field: 'canale', header: 'Canale', type: tipoColonna.TESTO},
      {field: 'tipoFlusso', header: 'Tipo flusso', type: tipoColonna.TESTO},
      {field: 'dataRendiconto', header: 'Data rendiconto', type: tipoColonna.TESTO},
      {field: 'idFlussoRendicontazione', header: 'ID flusso rendicontazione', type: tipoColonna.TESTO},
      {field: 'numeroPagamenti', header: 'Numero Pagamenti', type: tipoColonna.TESTO},
      {field: 'importoNetto', header: 'Importo netto', type: tipoColonna.IMPORTO},
      {field: 'statoInvio', header: 'Stato invio', type: tipoColonna.ICONA}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  isMenuCarico = false;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2,
              private el: ElementRef, private menuService: MenuService, private confirmationService: ConfirmationService) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
    this.waitingEmitter.subscribe(() => {
      if (this.amministrativoService.mappaFunzioni) {
        this.isMenuCarico = Object.keys(this.amministrativoService.mappaFunzioni).length > 0;
      }

      if (this.isMenuCarico) {
        this.inizializzaPagina();
      } else {
        this.menuService.menuCaricatoEvent.subscribe(() => {
          this.inizializzaPagina();
        });
      }
    });
  }

  inizializzaPagina() {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Rendicontazione', link: null}
    ], true);
    this.inizializzaFiltriRicerca();
    this.popolaListaElementi();
  }

  private inizializzaFiltriRicerca(): void {
    this.filtriRicerca = new ParametriRicercaRendicontazione();
    this.filtriRicerca.societaId = null;
    this.filtriRicerca.livelloTerritorialeId = null;
    this.filtriRicerca.enteId = null;
    this.filtriRicerca.servizioId = null;
    this.filtriRicerca.transazioneId = null;
    this.filtriRicerca.tipologiaServizioId = null;
    this.filtriRicerca.canaleId = null;
    this.filtriRicerca.dataPagamentoDa = null;
    this.filtriRicerca.dataPagamentoA = null;
    this.filtriRicerca.importoTransazioneDa = null;
    this.filtriRicerca.importoTransazioneA = null;
    this.filtriRicerca.flussoRendicontazioneId = null;
    this.filtriRicerca.dataCreazioneRendicontoDa = null;
    this.filtriRicerca.dataCreazioneRendicontoA = null;
    this.filtriRicerca.tipoFlussoId = null;
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(rendicontazione: SintesiRendicontazione) {
    // TODO implementare logica creazione riga tabella
  }

  getObservableFunzioneRicerca(): Observable<SintesiRendicontazione[]> {
    // TODO invocare operation ricercaRendicontazioni
    return null;
  }

  callbackPopolaLista() {}

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Attività');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Attività');
        break;
      case ToolEnum.VISUALIZE_STATISTICS:
        this.visualizzaStatisticheRendicontazioniFiltrate(this.tableData);
        break;
    }
  }

  visualizzaStatisticheRendicontazioniFiltrate(tabella: Tabella): void {
    // TODO implementare logica per visualizzare le statistiche relative alle rendicontazioni filtrate
    return null;
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]) {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    // TODO settare posizione icone nelle righe della tabella sul file pdf
    return [];
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    // TODO implementare logica creazione colonne file excel
    return [];
  }

  getRigheFileExcel(righe: any[]) {
    // TODO implementare logica creazione righe file excel
    return null;
  }

  getNumeroRecord(): string {
    // TODO numero record tabella
    return null;
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  mostraDettaglioRendicontazione(rigaCliccata: any) {
    // TODO this.mostraDettaglioElemento('/dettaglioRendicontazione', rigaCliccata.id.value);
  }

}
