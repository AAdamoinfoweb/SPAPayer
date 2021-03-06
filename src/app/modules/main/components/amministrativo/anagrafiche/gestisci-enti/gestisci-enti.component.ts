import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../services/menu.service';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {Utils} from '../../../../../../utils/Utils';
import {ConfirmationService} from 'primeng/api';
import {Colonna} from '../../../../model/tabella/Colonna';
import {Ente} from '../../../../model/Ente';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {Tabella} from '../../../../model/tabella/Tabella';
import {SintesiEnte} from '../../../../model/ente/SintesiEnte';
import {EnteService} from '../../../../../../services/ente.service';
import {ParametriRicercaEnte} from '../../../../model/ente/ParametriRicercaEnte';
import {Observable} from 'rxjs';
import {Banner} from '../../../../model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../../../../../enums/livelloBanner.enum';

@Component({
  selector: 'app-gestisci-enti',
  templateUrl: './gestisci-enti.component.html',
  styleUrls: ['./gestisci-enti.component.scss']
})
export class GestisciEntiComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa degli enti a cui sei abilitato e filtrarli';
  readonly iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestioneUtenti = '/gestioneUtenti';

  breadcrumbList = [];

  isMenuCarico = false;

  righeSelezionate: any[];

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Inserisci Ente'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Ente'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Ente'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'societa', header: 'Societ??', type: tipoColonna.TESTO},
      {field: 'livelloTerritoriale', header: 'Livello Territoriale', type: tipoColonna.TESTO},
      {field: 'comune', header: 'Comune', type: tipoColonna.TESTO},
      {field: 'provincia', header: 'Provincia', type: tipoColonna.TESTO},
      {field: 'ente', header: 'Ente', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };
  listaElementi: SintesiEnte[] = [];
  filtriRicerca: ParametriRicercaEnte = null;

  enteId = null;
  livelloTerritorialeId = null;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService,
              private confirmationService: ConfirmationService,
              private enteService: EnteService
  ) {
    super(router, route, http, amministrativoService);

    this.route.queryParams.subscribe(params => {
      if (params.enteId) {
        this.enteId = parseInt(params.enteId);
      }
      if (params.livelloTerritorialeId) {
        this.livelloTerritorialeId = parseInt(params.livelloTerritorialeId);
      }
    });
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
      {label: 'Gestisci Enti', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(ente: SintesiEnte): object {
    const riga = {
      id: {value: ente.id},
      societa: {value: ente.nomeSocieta},
      livelloTerritoriale: {value: ente.nomeLivelloTerritoriale},
      comune: {value: ente.comune},
      provincia: {value: ente.provincia},
      ente: {value: ente.nomeEnte}
    };
    return riga;
  }

  getObservableFunzioneRicerca(): Observable<SintesiEnte[]> {
    return this.enteService.ricercaEnti(this.filtriRicerca, this.idFunzione);
  }

  callbackPopolaLista() {
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiEnte');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaEnte', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaEntiSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Enti');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Enti');
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
    return [];
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne;
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      delete riga.id;
      riga.societa = riga.societa.value;
      riga.livelloTerritoriale = riga.livelloTerritoriale.value;
      riga.comune = riga.comune.value;
      riga.provincia = riga.provincia.value;
      riga.ente = riga.ente.value;
      return riga;
    });
  }

  private eliminaEntiSelezionati() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.enteService.eliminaEnti(this.getListaIdElementiSelezionati(), this.idFunzione).subscribe((response) => {
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

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' Enti';
  }

  selezionaRigaTabella(rows: any[]) {
    this.righeSelezionate = rows;

    const mapToolbarIndex = Utils.getMapToolbarIndex(this.toolbarIcons);
    this.toolbarIcons[mapToolbarIndex.get(ToolEnum.UPDATE)].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[mapToolbarIndex.get(ToolEnum.DELETE)].disabled = this.righeSelezionate.length === 0;
  }


  dettaglioEnte(row) {
    this.mostraDettaglioElemento('/dettaglioEnte', row.id.value);
  }
}
