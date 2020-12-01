import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {CampoTipologiaServizioService} from '../../../../../services/campo-tipologia-servizio.service';
import {Tabella} from '../../../model/tabella/Tabella';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {TipologiaServizio} from '../../../model/tipologiaServizio/TipologiaServizio';
import {Utils} from '../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Breadcrumb, SintesiBreadcrumb} from '../../../dto/Breadcrumb';
import {ParametriRicercaTipologiaServizio} from '../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {BannerService} from "../../../../../services/banner.service";

@Component({
  selector: 'app-gestisci-tipologia-servizio',
  templateUrl: './gestisci-tipologia-servizio.component.html',
  styleUrls: ['./gestisci-tipologia-servizio.component.scss']
})
export class GestisciTipologiaServizioComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi Tipologia Servizio'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Tipologia Servizio'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Tipologie Servizio'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa delle tipologie servizi a cui sei abilitato e filtrarle';
  breadcrumbList: Breadcrumb[] = [];
  isMenuCarico: boolean;

  filtriRicerca: ParametriRicercaTipologiaServizio;
  listaElementi: any[];
  righeSelezionate: any[];
  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'codice', header: 'Codice', type: tipoColonna.TESTO},
      {field: 'raggruppamento', header: 'Raggruppamento', type: tipoColonna.TESTO},
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(router: Router, private bannerService: BannerService,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private campoTipologiaServizioService: CampoTipologiaServizioService, private el: ElementRef,
              private menuService: MenuService,
              private confirmationService: ConfirmationService
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
      {label: 'Gestisci Anagrafiche', link: null},
      {label: 'Gestisci Tipologia Servizi', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  callbackPopolaLista() {
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]): Breadcrumb[] {
    return super.inizializzaBreadcrumbList(breadcrumbs);
  }

  creaRigaTabella(tipologiaServizio: TipologiaServizio) {
    const riga = {
      id: {value: tipologiaServizio.id},
      codice: {value: tipologiaServizio.codice},
      raggruppamento: {value: tipologiaServizio.raggruppamentoDescrizione},
      nome: {value: tipologiaServizio.descrizione}
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiTipologia');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaTipologia', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaTipologieServizioSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Tipologie Servizio');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Tipologie Servizio');
        break;
    }
  }

  mostraDettaglioTipologiaServizio(rigaTabella: any) {
    super.mostraDettaglioElemento('/dettaglioTipologia', rigaTabella.id.value);
  }

  eliminaTipologieServizioSelezionate(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.campoTipologiaServizioService.eliminaTipologieServizioSelezionate(this.getListaIdElementiSelezionati(), this.idFunzione).subscribe(() => {
            this.popolaListaElementi();
            this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
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

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.listaElementi.length + ' tipologie servizio';
  }

  getObservableFunzioneRicerca(): Observable<any[]> {
    return this.campoTipologiaServizioService.recuperaTipologieServizio(this.filtriRicerca, this.idFunzione);
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      delete riga.id;
      riga.codice = riga.codice.value;
      riga.raggruppamento = riga.raggruppamento.value;
      riga.nome = riga.nome.value;
      return riga;
    });
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.righeSelezionate.length === 0;
  }

}
