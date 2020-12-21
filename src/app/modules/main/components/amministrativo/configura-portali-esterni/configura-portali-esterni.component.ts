import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Tabella} from '../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {ParametriRicercaConfiguraPortaleEsterno} from '../../../model/configuraportaliesterni/ParametriRicercaConfiguraPortaleEsterno';
import {SintesiConfiguraPortaleEsterno} from '../../../model/configuraportaliesterni/SintesiConfiguraPortaleEsterno';
import {Observable} from 'rxjs';
import {Utils} from '../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {ConfiguraPortaliEsterniService} from '../../../../../services/configura-portali-esterni.service';
import {BannerService} from '../../../../../services/banner.service';

@Component({
  selector: 'app-configura-portali-esterni',
  templateUrl: './configura-portali-esterni.component.html',
  styleUrls: ['./configura-portali-esterni.component.scss']
})
export class ConfiguraPortaliEsterniComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei portali esterni presenti in Payer e filtrarli';

  breadcrumbList = [];

  listaElementi: Array<SintesiConfiguraPortaleEsterno> = new Array<SintesiConfiguraPortaleEsterno>();
  filtriRicerca: ParametriRicercaConfiguraPortaleEsterno = null;

  righeSelezionate: any[];

  toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi portale'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica portale'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina portale'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'codice', header: 'Codice', type: tipoColonna.TESTO},
      {field: 'descrizione', header: 'Descrizione', type: tipoColonna.TESTO},
      {field: 'tipoPortale', header: 'Tipo portale', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  isMenuCarico = false;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService, private confirmationService: ConfirmationService,
              private configuraPortaliEsterniService: ConfiguraPortaliEsterniService, private bannerService: BannerService) {
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
      {label: 'Configura Portali Esterni', link: null}
    ]);
    this.inizializzaFiltriRicerca();
    this.popolaListaElementi();
  }

  private inizializzaFiltriRicerca() {
    this.filtriRicerca = new ParametriRicercaConfiguraPortaleEsterno();
    this.filtriRicerca.codicePortaleEsterno = null;
    this.filtriRicerca.idTipoPortaleEsterno = null;
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(elemento: SintesiConfiguraPortaleEsterno) {
    return {
      codice: {value: elemento.codice},
      descrizione: {value: elemento.descrizione},
      tipoPortale: {value: elemento.tipoPortale},
      id: {value: elemento.id}
    };
  }

  getObservableFunzioneRicerca(): Observable<SintesiConfiguraPortaleEsterno[]> {
    return this.configuraPortaliEsterniService.ricercaPortaliEsterni(this.filtriRicerca, this.idFunzione);
  }

  callbackPopolaLista() {
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiPortaleEsterno');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaPortaleEsterno', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaPortaliEsterniSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Portali Esterni');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Portali Esterni');
        break;
    }
  }

  eliminaPortaliEsterniSelezionati(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.configuraPortaliEsterniService.eliminaPortaleEsterno(this.getListaIdElementiSelezionati(), this.idFunzione)
            .subscribe((response) => {
              if (!(response instanceof HttpErrorResponse)) {
                this.popolaListaElementi();
                this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
              }
            });
          this.righeSelezionate = [];
          this.toolbarIcons[this.indiceIconaModifica].disabled = true;
          this.toolbarIcons[this.indiceIconaElimina].disabled = true;
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]) {
    return righe;
  }

  getImmaginiFilePdf(righe?: any[]): ImmaginePdf[] {
    return [];
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      riga.codice = riga.codice.value;
      riga.descrizione = riga.descrizione.value;
      riga.tipoPortale = riga.tipoPortale.value;
      delete riga.id;
      return riga;
    });
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.listaElementi.length + ' portali esterni';
  }

  selezionaRigaTabella(rowsChecked): void {
    this.righeSelezionate = rowsChecked;
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.righeSelezionate.length === 0;
  }

  mostraDettaglioPortaleEsterno(rigaCliccata: any) {
    this.mostraDettaglioElemento('/dettaglioPortaleEsterno', rigaCliccata.id.value);
  }

}
