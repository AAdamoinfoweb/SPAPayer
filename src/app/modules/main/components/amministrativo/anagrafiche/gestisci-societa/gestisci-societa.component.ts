import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import 'jspdf-autotable';
import {ActivatedRoute, Router} from '@angular/router';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Societa} from '../../../../model/Societa';
import {SocietaService} from '../../../../../../services/societa.service';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {Utils} from '../../../../../../utils/Utils';
import {Tabella} from '../../../../model/tabella/Tabella';
import {MenuService} from '../../../../../../services/menu.service';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {ConfirmationService} from 'primeng/api';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {BannerService} from '../../../../../../services/banner.service';

@Component({
  selector: 'app-gestione-societa',
  templateUrl: './gestisci-societa.component.html',
  styleUrls: ['./gestisci-societa.component.scss']
})
export class GestisciSocietaComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa delle società a cui sei abilitato e filtrarle';
  readonly iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestisciUtenti = '/gestisciUtenti';

  breadcrumbList = [];

  isMenuCarico = false;

  listaElementi: Array<Societa> = new Array<Societa>();
  filtriRicerca: number = null;

  righeSelezionate: any[];

  societaId = null;

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi Società'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Società'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Società'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO},
      {field: 'telefono', header: 'Telefono', type: tipoColonna.TESTO},
      {field: 'email', header: 'Email', type: tipoColonna.TESTO},
      {field: 'utentiAbilitati', header: 'Utenti abilitati', type: tipoColonna.LINK}
    ],
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private societaService: SocietaService, private el: ElementRef,
              private menuService: MenuService,
              private confirmationService: ConfirmationService, private bannerService: BannerService
              ) {
    super(router, route, http, amministrativoService);

    this.route.queryParams.subscribe(params => {
      if (params.societaId) {
        this.societaId = parseInt(params.societaId);
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
      {label: 'Gestisci Società', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(societa: Societa): object {
    const linkGestioneUtenti = this.funzioneGestisciUtenti
      + '?societaId=' + societa.id;

    const riga = {
      id: {value: societa.id},
      nome: {value: societa.nome},
      telefono: {value: societa.telefono},
      email: {value: societa.email},
      utentiAbilitati: Utils.creaLink(null, linkGestioneUtenti, this.iconaGruppoUtenti)
    };
    return riga;
  }

  getObservableFunzioneRicerca(): Observable<Societa[]> {
    return this.societaService.ricercaSocieta(this.filtriRicerca, this.idFunzione);
  }

  callbackPopolaLista() {}

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiSocieta');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaSocieta', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaSocietaSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Societa');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Societa');
        break;
    }
  }

  mostraDettaglioSocieta(rigaTabella) {
    this.mostraDettaglioElemento('/dettaglioSocieta', rigaTabella.id.value);
  }

  eliminaSocietaSelezionate() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.societaService.eliminazioneSocieta(this.getListaIdElementiSelezionati(), this.idFunzione).subscribe(() => {
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

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'utentiAbilitati');
  }

  getRigheFilePdf(righe: any[]) {
    return righe.map(riga => {
      delete riga.utentiAbilitati;
      return riga;
    });
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field !== 'utentiAbilitati');
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      delete riga.utentiAbilitati;
      delete riga.id;
      riga.nome = riga.nome.value;
      riga.telefono = riga.telefono.value;
      riga.email = riga.email.value;
      return riga;
    });
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' società';
  }

  selezionaRigaTabella(righeSelezionate): void {
    this.righeSelezionate = righeSelezionate;
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.righeSelezionate.length === 0;
  }
}
