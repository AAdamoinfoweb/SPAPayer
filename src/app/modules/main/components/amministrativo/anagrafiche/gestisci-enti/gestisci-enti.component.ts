import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {HttpClient} from '@angular/common/http';
import {AmministrativoParentComponent} from '../../amministrativo-parent.component';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {OverlayService} from '../../../../../../services/overlay.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../services/menu.service';
import {Societa} from '../../../../model/Societa';
import {Breadcrumb} from '../../../../dto/Breadcrumb';
import {GestisciParentComponent} from "../../gestisci-parent.component";
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {Utils} from '../../../../../../utils/Utils';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-gestisci-enti',
  templateUrl: './gestisci-enti.component.html',
  styleUrls: ['./gestisci-enti.component.scss']
})
export class GestisciEntiComponent extends GestisciParentComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa degli enti a cui sei abilitato e filtrarli';
  readonly iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';

  readonly funzioneGestioneUtenti = '/gestioneUtenti';

  breadcrumbList = [];

  isMenuCarico = false;

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
              private renderer: Renderer2, private el: ElementRef,
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
      {label: 'Gestisci Enti', link: null}
      ]);
    this.popolaLista();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  popolaLista() {

    this.waiting = false;
    /* this.societaService.ricercaSocieta(null, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
       this.listaSocieta = listaSocieta;

       this.tableData.rows = [];
       this.listaSocieta.forEach(societa => {
         this.tableData.rows.push(this.creaRigaTabella(societa));
       });
       this.tempTableData = Object.assign({}, this.tableData);
       this.waiting = false;
     });*/
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiEnte();
        break;
      case ToolEnum.UPDATE:
        this.modificaEnteSelezionato();
        break;
      case ToolEnum.DELETE:
        this.eliminaEntiSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf();
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel();
        break;
    }
  }

  onChangeListaSocieta(listaSocietaFiltrate: Societa[]): void {
    this.tableData.rows.length = 0;
    listaSocietaFiltrate.forEach(societa => {
//      this.tableData.rows.push(this.creaRigaTabella(societa));
    });
  }

  private aggiungiEnte() {

  }

  private modificaEnteSelezionato() {

  }

  private esportaTabellaInFilePdf() {

  }

  private esportaTabellaInFileExcel() {

  }

  private eliminaEntiSelezionati() {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          // TODO elimina enti
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }
}
