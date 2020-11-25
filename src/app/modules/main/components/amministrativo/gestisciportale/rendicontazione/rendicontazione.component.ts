import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {SintesiRendicontazione} from '../../../../model/rendicontazione/SintesiRendicontazione';
import {RicercaRendicontazione} from '../../../../model/rendicontazione/RicercaRendicontazione';
import {ParametriRicercaRendicontazione} from '../../../../model/rendicontazione/ParametriRicercaRendicontazione';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../services/menu.service';
import {Observable} from 'rxjs';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {RendicontazioneService} from '../../../../../../services/rendicontazione.service';
import {Utils} from '../../../../../../utils/Utils';
import * as moment from 'moment';
import {StatisticaEnte} from '../../../../model/rendicontazione/StatisticaEnte';

@Component({
  selector: 'app-rendicontazione',
  templateUrl: './rendicontazione.component.html',
  styleUrls: ['./rendicontazione.component.scss']
})
export class RendicontazioneComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei flussi di rendicontazione agli enti che utilizzano Payer e filtrarli';

  breadcrumbList = [];

  elemento: RicercaRendicontazione = new RicercaRendicontazione();
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
    dataKey: 'idFlussoRendicontazione.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tableDataStatisticheRendicontazioni: Tabella = {
    rows: [],
    cols: [
      {field: 'enteId', header: 'Ente', type: tipoColonna.TESTO},
      {field: 'numeroTransazioni', header: 'Numero di transazioni', type: tipoColonna.TESTO},
      {field: 'importi', header: 'Totale degli importi', type: tipoColonna.TESTO}
    ],
    dataKey: 'enteId.value',
    tipoTabella: tipoTabella.TEMPLATING
  };
  displayModalWithTable: boolean = false;

  isMenuCarico = false;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2,
              private el: ElementRef, private menuService: MenuService,
              private rendicontazioneService: RendicontazioneService) {
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
    this.popolaElemento();
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

  popolaElemento(): void {
    this.elemento.sintesiRendicontazioni = [];
    this.elemento.statisticheEnte = [];
    this.tableData.rows = [];
    this.getObservableFunzioneRicerca().subscribe(elemento => {
      if (elemento != null) {
        this.elemento.sintesiRendicontazioni = elemento.sintesiRendicontazioni;
        this.elemento.statisticheEnte = elemento.statisticheEnte;
        this.impostaTabella(this.elemento.sintesiRendicontazioni);
        this.creaTabellaStisticheRendicontazione(this.elemento.statisticheEnte);
        this.callbackPopolaLista();
      }
      this.waiting = false;
    });
  }

  creaTabellaStisticheRendicontazione(listaStatisticheEnte: StatisticaEnte[]): void {
    this.tableDataStatisticheRendicontazioni.rows = [];
    if (listaStatisticheEnte) {
      listaStatisticheEnte.forEach(statisticaEnte => {
        this.tableDataStatisticheRendicontazioni.rows.push(this.creaRigaTabellaStatisticheRendicontazione(statisticaEnte));
      });
    }
  }

  creaRigaTabellaStatisticheRendicontazione(statisticaEnte: StatisticaEnte) {
    return {
      enteId: {value: this.elemento.sintesiRendicontazioni.filter(rendicontazione => rendicontazione.enteId === statisticaEnte.enteId)[0].enteNome},
      numeroTransazioni: {value: statisticaEnte.numeroTransazioni},
      importi: {value: statisticaEnte.importi}
    };
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(rendicontazione: SintesiRendicontazione) {
    const iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';

    let coloreIcona = null;
    let tooltipIcona = null;
    let displayIcona = 'none';
    let placementIcona = '';
    if (rendicontazione.statoInvioEmail) {
      coloreIcona = '#008758';
      tooltipIcona = 'Invio effettuato via email';
      placementIcona = 'top';
      displayIcona = 'inline';
    } else if (rendicontazione.statoInvioFtp) {
      coloreIcona = '#D9364F';
      tooltipIcona = 'Invio effettuato via FTP';
      placementIcona = 'top';
      displayIcona = 'inline';
    }

    return {
      ente: Utils.creaLink(rendicontazione.enteNome, '/gestisciEnti', iconaGruppoUtenti),
      servizio: {value: rendicontazione.servizioNome},
      canale: {value: rendicontazione.canale},
      tipoFlusso: {value: rendicontazione.tipoFlusso},
      dataRendiconto: {value: rendicontazione.dataRendiconto
          ? moment(rendicontazione.dataRendiconto).format(Utils.FORMAT_DATE_CALENDAR)
          : null},
      idFlussoRendicontazione: {value: rendicontazione.flussoRendicontazioneId},
      numeroPagamenti: {value: rendicontazione.numeroPagamenti},
      importoNetto: {value: rendicontazione.importoNetto},
      statoInvio: Utils.creaIcona('#it-mail', coloreIcona, tooltipIcona, displayIcona, placementIcona)
    };
  }

  getObservableFunzioneRicerca(): Observable<RicercaRendicontazione> {
    return this.rendicontazioneService.ricercaRendicontazioni(this.filtriRicerca, this.idFunzione);
  }

  callbackPopolaLista() {}

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista flussi di rendicontazione');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista flussi di rendicontazione');
        break;
      case ToolEnum.VISUALIZE_STATISTICS:
        this.displayModalWithTable = !this.displayModalWithTable;
        break;
    }
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]) {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    const iconaGruppoUtenti = new ImmaginePdf();
    iconaGruppoUtenti.indiceColonna = 0;
    iconaGruppoUtenti.srcIcona = 'assets/img/users-solid-pdf-img.png';
    iconaGruppoUtenti.posizioneX = 60;
    iconaGruppoUtenti.posizioneY = 8;
    iconaGruppoUtenti.larghezza = 18;
    iconaGruppoUtenti.altezza = 15;

    // TODO aggiungere immagine dinamica stato invio rendicontazione

    return [iconaGruppoUtenti];
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      const rigaFormattata = riga;
      rigaFormattata.ente = riga.ente.value;
      rigaFormattata.servizio = riga.servizio.value;
      rigaFormattata.canale = riga.canale.value;
      rigaFormattata.tipoFlusso = riga.tipoFlusso.value;
      rigaFormattata.dataRendiconto = riga.dataRendiconto.value;
      rigaFormattata.idFlussoRendicontazione = riga.idFlussoRendicontazione.value;
      rigaFormattata.numeroPagamenti = riga.numeroPagamenti.value;
      rigaFormattata.importoNetto = riga.importoNetto.value;
      if (riga.statoInvio.tooltip) {
        if (riga.statoInvio.tooltip.includes('email')) {
          rigaFormattata.statoInvio = 'Invio effettuato via email';
        } else if (riga.statoInvio.tooltip.includes('FTP')) {
          rigaFormattata.statoInvio = 'Invio effettuato via FTP';
        } else {
          rigaFormattata.statoInvio = null;
        }
      } else {
        rigaFormattata.statoInvio = null;
      }
      return rigaFormattata;
    });
  }

  getNumeroRecord(): string {
    return `Totale: ${this.elemento.sintesiRendicontazioni.length}`;
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  mostraDettaglioRendicontazione(rigaCliccata: any) {
    // TODO this.mostraDettaglioElemento('/dettaglioRendicontazione', rigaCliccata.id.value);
  }

  onChangeFiltriRendicontazione(filtri: ParametriRicercaRendicontazione): void {
    this.filtriRicerca = filtri;
    this.popolaElemento();
  }

}
