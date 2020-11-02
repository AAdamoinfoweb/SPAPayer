import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {HttpClient} from '@angular/common/http';
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
import {SintesiEnte} from "../../../../model/ente/SintesiEnte";
import {EnteService} from "../../../../../../services/ente.service";
import {ParametriRicercaEnte} from "../../../../model/ente/ParametriRicercaEnte";

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

  selectionElementi: any[];

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
      {field: 'societa', header: 'Società', type: tipoColonna.TESTO},
      {field: 'ente', header: 'Ente', type: tipoColonna.TESTO},
      {field: 'livelloTerritoriale', header: 'Livello Territoriale', type: tipoColonna.TESTO},
      {field: 'comune', header: 'Comune', type: tipoColonna.TESTO},
      {field: 'provincia', header: 'Provincia', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };
  listaEnti: SintesiEnte[] = [];
  selectionEnti: any[];
  entiSelezionati: SintesiEnte[];

  waiting = true;

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService,
              private confirmationService: ConfirmationService,
              private enteService: EnteService
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
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  popolaListaElementi() {
    this.waiting = false;
    this.enteService.ricercaEnti(new ParametriRicercaEnte(), this.amministrativoService.idFunzione).subscribe((listaEnti) => {
      this.listaEnti = listaEnti;

      this.tableData.rows = this.listaEnti.map(ente => {
        return this.creaRigaTabella(ente);
      });
      this.waiting = false;
    });
  }

  creaRigaTabella(ente: SintesiEnte): object {
    const riga = {
      id: {value: ente.id},
      societa: {value: ente.nomeSocieta},
      ente: {value: ente.nomeEnte},
      livelloTerritoriale: {value: ente.nomeLivelloTerritoriale},
      comune: {value: ente.comune},
      provincia: {value: ente.provincia}
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiEnte');
        break;
      case ToolEnum.UPDATE:
        // TODO logica modifica dell'ente selezionato
        // this.modificaElementoSelezionato('/modificaEnte', idEnte);
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

  onChangeListaElementi(listaEntiFiltrati: SintesiEnte[]): void {
    this.tableData.rows = listaEntiFiltrati.map(ente => {
      return this.creaRigaTabella(ente);
    });
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    // TODO implementa get colonne pdf
    return [];
  }

  getRigheFilePdf(righe: any[]) {
    // TODO implementa get righe pdf
    return [];
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    // TODO implementa get immagini pdf
    return [];
  }

  getColonneFileExcel(colonne: Colonna[]) {
    // TODO implementa get colonne excel
    return [];
  }

  getRigheFileExcel(righe: any[]) {
    // TODO implementa get righe excel
    return [];
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

  selezionaRigaTabella(righeSelezionate: any[]) {
    // TODO seleziona riga tabella
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' Enti';
  }

  selezionaEnti(rows: any[]) {
    // tslint:disable-next-line:prefer-const
    let tempEntiSelezionati: SintesiEnte[] = [];
    rows.forEach(value => {
      const enteSelezionato: SintesiEnte[] = this.listaEnti
        .filter(ente => ente.id === value.id.value);
      tempEntiSelezionati.push(...enteSelezionato);
    });
    this.selectionEnti = rows;
    this.entiSelezionati = tempEntiSelezionati;

    const indexUpdate = this.toolbarIcons.map(el => el.type).indexOf(ToolEnum.UPDATE)
    const indexDelete = this.toolbarIcons.map(el => el.type).indexOf(ToolEnum.DELETE)
    this.toolbarIcons[indexUpdate].disabled = this.entiSelezionati.length !== 1;
    this.toolbarIcons[indexDelete].disabled = this.entiSelezionati.length === 0;
  }

  dettaglioEnte(row) {
    this.mostraDettaglioElemento('/dettaglioEnte', row.id.value);
  }
}
