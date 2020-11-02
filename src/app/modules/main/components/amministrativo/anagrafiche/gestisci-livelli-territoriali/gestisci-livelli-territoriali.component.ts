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
import {GestisciElementoComponent} from "../../gestisci-elemento.component";
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {ConfirmationService} from 'primeng/api';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';

@Component({
  selector: 'app-gestione-livelli-territoriali',
  templateUrl: './gestisci-livelli-territoriali.component.html',
  styleUrls: ['./gestisci-livelli-territoriali.component.scss']
})
export class GestisciLivelliTerritorialiComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa dei livelli territoriali a cui sei abilitato e filtrarli';
  readonly iconaGruppoEnti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestioneEnti = '/enti';

  breadcrumbList = [];

  isMenuCarico = false;

  selectionElementi: any[];

  listaLivelliTerritoriali: Array<LivelloTerritoriale> = new Array<LivelloTerritoriale>();
  listaIdLivelliTerritorialiSelezionati: Array<number> = [];

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi Livello Territoriale'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Livello Territoriale'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Livello Territoriale'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO},
      {field: 'entiAbilitati', header: 'Enti abilitati', type: tipoColonna.LINK}
    ],
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData: Tabella;
  waiting = true;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private livelloTerritorialeService: LivelloTerritorialeService, private el: ElementRef,
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
      {label: 'Gestisci Livelli Territoriali', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  popolaListaElementi() {
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
        this.aggiungiElemento('/aggiungiLivelloTerritoriale');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaLivelloTerritoriale', this.listaIdLivelliTerritorialiSelezionati[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaLivelliTerritorialiSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tempTableData, 'Lista Livelli Territoriali');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tempTableData, 'Lista Livelli Territoriali');
        break;
    }
    this.selectionElementi = [];
  }

  mostraDettaglioLivelloTerritoriale(rigaTabella) {
    this.mostraDettaglioElemento('/dettaglioLivelloTerritoriale', rigaTabella.id.value);
    // this.mostraDettaglioElemento('/dettaglioLivelloTerritoriale', 2);
  }

  eliminaLivelliTerritorialiSelezionati() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.livelloTerritorialeService.eliminazioneLivelliTerritoriali(this.listaIdLivelliTerritorialiSelezionati, this.amministrativoService.idFunzione).subscribe(() => {
            this.popolaListaElementi();
            this.toolbarIcons[this.indiceIconaModifica].disabled = true;
            this.toolbarIcons[this.indiceIconaElimina].disabled = true;
          });
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'entiAbilitati');
  }

  getRigheFilePdf(righe: any[]) {
    return righe.map(riga => {
      delete riga.entiAbilitati;
      return riga;
    });
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      delete riga.entiAbilitati;
      delete riga.id;
      riga.nome = riga.nome.value;
      return riga;
    });
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field != 'entiAbilitati');
  }

  onChangeListaElementi(listaLivelliTerritorialiFiltrati: LivelloTerritoriale[]): void {
    this.tableData.rows.length = 0;
    listaLivelliTerritorialiFiltrati.forEach(livelloTerritoriale => {
      this.tableData.rows.push(this.creaRigaTabella(livelloTerritoriale));
    });
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + (this.tableData.rows.length === 1 ? ' livello territoriale' : ' livelli territoriali');
  }

  selezionaRigaTabella(righeSelezionate): void {
    this.selectionElementi = righeSelezionate;
    this.listaIdLivelliTerritorialiSelezionati = righeSelezionate.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaIdLivelliTerritorialiSelezionati.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaIdLivelliTerritorialiSelezionati.length === 0;
  }

}
