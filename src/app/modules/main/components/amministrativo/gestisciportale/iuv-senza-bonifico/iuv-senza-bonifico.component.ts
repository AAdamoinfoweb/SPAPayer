import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
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
import {SintesiIuvSenzaBonifico} from '../../../../model/iuvsenzabonifico/SintesiIuvSenzaBonifico';
import {IuvSenzaBonificoService} from '../../../../../../services/iuv-senza-bonifico.service';
import * as moment from 'moment';
import {FilterService} from 'primeng/api';
import {Utils} from '../../../../../../utils/Utils';

@Component({
  selector: 'app-iuv-senza-bonifico',
  templateUrl: './iuv-senza-bonifico.component.html',
  styleUrls: ['./iuv-senza-bonifico.component.scss']
})
export class IuvSenzaBonificoComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa di IUV senza bonifico e filtrarli';
  readonly dicituraSx = 'Elenco dei movimenti per i quali non è ancora arrivato il flusso xml da PagoPA\nDa -5 giorni a -250 giorni';
  breadcrumbList = [];

  listaElementi: Array<SintesiIuvSenzaBonifico> = new Array<SintesiIuvSenzaBonifico>();
  filtriRicerca: string = null;

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
      {field: 'totale', header: 'Totale', type: tipoColonna.TESTO},
      {field: 'dataPagamento', header: 'Data pagamento', type: tipoColonna.TESTO},
      {field: 'psp', header: 'PSP', type: tipoColonna.TESTO},
      {field: 'iban', header: 'IBAN', type: tipoColonna.TESTO},
      {field: 'beneficiario', header: 'Beneficiario', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.TEMPLATING
  };
  righeTemp: any[];

  constructor(router: Router, route: ActivatedRoute, protected http: HttpClient,
              amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService, private iuvSenzaBonificoService: IuvSenzaBonificoService,
              private filterService: FilterService) {
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
      {label: 'IUV senza bonifico', link: null}
    ], true);
    this.popolaListaElementi();
  }

  callbackPopolaLista() {
    this.righeTemp = this.tableData.rows;
  }

  getObservableFunzioneRicerca(): Observable<SintesiIuvSenzaBonifico[]> {
    return this.iuvSenzaBonificoService.ricercaIuvSenzaBonifico(this.idFunzione);
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista IUV senza bonifici');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista IUV senza bonifici');
        break;
    }
  }

  creaRigaTabella(elemento: any) {
    let formatoData;
    let totale = elemento.totale;

    if (elemento.dataPagamento) {
      if (elemento.dataPagamento.includes('T')) {
        formatoData = Utils.FORMAT_LOCAL_DATE_TIME_ISO;
      } else {
        formatoData = 'DD/MM/YYYY HH:mm:ss';
      }
    } else {
      formatoData = null;
    }

    if (totale) {
      if (typeof totale === 'number') {
        totale = '€ ' + String(totale).replace('.', ',');
      } else {
        totale = String(totale).replace('.', ',');
      }
    } else {
      totale = null;
    }

    return {
      iuv: {value: elemento.iuv},
      transazionePayer: {value: elemento.transazionePayer},
      totale: {value: totale},
      dataPagamento: {value: elemento.dataPagamento ? moment(elemento.dataPagamento, formatoData).format('DD/MM/YYYY HH:mm:ss') : null},
      psp: {value: elemento.psp},
      iban: {value: elemento.iban},
      beneficiario: {value: elemento.beneficiario}
    };
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return this.getRigheFormattate(righe);
  }

  getRigheFormattate(righe: any[], areRigheForExcelFile: boolean = true): any[] {
    return righe.map(riga => {
      const totale = riga.totale.value;
      riga.iuv = riga.iuv.value;
      riga.transazionePayer = riga.transazionePayer.value;
      if (totale) {
        if (areRigheForExcelFile) {
          riga.totale = this.convertImportoStringIntoNumber(totale);
        } else {
          riga.totale = totale;
        }
      } else {
        riga.totale = null;
      }
      riga.dataPagamento = riga.dataPagamento.value;
      riga.psp = riga.psp.value;
      riga.iban = riga.iban.value;
      riga.beneficiario = riga.beneficiario.value;
      return riga;
    });
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]): any[] {
    righe.forEach(riga => {
      const totale = riga.totale.value;
      if (totale) {
        riga.totale.value = this.convertImportoStringIntoNumber(totale);
      }
    });
    return righe;
  }

  convertImportoStringIntoNumber(value: string): number {
    return +value.slice(2).replace(',', '.');
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    return [];
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' IUV senza bonifico';
  }

  onChangeFiltri(filtro: string) {
    const righe = JSON.parse(JSON.stringify(this.righeTemp));
    let colonne = JSON.parse(JSON.stringify(this.tableData.cols));
    let listaElementiFiltrati = JSON.parse(JSON.stringify(this.listaElementi));

    this.filtriRicerca = filtro;
    this.tableData.rows = [];
    if (filtro) {
      listaElementiFiltrati = [];
      colonne = colonne.map(colonna => colonna.field);
      listaElementiFiltrati = this.filterService.filter(this.getRigheFormattate(righe, false), colonne, this.filtriRicerca, 'contains');
      this.impostaTabella(listaElementiFiltrati);
    } else {
      this.impostaTabella(this.listaElementi);
    }
  }

}
