import {Component, OnInit} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {Tabella} from '../../../model/tabella/Tabella';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {MenuService} from '../../../../../services/menu.service';
import {StatisticaService} from '../../../../../services/statistica.service';
import {SintesiStatistica} from '../../../model/statistica/SintesiStatistica';
import {Utils} from '../../../../../utils/Utils';
import * as moment from 'moment';
import {ParametriRicercaStatistiche} from '../../../model/statistica/ParametriRicercaStatistiche';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-gestisci-statistiche',
  templateUrl: './gestisci-statistiche.component.html',
  styleUrls: ['./gestisci-statistiche.component.scss']
})
export class GestisciStatisticheComponent extends GestisciElementoComponent implements OnInit {

  constructor(protected router: Router, protected activatedRoute: ActivatedRoute,
              protected http: HttpClient, protected amministrativoService: AmministrativoService,
              private menuService: MenuService, private statisticaService: StatisticaService,
              private confirmationService: ConfirmationService) {
    super(router, activatedRoute, http, amministrativoService);
  }

  filtriRicerca: any;
  idFunzione;
  listaElementi: any[];
  righeSelezionate: any[];
  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'icona', header: '', type: tipoColonna.ICONA},
      {field: 'titolo', header: 'Titolo', type: tipoColonna.TESTO},
      {field: 'descrizione', header: 'Descrizione', type: tipoColonna.TESTO},
      {field: 'avvioSchedulazione', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fineSchedulazione', header: 'Fine', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  // page
  isMenuCarico: boolean;
  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista delle statistica e filtrarle';
  breadcrumbList = [];
  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Inserisci Statistica'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Statistica'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Statistiche'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

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
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Gestisci Statistiche', link: null}
    ]);
    this.inizializzaFiltriRicerca();
    this.popolaListaElementi();
  }

  callbackPopolaLista() {
  }

  creaRigaTabella(statistica: SintesiStatistica) {
    const riga = {
      id: {value: statistica.id},
      icona: Utils.creaIcona('#it-clock', '#ef8157', 'Attiva e schedulata',
        this.isStatisticaAttiva(statistica) ? 'inline' : 'none'),
      titolo: {value: statistica.titolo},
      descrizione: {value: statistica.descrizione},
      avvioSchedulazione: {value: statistica.avvioSchedulazione ?
          moment(statistica.avvioSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO).format(Utils.FORMAT_DATE_CALENDAR) : null},
      fineSchedulazione: {value: statistica.fineSchedulazione ?
          moment(statistica.fineSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO).format(Utils.FORMAT_DATE_CALENDAR) : null}
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiStatistica');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaStatistica', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaStatisticheSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Statistiche');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Statistiche');
        break;
    }
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'id');
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    const iconaStatisticaAttiva = new ImmaginePdf();
    iconaStatisticaAttiva.indiceColonna = 0;
    iconaStatisticaAttiva.srcIcona = 'assets/img/active-statistic-or-activity.png';
    iconaStatisticaAttiva.posizioneX = 1;
    iconaStatisticaAttiva.posizioneY = 1;
    iconaStatisticaAttiva.larghezza = 18;
    iconaStatisticaAttiva.altezza = 19;
    return [iconaStatisticaAttiva];
  }

  getNumeroRecord(): string {
    const map: Map<string, number> = this.calcolaAttivaDisabilitate();
    return `Totale ${this.listaElementi.length} statistiche Di cui attive: ${map.get('attive')} Di cui disabilitate: ${map.get('disabilitate')}`;
  }

  getObservableFunzioneRicerca(): Observable<any[]> {
    return this.statisticaService.ricercaStatistiche(this.filtriRicerca, this.idFunzione);
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      const rigaFormattata = riga;
      delete rigaFormattata.id;
      rigaFormattata.icona = riga.icona.display === 'none' ? 'DISABILITATA' : 'ATTIVA';
      rigaFormattata.titolo = riga.titolo.value;
      rigaFormattata.descrizione = riga.descrizione.value;
      rigaFormattata.avvioSchedulazione = riga.avvioSchedulazione.value;
      rigaFormattata.fineSchedulazione = riga.fineSchedulazione.value;
      return rigaFormattata;
    });
  }

  getRigheFilePdf(righe: any[]) {
    return righe;
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;

    const mapToolbarIndex = Utils.getMapToolbarIndex(this.toolbarIcons);
    this.toolbarIcons[mapToolbarIndex.get(ToolEnum.UPDATE)].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[mapToolbarIndex.get(ToolEnum.DELETE)].disabled = this.righeSelezionate.length === 0;
  }

  dettaglioStatistica(row: any) {
    this.mostraDettaglioElemento('/dettaglioStatistica', row.id.value);
  }

  private eliminaStatisticheSelezionate() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.statisticaService.eliminaStatistiche(this.getListaIdElementiSelezionati(), this.idFunzione).subscribe((response) => {
            if (!(response instanceof HttpErrorResponse)) {
              this.popolaListaElementi();
              this.righeSelezionate = [];
              const mapToolbarIndex = Utils.getMapToolbarIndex(this.toolbarIcons);
              this.toolbarIcons[mapToolbarIndex.get(ToolEnum.UPDATE)].disabled = true;
              this.toolbarIcons[mapToolbarIndex.get(ToolEnum.DELETE)].disabled = true;
            }
          });
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  private isStatisticaAttiva(statistica: SintesiStatistica): boolean {
    const now = moment();
    const momentInzio = statistica.avvioSchedulazione ? moment(statistica.avvioSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO) : null;
    const momentFine = statistica.fineSchedulazione ? moment(statistica.fineSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO) : null;
    return statistica.abilitato && (momentInzio != null && momentInzio.isSameOrBefore(now)) && (momentFine == null || momentFine.isSameOrAfter(now));
  }

  private inizializzaFiltriRicerca() {
    this.filtriRicerca = new ParametriRicercaStatistiche();
    this.filtriRicerca.avvioSchedulazione = null;
    this.filtriRicerca.fineSchedulazione = null;
    this.filtriRicerca.attiva = null;
  }

  private calcolaAttivaDisabilitate(): Map<string, number> {
    const map: Map<string, number> = new Map<string, number>();
    const attive = this.listaElementi.filter((statistica: SintesiStatistica) => this.isStatisticaAttiva(statistica));
    const disabilitate = this.listaElementi.filter((statistica: SintesiStatistica) => !(this.isStatisticaAttiva(statistica)));
    map.set('attive', attive.length);
    map.set('disabilitate', disabilitate.length);
    return map;
  }
}
