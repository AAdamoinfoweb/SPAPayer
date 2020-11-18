import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Tabella} from '../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utils} from '../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {ParametriRicercaStatistiche} from '../../../model/statistica/ParametriRicercaStatistiche';

@Component({
  selector: 'app-gestisci-attivita-pianificate',
  templateUrl: './gestisci-attivita-pianificate.component.html',
  styleUrls: ['./gestisci-attivita-pianificate.component.scss']
})
export class GestisciAttivitaPianificateComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa delle attività pianificate già presenti in Payer e filtrarle';

  idFunzione;

  breadcrumbList = [];

  listaElementi: Array<any> = new Array<any>();
  filtriRicerca: ParametriRicercaStatistiche = null;

  righeSelezionate: any[];

  toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi attività'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica attività'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina attività'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'iconaAttivitaAttiveSchedulate', header: '', type: tipoColonna.ICONA},
      {field: 'titolo', header: 'Titolo', type: tipoColonna.TESTO},
      {field: 'descrizione', header: 'Descrizione', type: tipoColonna.TESTO},
      {field: 'inizio', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fine', header: 'Fine', type: tipoColonna.TESTO},
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  isMenuCarico = false;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService, private confirmationService: ConfirmationService) {
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
      {label: 'Gestisci Attività', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(oggetto: any) {
    // TODO logica creazione riga tabella
    return null;
  }

  getObservableFunzioneRicerca(): Observable<any[]> {
    // TODO invocare operation di ricercaAttivitaPianificate
    return null;
  }

  callbackPopolaLista() {}

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        // TODO this.aggiungiElemento('/aggiungiAttivita');
        break;
      case ToolEnum.UPDATE:
        // TODO this.modificaElementoSelezionato('/modificaAttivita', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaAttivitaSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Attività');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Attività');
        break;
    }
  }

  eliminaAttivitaSelezionate(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          // TODO invocare operation eliminaAttivitaPianificate
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
    // TODO logica creazione righe da inserire all'interno della tabella del file pdf
    return null;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    // TODO settare posizione dell'immagine da inserire nella riga nel pdf
    return null;
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]) {
    // TODO logica creazione righe file excel
    return null;
  }

  getNumeroRecord(): string {
    // TODO stringa composta da numero totale di attività, numero attività attive, numero attività disabilitate
    return null;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.righeSelezionate = rowsChecked;
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.righeSelezionate.length === 0;
  }

  mostraDettaglioAttivita(rigaCliccata: any) {
    // TODO this.mostraDettaglioElemento('/dettaglioAttivita', rigaCliccata.id.value);
  }

}
