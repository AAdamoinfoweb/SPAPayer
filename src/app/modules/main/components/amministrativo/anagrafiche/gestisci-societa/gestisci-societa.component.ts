import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import 'jspdf-autotable';
import {Breadcrumb} from '../../../../dto/Breadcrumb';
import {ActivatedRoute, Router} from '@angular/router';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {OverlayService} from '../../../../../../services/overlay.service';
import {AmministrativoParentComponent} from '../../amministrativo-parent.component';
import {HttpClient} from "@angular/common/http";
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Societa} from '../../../../model/Societa';
import {SocietaService} from '../../../../../../services/societa.service';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {Utils} from '../../../../../../utils/Utils';
import {Tabella} from '../../../../model/tabella/Tabella';
import {MenuService} from '../../../../../../services/menu.service';
import {GestisciParentComponent} from "../../gestisci-parent.component";
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-gestione-societa',
  templateUrl: './gestisci-societa.component.html',
  styleUrls: ['./gestisci-societa.component.scss']
})
export class GestisciSocietaComponent extends GestisciParentComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa delle società a cui sei abilitato e filtrarle';
  readonly iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestioneUtenti = '/gestioneUtenti';

  breadcrumbList = [];

  isMenuCarico = false;

  listaSocieta: Array<Societa> = new Array<Societa>();
  listaIdSocietaSelezionate: Array<number> = [];

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT},
    {type: ToolEnum.UPDATE, disabled: true},
    {type: ToolEnum.DELETE, disabled: true},
    {type: ToolEnum.EXPORT_PDF},
    {type: ToolEnum.EXPORT_XLS}
  ];

  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData = {
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

  tempTableData;
  waiting = true;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private societaService: SocietaService, private el: ElementRef,
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
      {label: 'Gestisci Società', link: null}
    ]);
    this.popolaListaSocieta();
  }

  ngAfterViewInit(): void {
    if (!this.waiting)
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  popolaListaSocieta() {
    this.listaSocieta = [];
    this.societaService.ricercaSocieta(null, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
      this.listaSocieta = listaSocieta;

      this.tableData.rows = [];
      this.listaSocieta.forEach(societa => {
        this.tableData.rows.push(this.creaRigaTabella(societa));
      });
      this.tempTableData = Object.assign({}, this.tableData);
      this.waiting = false;
    });
  }

  creaRigaTabella(societa: Societa): object {
    const linkGestioneUtenti = this.funzioneGestioneUtenti
      + '?funzione=' + btoa(this.amministrativoService.mappaFunzioni[this.funzioneGestioneUtenti])
      + '&societaId=' + societa.id;

    const riga = {
      id: {value: societa.id},
      nome: {value: societa.nome},
      telefono: {value: societa.telefono},
      email: {value: societa.email},
      utentiAbilitati: Utils.creaLink(null, linkGestioneUtenti, this.iconaGruppoUtenti)
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiSocieta();
        break;
      case ToolEnum.UPDATE:
        this.modificaSocietaSelezionata();
        break;
      case ToolEnum.DELETE:
        this.eliminaSocietaSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf();
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel();
        break;
    }
  }

  mostraDettaglioSocieta(rigaTabella) {
    this.router.navigate(['/dettaglioSocieta', rigaTabella.id.value]);
  }

  aggiungiSocieta() {
    this.router.navigateByUrl('/aggiungiSocieta');
  }

  modificaSocietaSelezionata() {
    this.router.navigate(['/modificaSocieta', this.listaIdSocietaSelezionate[0]]);
  }

  eliminaSocietaSelezionate() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.societaService.eliminazioneSocieta(this.listaIdSocietaSelezionate, this.amministrativoService.idFunzione).subscribe(() => {
            this.popolaListaSocieta();
            this.toolbarIcons[this.indiceIconaModifica].disabled = true;
            this.toolbarIcons[this.indiceIconaElimina].disabled = true;
          });
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  esportaTabellaInFilePdf(): void {
    const table = JSON.parse(JSON.stringify(this.tempTableData));

    // Rimuovo la colonna utenti abilitati dalla stampa del pdf
    table.cols = table.cols.filter (col => col.field != 'utentiAbilitati');
    table.rows.forEach(riga => {
      delete riga['utentiAbilitati'];
    });

    Utils.esportaTabellaInFilePdf(table, 'Lista Società', []);
  }

  esportaTabellaInFileExcel(): void {
    const table = JSON.parse(JSON.stringify(this.tempTableData));
    const headerColonne = table.cols.filter(col => col.field != 'utentiAbilitati').map(col => col.header);
    const righe = table.rows.map(riga => {
      delete riga.utentiAbilitati;
      delete riga.id;
      riga.nome = riga.nome.value;
      riga.telefono = riga.telefono.value;
      riga.email = riga.email.value;
      return riga;
    });

    const workbook = {Sheets: {'Societa': null}, SheetNames: []};
    Utils.creaFileExcel(righe, headerColonne, 'Societa', ['Societa'], workbook, 'Lista Societa');
  }

  onChangeListaSocieta(listaSocietaFiltrate: Societa[]): void {
    this.tableData.rows.length = 0;
    listaSocietaFiltrate.forEach(societa => {
      this.tableData.rows.push(this.creaRigaTabella(societa));
    });
  }

  getTotaliPerRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' società';
  }

  selezionaRigaTabella(righeSelezionate): void {
    this.listaIdSocietaSelezionate = righeSelezionate.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaIdSocietaSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaIdSocietaSelezionate.length === 0;
  }

}
