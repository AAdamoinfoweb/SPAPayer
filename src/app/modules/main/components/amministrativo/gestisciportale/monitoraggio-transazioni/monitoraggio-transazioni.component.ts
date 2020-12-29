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
import {TipoTransazioneEnum} from '../../../../../../enums/tipoTransazione.enum';
import {SpinnerOverlayService} from '../../../../../../services/spinner-overlay.service';
import {getStatoTransazioneValue, StatoTransazioneEnum} from '../../../../../../enums/statoTransazione.enum';
import {GestisciPortaleService} from '../../../../../../services/gestisci-portale.service';
import {LivelloIntegrazioneEnum} from '../../../../../../enums/livelloIntegrazione.enum';

@Component({
  selector: 'app-monitoraggio-transazioni',
  templateUrl: './monitoraggio-transazioni.component.html',
  styleUrls: ['./monitoraggio-transazioni.component.scss']
})
export class MonitoraggioTransazioniComponent extends GestisciElementoComponent implements OnInit {

  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private menuService: MenuService, private monitoraggioTransazioniService: MonitoraggioTransazioniService,
              private spinnerOverlayService: SpinnerOverlayService, private gestisciPortaleService: GestisciPortaleService) {
    super(router, activatedRoute, http, amministrativoService);

    this.route.queryParams.subscribe(params => {
      if (params.flussoRendicontazione) {
        this.flussoRendicontazione = parseInt(params.flussoRendicontazione);
      }
      if (params.flussoQuadratura) {
        this.flussoQuadratura = params.flussoQuadratura;
      }
    });
  }

  listaElementi: Array<SintesiTransazione> = new Array<SintesiTransazione>();
  filtriRicerca: ParametriRicercaTransazioni = null;

  flussoRendicontazione = null;
  flussoQuadratura: string = null;

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
    {type: ToolEnum.PRINT_PR, disabled: true, tooltip: 'Stampa PR (Payment Request)'},
    {type: ToolEnum.PRINT_PD, disabled: true, tooltip: 'Stampa PD (Payment Data)'},
    {type: ToolEnum.SEND_NOTIFICATION_TO_CITIZEN, disabled: true, tooltip: 'Invia notifica al cittadino'},
    {type: ToolEnum.SEND_NOTIFICATION_TO_ENTE, disabled: true, tooltip: 'Invia notifica all\'ente'}
  ];
  indiceIconaStampaPR = 2;
  indiceIconaStampaPD = 3;
  indiceIconaInviaNotificaACittadino = 4;
  indiceIconaInviaNotificaAEnte = 5;

  readonly tabs = [
    {value: TipoTransazioneEnum.TUTTE},
    {value: TipoTransazioneEnum.ESEGUITE},
    {value: TipoTransazioneEnum.NON_ESEGUITE},
    {value: TipoTransazioneEnum.RENDICONTATE},
    {value: TipoTransazioneEnum.NON_RENDICONTATE},
    {value: TipoTransazioneEnum.QUADRATE},
    {value: TipoTransazioneEnum.NON_QUADRATE}
  ];
  nomeTabCorrente: TipoTransazioneEnum = TipoTransazioneEnum.TUTTE;

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
    this.onChangeTab(this.nomeTabCorrente);
  }

  creaRigaTabella(transazione: SintesiTransazione) {
    const iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';
    const linkGestisciSocieta = '/gestisciSocieta?societaId=' + transazione.societaId;

    return {
      id: {value: transazione.id},
      data: {value: transazione.dataCreazione ? moment(transazione.dataCreazione).format('DD/MM/YYYY HH:mm:ss') : null},
      societa: Utils.creaLink(transazione.societaNome, linkGestisciSocieta, iconaGruppoUtenti),
      versante: {value: (transazione.versanteIndirizzoIP != null ? transazione.versanteIndirizzoIP + ' ' : null)
          + transazione.emailNotifica != null ? transazione.emailNotifica : null},
      numeroPagamenti: {value: transazione.numeroPendenze},
      importo: {value: transazione.importoTotale},
      stato: {value: transazione.statoTransazione},
      livelloIntegrazioneId: {value: transazione.livelloIntegrazioneId}
    };
  }

  onChangeTab(value: TipoTransazioneEnum) {
    const subscription = this.spinnerOverlayService.spinner$.subscribe();
    this.nomeTabCorrente = value;
    let tabRows = null;

    switch (value) {
      case TipoTransazioneEnum.TUTTE:
        tabRows = this.listaElementi;
        break;
      case TipoTransazioneEnum.ESEGUITE:
        tabRows = this.listaElementi
          .filter(transazione => transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.COMPLETATA_CON_SUCCESSO));
        break;
      case TipoTransazioneEnum.NON_ESEGUITE:
        tabRows = this.listaElementi
          .filter(transazione => transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.CREATA)
            || transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.PENDING)
            || transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.FALLITA));
        break;
      case TipoTransazioneEnum.RENDICONTATE:
        tabRows = this.listaElementi.filter(transazione => transazione.rendicontata === true);
        break;
      case TipoTransazioneEnum.NON_RENDICONTATE:
        tabRows = this.listaElementi.filter(transazione => transazione.rendicontata === false);
        break;
      case TipoTransazioneEnum.QUADRATE:
        tabRows = this.listaElementi.filter(transazione => transazione.quadrata === true);
        break;
      case TipoTransazioneEnum.NON_QUADRATE:
        tabRows = this.listaElementi.filter(transazione => transazione.quadrata === false);
        break;
    }

    this.impostaTabella(tabRows);
    setTimeout(() => subscription.unsubscribe(), 500);
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Transazioni');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Transazioni');
        break;
      case ToolEnum.PRINT_PR:
        this.stampaPaymentRequestInTxtFile(this.getListaIdElementiSelezionati());
        break;
      case ToolEnum.PRINT_PD:
        this.stampaPaymentDataInTxtFile(this.getListaIdElementiSelezionati());
        break;
      case ToolEnum.SEND_NOTIFICATION_TO_CITIZEN:
        this.inviaNotificaACittadino(this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.SEND_NOTIFICATION_TO_ENTE:
        this.inviaNotificaAEnte(this.getListaIdElementiSelezionati()[0]);
        break;
    }
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    return [];
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      const rigaFormattata = riga;
      delete riga.livelloIntegrazioneId;
      rigaFormattata.id = riga.id.value;
      rigaFormattata.data = riga.data.value;
      rigaFormattata.societa = riga.societa.value;
      rigaFormattata.versante = riga.versante.value;
      rigaFormattata.numeroPagamenti = riga.numeroPagamenti.value;
      rigaFormattata.importo = riga.importo.value;
      rigaFormattata.stato = riga.stato.value;
      return rigaFormattata;
    });
  }

  getNumeroRecord(): string {
    const numeroTransazioniEseguite = this.listaElementi
      .filter(transazione => transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.COMPLETATA_CON_SUCCESSO)).length;
    const numeroTransazioniNonEseguite = this.listaElementi
      .filter(transazione => transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.CREATA)
        || transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.PENDING)
        || transazione.statoTransazione === getStatoTransazioneValue(StatoTransazioneEnum.FALLITA)).length;
    const numeroTransazioniRendicontate = this.listaElementi.filter(transazione => transazione.rendicontata === true).length;
    const numeroTransazioniNonRendicontate = this.listaElementi.filter(transazione => transazione.rendicontata === false).length;
    const numeroTransazioniQuadrate = this.listaElementi.filter(transazione => transazione.quadrata === true).length;
    const numeroTransazioniNonQuadrate = this.listaElementi.filter(transazione => transazione.quadrata === false).length;
    return 'Totale ' + this.listaElementi.length + ' transazioni' + '\b\bDi cui eseguite: ' + numeroTransazioniEseguite
      + '\b\bDi cui non eseguite: ' + numeroTransazioniNonEseguite + '\nDi cui rendicontate: ' + numeroTransazioniRendicontate
      + '\b\bDi cui non rendicontate: ' + numeroTransazioniNonRendicontate + '\nDi cui quadrate: ' + numeroTransazioniQuadrate
      + '\b\bDi cui non quadrate: ' + numeroTransazioniNonQuadrate;
  }

  getObservableFunzioneRicerca(): Observable<any[] | any> {
    return this.monitoraggioTransazioniService.ricercaTransazioni(this.filtriRicerca, this.idFunzione);
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;

    if (righeSelezionate.length !== 0
      && righeSelezionate.every(riga => riga.livelloIntegrazioneId.value === LivelloIntegrazioneEnum.LV1)) {
      this.toolbarIcons[this.indiceIconaStampaPD].disabled = false;
      this.toolbarIcons[this.indiceIconaStampaPR].disabled = false;
    } else {
      this.toolbarIcons[this.indiceIconaStampaPD].disabled = true;
      this.toolbarIcons[this.indiceIconaStampaPR].disabled = true;
    }

    if (righeSelezionate.length === 1) {
      if (righeSelezionate[0].stato.value === getStatoTransazioneValue(StatoTransazioneEnum.COMPLETATA_CON_SUCCESSO)) {
        this.toolbarIcons[this.indiceIconaInviaNotificaACittadino].disabled = false;
      }
      if (righeSelezionate[0].livelloIntegrazioneId.value === LivelloIntegrazioneEnum.LV1) {
        this.toolbarIcons[this.indiceIconaInviaNotificaAEnte].disabled = false;
      }
    } else {
      this.toolbarIcons[this.indiceIconaInviaNotificaACittadino].disabled = true;
      this.toolbarIcons[this.indiceIconaInviaNotificaAEnte].disabled = true;
    }
  }

  stampaPaymentRequestInTxtFile(listaTransazioniId: Array<number>): void {
    this.gestisciPortaleService.stampaPR(listaTransazioniId, this.idFunzione).subscribe(listaPR => {
      listaPR.forEach((pr, index) => {
        if (pr) {
          Utils.downloadBase64ToTxtFile(pr, 'pr_' + index);
        }
      });
    });
  }

  stampaPaymentDataInTxtFile(listaTransazioniId: Array<number>): void {
    this.gestisciPortaleService.stampaPD(listaTransazioniId, this.idFunzione).subscribe(listaPD => {
      listaPD.forEach((pd, index) => {
        if (pd) {
          Utils.downloadBase64ToTxtFile(pd, 'pd_' + index);
        }
      });
    });
  }

  inviaNotificaACittadino(transazioneId: number): void {
    this.gestisciPortaleService.inviaNotificaCittadino(transazioneId, this.idFunzione).subscribe();
  }

  inviaNotificaAEnte(transazioneId: number): void {
    this.gestisciPortaleService.inviaNotificaEnte(transazioneId, this.idFunzione).subscribe();
  }

  dettaglioTransazione(rigaCliccata: any) {
    this.mostraDettaglioElemento('/dettaglioTransazioni', rigaCliccata.id.value);
  }
}
