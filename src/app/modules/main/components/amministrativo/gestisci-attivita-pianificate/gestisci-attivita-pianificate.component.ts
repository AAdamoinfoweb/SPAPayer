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
import {SintesiAttivitaPianificata} from '../../../model/attivitapianificata/SintesiAttivitaPianificata';
import {AttivitaPianificataService} from '../../../../../services/attivita-pianificata.service';
import * as moment from 'moment';

@Component({
  selector: 'app-gestisci-attivita-pianificate',
  templateUrl: './gestisci-attivita-pianificate.component.html',
  styleUrls: ['./gestisci-attivita-pianificate.component.scss']
})
export class GestisciAttivitaPianificateComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa delle attività pianificate già presenti in Payer e filtrarle';

  idFunzione;

  breadcrumbList = [];

  listaElementi: Array<SintesiAttivitaPianificata> = new Array<SintesiAttivitaPianificata>();
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
              private menuService: MenuService, private confirmationService: ConfirmationService,
              private attivitaPianificataService: AttivitaPianificataService) {
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
    this.inizializzaFiltriRicerca();
    this.popolaListaElementi();
  }

  private inizializzaFiltriRicerca() {
    this.filtriRicerca = new ParametriRicercaStatistiche();
    this.filtriRicerca.avvioSchedulazione = null;
    this.filtriRicerca.fineSchedulazione = null;
    this.filtriRicerca.attiva = null;
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(attivitaPianificata: SintesiAttivitaPianificata) {
    return {
      id: {value: attivitaPianificata.id},
      iconaAttivitaAttiveSchedulate: Utils.creaIcona('#it-clock', '#EF8157',
        'Attiva e schedulata', this.isAttivitaAttiva(attivitaPianificata) ? 'inline' : 'none'),
      titolo: {value: attivitaPianificata.titolo},
      descrizione: {value: attivitaPianificata.descrizione},
      inizio: {value: attivitaPianificata.avvioSchedulazione
          ? moment(attivitaPianificata.avvioSchedulazione).format(Utils.FORMAT_DATE_CALENDAR) : null},
      fine: {value: attivitaPianificata.fineSchedulazione
          ? moment(attivitaPianificata.fineSchedulazione).format(Utils.FORMAT_DATE_CALENDAR) : null}
    };
  }

  isAttivitaAttiva(attivitaPianificata: SintesiAttivitaPianificata): boolean {
    const dataSistema = moment();
    const momentInizio = attivitaPianificata.avvioSchedulazione
      ? moment(attivitaPianificata.avvioSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO) : null;
    const momentFine = attivitaPianificata.fineSchedulazione
      ? moment(attivitaPianificata.fineSchedulazione, Utils.FORMAT_LOCAL_DATE_TIME_ISO) : null;
    return attivitaPianificata.abilitato && momentInizio.isSameOrBefore(dataSistema) && momentFine.isSameOrAfter(dataSistema);
  }

  getObservableFunzioneRicerca(): Observable<SintesiAttivitaPianificata[]> {
    return this.attivitaPianificataService.ricercaAttivitaPianificate(this.filtriRicerca, this.idFunzione);
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
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    const iconaAttivitaAttivaSchedulata = new ImmaginePdf();
    iconaAttivitaAttivaSchedulata.indiceColonna = 0;
    iconaAttivitaAttivaSchedulata.srcIcona = 'assets/img/active-statistic-or-activity.png';
    iconaAttivitaAttivaSchedulata.posizioneX = 3;
    iconaAttivitaAttivaSchedulata.posizioneY = 1;
    iconaAttivitaAttivaSchedulata.larghezza = 18;
    iconaAttivitaAttivaSchedulata.altezza = 19;
    return [iconaAttivitaAttivaSchedulata];
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      const rigaFormattata = riga;
      delete rigaFormattata.id;
      rigaFormattata.iconaAttivitaAttiveSchedulate = riga.iconaAttivitaAttiveSchedulate.display === 'none' ? 'DISABILITATA' : 'ATTIVA';
      rigaFormattata.titolo = riga.titolo.value;
      rigaFormattata.descrizione = riga.descrizione.value;
      rigaFormattata.inizio = riga.inizio.value;
      rigaFormattata.fine = riga.fine.value;
      return rigaFormattata;
    });
  }

  getNumeroRecord(): string {
    const map: Map<string, number> = this.calcolaNumeroAttivitaAttiveDisabilitate();
    return `Totale: ${this.listaElementi.length} \b Di cui attive: ${map.get('attive')} \b Di cui disabilitate: ${map.get('disabilitate')}`;
  }

  private calcolaNumeroAttivitaAttiveDisabilitate(): Map<string, number> {
    const map: Map<string, number> = new Map<string, number>();
    const attive = this.listaElementi.filter((attivitaPianificata: SintesiAttivitaPianificata) => this.isAttivitaAttiva(attivitaPianificata));
    const disabilitate = this.listaElementi.filter((attivitaPianificata: SintesiAttivitaPianificata) => !(this.isAttivitaAttiva(attivitaPianificata)));
    map.set('attive', attive.length);
    map.set('disabilitate', disabilitate.length);
    return map;
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
