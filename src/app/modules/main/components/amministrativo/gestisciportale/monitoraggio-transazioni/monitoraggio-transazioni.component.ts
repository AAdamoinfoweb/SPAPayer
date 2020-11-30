import {Component, OnInit} from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {Tabella} from '../../../../model/tabella/Tabella';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {MenuService} from '../../../../../../services/menu.service';
import {MonitoraggioTransazioniService} from '../../../../../../services/monitoraggio-transazioni.service';
import {SintesiTransazione} from '../../../../model/transazione/SintesiTransazione';
import {ParametriRicercaTransazioni} from '../../../../model/transazione/ParametriRicercaTransazioni';
import {Utils} from '../../../../../../utils/Utils';
import * as moment from 'moment';

@Component({
  selector: 'app-monitoraggio-transazioni',
  templateUrl: './monitoraggio-transazioni.component.html',
  styleUrls: ['./monitoraggio-transazioni.component.scss']
})
export class MonitoraggioTransazioniComponent extends GestisciElementoComponent implements OnInit {

  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private menuService: MenuService, private monitoraggioTransazioniService: MonitoraggioTransazioniService) {
    super(router, activatedRoute, http, amministrativoService);

    this.route.queryParams.subscribe(params => {
      if (params.flussoRendicontazione) {
        this.flussoRendicontazione = parseInt(params.flussoRendicontazione);
      }
    });
  }

  listaElementi: Array<SintesiTransazione> = new Array<SintesiTransazione>();
  filtriRicerca: ParametriRicercaTransazioni = null;

  flussoRendicontazione = null;

  righeSelezionate: any[];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'id', header: 'ID Transazione', type: tipoColonna.TESTO},
      {field: 'data', header: 'Data Transazione', type: tipoColonna.TESTO},
      {field: 'societa', header: 'Società', type: tipoColonna.LINK},
      {field: 'versante', header: 'Versante (IP/email)', type: tipoColonna.TESTO},
      {field: 'numeroPagamenti', header: 'Numero Pagamenti', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'stato', header: 'Stato', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  // page
  isMenuCarico: boolean;
  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista delle transazioni e filtrarle';
  breadcrumbList = [];

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa PR'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa PD'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Invia notifica al cittadino'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Invia notifica all\'ente'},
  ];

  // TODO aggiungere i 7 TAB

  ngOnInit(): void {
    this.controlloCaricamentoMenu();
  }

  private controlloCaricamentoMenu() {
    this.waitingEmitter.subscribe(() => {

      if (this.amministrativoService.mappaFunzioni) {
        this.isMenuCarico = Object.keys(this.amministrativoService.mappaFunzioni).length > 0;
      }

      if (this.isMenuCarico) {
        this.init();
      } else {
        this.menuService.menuCaricatoEvent.subscribe(() => {
          this.init();
        });
      }
    });
  }

  init() {
    this.inizializzaBreadcrumbs();
    this.inizializzaFiltriRicerca();
    this.popolaListaElementi();
  }

  private inizializzaBreadcrumbs() {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitoraggio Transazioni', link: null}
    ], true);
  }

  private inizializzaFiltriRicerca() {
    this.filtriRicerca = new ParametriRicercaTransazioni();
  }

  callbackPopolaLista() {
  }

  creaRigaTabella(transazione: SintesiTransazione) {
    const iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';
    const linkGestisciSocieta = '/gestisciSocieta?societaId=' + transazione.societaId;

    // TODO valorizzare campo numeroPagamenti con numeroPendenza (numero di dettagli transazione) per transazioneId

    return {
      id: {value: transazione.id},
      data: {value: transazione.dataCreazione ? moment(transazione.dataCreazione).format('DD/MM/YYYY HH:mm:ss') : null},
      societa: Utils.creaLink(transazione.societaNome, linkGestisciSocieta, iconaGruppoUtenti),
      versante: {value: (transazione.versanteIndirizzoIP != null ? transazione.versanteIndirizzoIP + ' ' : null)
          + transazione.emailNotifica != null ? transazione.emailNotifica : null},
      numeroPagamenti: {value: transazione.id},
      importo: {value: transazione.importoTotale},
      stato: {value: transazione.statoTransazione},
    };
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] | any[] {
    return undefined;
  }

  getNumeroRecord(): string {
    return '';
  }

  getObservableFunzioneRicerca(): Observable<any[] | any> {
    return this.monitoraggioTransazioniService.ricercaTransazioni(this.filtriRicerca, this.idFunzione);
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe;
  }

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  dettaglioTransazione(rigaCliccata: any) {
    this.mostraDettaglioElemento('/dettaglioTransazioni', rigaCliccata.id.value);
  }
}
