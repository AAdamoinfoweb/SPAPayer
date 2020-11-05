import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ToolEnum} from '../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {GestisciElementoComponent} from '../../gestisci-elemento.component';
import {Colonna} from '../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../model/tabella/ImmaginePdf';
import {RaggruppamentoTipologiaServizio} from '../../../../model/RaggruppamentoTipologiaServizio';

@Component({
  selector: 'app-raggruppamento-tipologie',
  templateUrl: './raggruppamento-tipologie.component.html',
  styleUrls: ['./raggruppamento-tipologie.component.scss']
})
export class RaggruppamentoTipologieComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista dei raggruppamenti relativi alle tipologie di servizio e filtrarli';

  idFunzione;
  breadcrumbList = [];

  listaRaggruppamentiTipologiaServizio: Array<RaggruppamentoTipologiaServizio> = new Array<RaggruppamentoTipologiaServizio>();
  listaRaggruppamentiIdSelezionati: Array<number> = new Array<number>();

  selectionElementi: any[];

  toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi raggruppamento'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica raggruppamento'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina raggruppamento'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO},
      {field: 'descrizione', header: 'Descrizione', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };
  tempTableData: Tabella = this.tableData;

  isMenuCarico = false;
  waiting = true;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2,
              private el: ElementRef, private menuService: MenuService,
              private confirmationService: ConfirmationService) {
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
      {label: 'Gestisci Anagrafiche', link: null},
      {label: 'Raggruppamento Tipologie', link: null}
    ]);
    this.popolaListaElementi();
  }

  popolaListaElementi() {
    this.listaRaggruppamentiTipologiaServizio = [];

    // TODO richiamare operation ricercaRaggruppamentoTipologiaServizio
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-2 > li'), 'active');
    }
  }

  creaRigaTabella(raggruppamentoTipologiaServizio: RaggruppamentoTipologiaServizio): object {
    // TODO creare e restituire oggetto riga
    return null;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiRaggruppamento');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaRaggruppamento', this.listaRaggruppamentiIdSelezionati[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaRaggruppamentiSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tempTableData, 'Lista Raggruppamenti Tipologie Servizi');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tempTableData, 'Lista Raggruppamenti Tipologie Servizi');
        break;
    }
  }

  eliminaRaggruppamentiSelezionati() {
    // TODO richiamare operation eliminaRaggruppamentoTipologiaServizio
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
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      const rigaFormattata = riga;
      delete rigaFormattata.id;
      rigaFormattata.nome = riga.nome.value;
      rigaFormattata.descrizione = riga.descrizione.value;
      return rigaFormattata;
    });
  }

  onChangeListaElementi(listaRaggruppamentiFiltrati: RaggruppamentoTipologiaServizio[]): void {
    this.tableData.rows.length = 0;
    listaRaggruppamentiFiltrati.forEach(raggrupamentoTipologiaServizio => {
      this.tableData.rows.push(this.creaRigaTabella(raggrupamentoTipologiaServizio));
    });
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.selectionElementi = rowsChecked;
    this.listaRaggruppamentiIdSelezionati = rowsChecked.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaRaggruppamentiIdSelezionati.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaRaggruppamentiIdSelezionati.length === 0;
  }

  mostraDettaglioRaggruppamentoTipologiaServizio(rigaCliccata: any) {
    this.mostraDettaglioElemento('/dettaglioRaggruppamento', rigaCliccata.id.value);
  }

}
