import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../../../gestisci-elemento.component';
import {ToolEnum} from '../../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../../services/menu.service';
import {Observable} from 'rxjs';
import {Colonna} from '../../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../../model/tabella/ImmaginePdf';

@Component({
  selector: 'app-iuv-senza-bonifico',
  templateUrl: './iuv-senza-bonifico.component.html',
  styleUrls: ['./iuv-senza-bonifico.component.scss']
})
export class IuvSenzaBonificoComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa di IUV senza bonifico e filtrarli';
  readonly dicituraSx = 'Elenco dei movimenti per i quali non è ancora arrivato il flusso xml da PagoPA da -5 giorni a -250 giorni';
  breadcrumbList = [];

  listaElementi: any[];  // TODO tipo oggetto da definire

  filtriRicerca: any;  // TODO tipo oggetto da definire
  righeSelezionate: any[];

  isMenuCarico = false;

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'transazionePayer', header: 'Transazione Payer', type: tipoColonna.TESTO},
      {field: 'totale', header: 'Totale', type: tipoColonna.IMPORTO},
      {field: 'dataPagamento', header: 'Data pagamento', type: tipoColonna.TESTO},
      {field: 'psp', header: 'PSP', type: tipoColonna.TESTO},
      {field: 'iban', header: 'IBAN', type: tipoColonna.TESTO},
      {field: 'beneficiario', header: 'Beneficiario', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.TEMPLATING
  };

  constructor(router: Router, route: ActivatedRoute, protected http: HttpClient,
              amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService) {
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
      {label: 'Quadratura', link: this.basePath + '/quadratura'},
      {label: 'IUV senza bonifico', link: null}
    ], true);
    this.popolaListaElementi();
  }

  callbackPopolaLista() {
  }

  getObservableFunzioneRicerca(): Observable<any> {
    // TODO invocare operation ricercaIuvSenzaBonifico
    return null;
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista IUV senza bonifico');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista IUV senza bonifico');
        break;
    }
  }

  creaRigaTabella(elemento: any) {
    // TODO creazione riga tabella
    return null;
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    // TODO creazione colonne file excel
    return [];
  }

  getRigheFileExcel(righe: any[]): any[] {
    // TODO creazione righe file excel
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    // TODO creazione colonne file pdf
    return [];
  }

  getRigheFilePdf(righe: any[]): any[] {
    // TODO creazione righe file pdf
    return [];
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    return [];
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' IUV senza bonifico';
  }

}
