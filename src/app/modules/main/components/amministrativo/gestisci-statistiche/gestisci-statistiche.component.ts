import { Component, OnInit } from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {Tabella} from '../../../model/tabella/Tabella';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {Observable, of} from 'rxjs';
import {tipoColonna} from "../../../../../enums/TipoColonna.enum";
import {tipoTabella} from "../../../../../enums/TipoTabella.enum";
import {MenuService} from "../../../../../services/menu.service";

@Component({
  selector: 'app-gestisci-statistiche',
  templateUrl: './gestisci-statistiche.component.html',
  styleUrls: ['./gestisci-statistiche.component.scss']
})
export class GestisciStatisticheComponent extends GestisciElementoComponent implements OnInit {

  constructor(protected router: Router, protected activatedRoute: ActivatedRoute,
              protected http: HttpClient, protected amministrativoService: AmministrativoService,
              private menuService: MenuService) {
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
      {field: 'inizio', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fine', header: 'Fine', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  // page
  isMenuCarico: boolean;
  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista delle statistiche e filtrarle';
  breadcrumbList = [];
  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Inserisci Ente'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Ente'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Ente'},
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
    this.popolaListaElementi();
  }

  callbackPopolaLista() {
  }

  creaRigaTabella(oggetto: any) {
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return [];
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getNumeroRecord(): string {
    return '';
  }

  getObservableFunzioneRicerca(): Observable<any[]> {
    return of([]);
  }

  getRigheFileExcel(righe: any[]) {
  }

  getRigheFilePdf(righe: any[]) {
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
  }

  dettaglioStatistica($event: any) {

  }
}
