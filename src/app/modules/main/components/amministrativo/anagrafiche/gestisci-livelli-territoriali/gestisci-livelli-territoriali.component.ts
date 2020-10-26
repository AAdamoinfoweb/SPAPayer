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
import {LivelloTerritoriale} from '../../../../model/LivelloTerritoriale';
import {LivelloTerritorialeService} from '../../../../../../services/livelloTerritoriale.service';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {Utils} from '../../../../../../utils/Utils';
import {Tabella} from '../../../../model/tabella/Tabella';
import {MenuService} from '../../../../../../services/menu.service';

@Component({
  selector: 'app-gestione-livelli-territoriali',
  templateUrl: './gestisci-livelli-territoriali.component.html',
  styleUrls: ['./gestisci-livelli-territoriali.component.scss']
})
export class GestisciLivelliTerritorialiComponent extends AmministrativoParentComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa dei livelli territoriali a cui sei abilitato e filtrarli';
  readonly iconaGruppoEnti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestioneEnti = '/enti';

  breadcrumbList = [];

  isMenuCarico = false;

  listaLivelliTerritoriali: Array<LivelloTerritoriale> = new Array<LivelloTerritoriale>();
  listaIdLivelliTerritorialiSelezionati: Array<number> = [];

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
      {field: 'entiAbilitati', header: 'Enti abilitati', type: tipoColonna.LINK}
    ],
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;
  waiting = true;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private livelloTerritorialeService: LivelloTerritorialeService, private el: ElementRef,
              private menuService: MenuService
  ) {
    super(router, route, http, amministrativoService);
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList = [];
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Anagrafiche', null, null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Gestisci Livelli Territoriali', null, null));
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
    this.inizializzaBreadcrumbList();
    this.popolaListaLivelliTerritoriali();
  }

  ngAfterViewInit(): void {
    if (!this.waiting)
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  popolaListaLivelliTerritoriali() {
    this.listaLivelliTerritoriali = [];
    this.livelloTerritorialeService.ricercaLivelliTerritoriali(null, this.amministrativoService.idFunzione).subscribe(listaLivelliTerritoriali => {
      this.listaLivelliTerritoriali = listaLivelliTerritoriali;

      this.tableData.rows = [];
      this.listaLivelliTerritoriali.forEach(livelloTerritoriale => {
        this.tableData.rows.push(this.creaRigaTabella(livelloTerritoriale));
      });
      this.tempTableData = Object.assign({}, this.tableData);
      this.waiting = false;
    });
  }

  creaRigaTabella(livelloTerritoriale: LivelloTerritoriale): object {
    // TODO testare quando sarà pronto gestione enti
    const linkGestioneEnti = this.funzioneGestioneEnti
      + '?funzione=' + btoa(this.amministrativoService.mappaFunzioni[this.funzioneGestioneEnti])
      + '&livelloTerritorialeId=' + livelloTerritoriale.id;

    const riga = {
      id: {value: livelloTerritoriale.id},
      nome: {value: livelloTerritoriale.nome},
      entiAbilitati: Utils.creaLink(null, linkGestioneEnti, this.iconaGruppoEnti)
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiLivelloTerritoriale();
        break;
      case ToolEnum.UPDATE:
        this.modificaLivelloTerritorialeSelezionato();
        break;
      case ToolEnum.DELETE:
        this.eliminaLivelliTerritorialiSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf();
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel();
        break;
    }
  }

  mostraDettaglioLivelloTerritoriale(rigaTabella) {
    // this.router.navigate(['/dettaglioLivelloTerritoriale', rigaTabella.id.value]);
    this.router.navigate(['/dettaglioLivelloTerritoriale', 2]);
  }

  aggiungiLivelloTerritoriale() {
    this.router.navigateByUrl('/aggiungiLivelloTerritoriale');
  }

  modificaLivelloTerritorialeSelezionato() {
    this.router.navigate(['/modificaLivelloTerritoriale', this.listaIdLivelliTerritorialiSelezionati[0]]);
  }

  eliminaLivelliTerritorialiSelezionati() {
    this.livelloTerritorialeService.eliminazioneLivelliTerritoriali(this.listaIdLivelliTerritorialiSelezionati, this.amministrativoService.idFunzione).subscribe(() => {
      this.popolaListaLivelliTerritoriali();
    });
  }

  esportaTabellaInFilePdf(): void {
    const table = JSON.parse(JSON.stringify(this.tempTableData));

    // Rimuovo la colonna enti abilitati dalla stampa del pdf
    table.cols = table.cols.filter (col => col.field != 'entiAbilitati');
    table.rows.forEach(riga => {
      delete riga['entiAbilitati'];
    });

    Utils.esportaTabellaInFilePdf(table, 'Lista Livelli Territoriali', []);
  }

  esportaTabellaInFileExcel(): void {
    const table = JSON.parse(JSON.stringify(this.tempTableData));
    const headerColonne = table.cols.filter(col => col.field != 'entiAbilitati').map(col => col.header);
    const righe = table.rows.map(riga => {
      delete riga.entiAbilitati;
      delete riga.id;
      riga.nome = riga.nome.value;
      return riga;
    });

    const workbook = {Sheets: {'LivelliTerritoriali': null}, SheetNames: []};
    Utils.creaFileExcel(righe, headerColonne, 'LivelliTerritoriali', ['LivelliTerritoriali'], workbook, 'Lista Livelli Territoriali');
  }

  onChangeListaLivelliTerritoriali(listaLivelliTerritorialiFiltrati: LivelloTerritoriale[]): void {
    this.tableData.rows.length = 0;
    listaLivelliTerritorialiFiltrati.forEach(livelloTerritoriale => {
      this.tableData.rows.push(this.creaRigaTabella(livelloTerritoriale));
    });
  }

  getTotaliPerRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + (this.tableData.rows.length === 1 ? ' livello territoriale' : ' livelli territoriali');
  }

  selezionaRigaTabella(righeSelezionate): void {
    this.listaIdLivelliTerritorialiSelezionati = righeSelezionate.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaIdLivelliTerritorialiSelezionati.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaIdLivelliTerritorialiSelezionati.length === 0;
  }

}
