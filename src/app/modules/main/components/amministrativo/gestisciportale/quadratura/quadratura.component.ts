import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Tabella} from '../../../../model/tabella/Tabella';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {QuadraturaService} from '../../../../../../services/quadratura.service';
import {Quadratura} from '../../../../model/quadratura/Quadratura';
import {ParametriRicercaQuadratura} from '../../../../model/quadratura/ParametriRicercaQuadratura';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {TipoQuadraturaEnum} from '../../../../../../enums/TipoQuadraturaEnum';
import {SpinnerOverlayService} from '../../../../../../services/spinner-overlay.service';
import {MenuService} from '../../../../../../services/menu.service';

@Component({
  selector: 'app-quadratura',
  templateUrl: './quadratura.component.html',
  styleUrls: ['./quadratura.component.scss']
})
export class QuadraturaComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa delle quadrature a cui sei abilitato e filtrarle';
  breadcrumbList = [];

  isMenuCarico = false;

  listaElementi: Array<Quadratura> = new Array<Quadratura>();

  filtriRicerca: ParametriRicercaQuadratura = null;
  righeSelezionate: any[];
  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'societa', header: 'Società', type: tipoColonna.TESTO},
      {field: 'ente', header: 'Ente', type: tipoColonna.TESTO},
      {field: 'flussoId', header: 'Id flusso', type: tipoColonna.TESTO},
      {field: 'iban', header: 'IBAN', type: tipoColonna.TESTO},
      {field: 'psp', header: 'PSP', type: tipoColonna.TESTO},
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'dataQuadratura', header: 'Data quadratura', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo flusso', type: tipoColonna.IMPORTO},
      {field: 'iuvTotali', header: 'IUV totali', type: tipoColonna.TESTO},
      {field: 'iuvScartati', header: 'IUV scartati', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tabs = [
    {value: TipoQuadraturaEnum.TUTTI},
    {value: TipoQuadraturaEnum.QUADRATI},
    {value: TipoQuadraturaEnum.NON_QUADRATI}
  ];

  nomeTabCorrente: TipoQuadraturaEnum = TipoQuadraturaEnum.TUTTI;

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  // todo aggiungere icona scarica flusso

  constructor(router: Router,
              route: ActivatedRoute, protected http: HttpClient,
              amministrativoService: AmministrativoService,
              private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService,
              private quadraturaService: QuadraturaService,
              private spinnerOverlayService: SpinnerOverlayService
  ) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
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
      {label: 'Gestisci Portale', link: null},
      {label: 'Quadratura', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  callbackPopolaLista() {
    this.onChangeTab(this.nomeTabCorrente);
  }

  creaRigaTabella(elemento: Quadratura) {
    const riga = {};
    // todo leggi valori da oggetto quadratura e imposta riga tabella
    return riga;
  }

  onChangeTab(value: TipoQuadraturaEnum) {
    const subscription = this.spinnerOverlayService.spinner$.subscribe();
    this.nomeTabCorrente = value;
    let tabRows = null;

    switch (value) {
      case TipoQuadraturaEnum.TUTTI:
        tabRows = this.listaElementi;
        break;
      case TipoQuadraturaEnum.QUADRATI:
        tabRows = this.listaElementi.filter(quadratura => this.isQuadrato(quadratura));
        break;
      case TipoQuadraturaEnum.NON_QUADRATI:
        tabRows = this.listaElementi.filter(quadratura => !this.isQuadrato(quadratura));
        break;
    }

    this.impostaTabella(tabRows);
    setTimeout(() => subscription.unsubscribe(), 500);
  }

  isQuadrato(quadratura: Quadratura): boolean {
    // todo logica controllo quadratura
    return true;
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Quadrature');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Quadrature');
        break;
      // todo logica azione scarica flusso
    }
  }

  mostraDettaglioQuadratura(rigaTabella) {
    this.mostraDettaglioElemento('/dettaglioQuadratura', rigaTabella.id.value);
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    // todo logica file excel
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    // todo logica file pdf
    return [];
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] | any[] {
    // todo logica file pdf
    return undefined;
  }

  getNumeroRecord(): string {
    return '';
  }

  getObservableFunzioneRicerca(): Observable<Quadratura[]> {
    return this.quadraturaService.recuperaQuadrature(this.filtriRicerca, this.idFunzione);
  }

  getRigheFileExcel(righe: any[]): any[] {
    // todo logica file excel
    return [];
  }

  getRigheFilePdf(righe: any[]): any[] {
    // todo logica file pdf
    return [];
  }

  selezionaRigaTabella(righeSelezionate: any[]) {}
}
