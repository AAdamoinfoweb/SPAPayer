import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {SocietaService} from '../../../../../services/societa.service';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {Tabella} from '../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';

@Component({
  selector: 'app-monitora-accessi',
  templateUrl: './monitora-accessi.component.html',
  styleUrls: ['./monitora-accessi.component.scss']
})
export class MonitoraAccessiComponent extends GestisciElementoComponent implements OnInit {

  isMenuCarico = false;
  waiting = true;
  breadcrumbList = [];
  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa degli accessi alle funzionalità amministrative e filtrarli';
  listaAccessi = [];

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF},
    {type: ToolEnum.EXPORT_XLS}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Cognome e Nome', type: tipoColonna.TESTO},
      {field: 'funzioniVisitate', header: 'Gruppo Funzioni Visitate', type: tipoColonna.TESTO},
      {field: 'inizioSessione', header: 'Inizio Sessione', type: tipoColonna.TESTO},
      {field: 'fineSessione', header: 'Fine Sessione', type: tipoColonna.TESTO},
      {field: 'durataSessione', header: 'Durata', type: tipoColonna.TESTO}
    ],
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData: Tabella;

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

  init(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitora Accessi', link: null}
    ]);
    this.popolaListaElementi();
  }

  creaRigaTabella(oggetto: any) {
    // TODO implementare metodo
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    // TODO implementare metodo
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    // TODO implementare metodo
    return [];
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    // TODO implementare metodo
    return [];
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    // TODO implementare metodo
    return [];
  }

  getNumeroRecord(): string {
    // TODO implementare metodo
    return '';
  }

  getRigheFileExcel(righe: any[]) {
    // TODO implementare metodo
  }

  getRigheFilePdf(righe: any[]) {
    // TODO implementare metodo
  }

  onChangeListaElementi(listaElementi: any[]): void {
    // TODO implementare metodo
  }

  popolaListaElementi(): void {
    // TODO implementare metodo
    this.waiting = false;
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    // TODO implementare metodo
  }

  mostraDettaglioAccesso(rigaTabella) {
    this.mostraDettaglioElemento('/dettaglioAccesso', rigaTabella.id.value);
  }

}
