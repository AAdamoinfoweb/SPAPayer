import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ParametriRicercaBanner} from '../../../model/banner/ParametriRicercaBanner';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {Banner} from '../../../model/banner/Banner';
import * as moment from 'moment';
import {Utils} from '../../../../../utils/Utils';
import {BannerService} from '../../../../../services/banner.service';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {MenuService} from '../../../../../services/menu.service';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ConfirmationService} from 'primeng/api';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {Tabella} from '../../../model/tabella/Tabella';

@Component({
  selector: 'app-gestisci-banner',
  templateUrl: './gestisci-banner.component.html',
  styleUrls: ['./gestisci-banner.component.scss']
})
export class GestisciBannerComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {
  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei banner presenti in Payer e filtrarli';

  idFunzione;

  breadcrumbList = [];

  listaBanner: Array<Banner> = new Array<Banner>();
  listaBannerIdSelezionati: Array<number> = new Array<number>();

  selectionElementi: any[];

  toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi Banner'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Banner'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Banner'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];

  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'iconaBanner', header: '', type: tipoColonna.ICONA},
      {field: 'titolo', header: 'Titolo', type: tipoColonna.TESTO},
      {field: 'testo', header: 'Testo', type: tipoColonna.TESTO},
      {field: 'inizio', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fine', header: 'Fine', type: tipoColonna.TESTO},
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };
  tempTableData: Tabella = this.tableData;

  isMenuCarico = false;
  waiting = true;

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private bannerService: BannerService, private menuService: MenuService,
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
      {label: 'Gestisci Banner', link: null}
    ]);
    this.popolaListaElementi();
  }

  popolaListaElementi(): void {
    this.listaBanner = [];
    const parametriRicercaBanner = new ParametriRicercaBanner();

    this.bannerService.ricercaBanner(parametriRicercaBanner, this.idFunzione).subscribe(listaBanner => {
      this.tableData.rows = [];
      listaBanner.forEach(banner => {
        this.listaBanner.push(banner);
        this.tableData.rows.push(this.creaRigaTabella(banner));
      });
      this.tempTableData = Object.assign({}, this.tableData);
      this.waiting = false;
    });
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  creaRigaTabella(banner: Banner): object {
    const dataSistema = moment();
    const isBannerAttivo = banner.attivo && (banner.inizio ? moment(banner.inizio) <= dataSistema : false)
      && (banner.fine ? moment(banner.fine) >= dataSistema : false);
    let row;

    row = {
      id: {value: banner.id},
      iconaBanner: Utils.creaIcona('#it-check', '#008758', null, 'none'),
      titolo: {value: banner.titolo},
      testo: {value: banner.testo},
      inizio: {value: banner.inizio ? moment(banner.inizio).format(Utils.FORMAT_DATE_CALENDAR) : null},
      fine: {value: banner.fine ? moment(banner.fine).format(Utils.FORMAT_DATE_CALENDAR) : null}
    };

    if (isBannerAttivo) {
      row.iconaBanner = Utils.creaIcona('#it-check', '#008758', null, 'inline');
    }

    return row;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiBanner');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaBanner', this.listaBannerIdSelezionati[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaBannerSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tempTableData, 'Lista Banner');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tempTableData, 'Lista Banner');
        break;
    }
  }

  eliminaBannerSelezionati(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.bannerService.eliminaBanner(this.listaBannerIdSelezionati, this.idFunzione).pipe(map(() => {
            this.popolaListaElementi();
            this.toolbarIcons[this.indiceIconaModifica].disabled = true;
            this.toolbarIcons[this.indiceIconaElimina].disabled = true;
          })).subscribe();
          this.selectionElementi = [];
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]) {
   righe.forEach(riga => {
     riga.testo.value = riga.testo.value.replace(/<[^>]+>/g, '').replace('&nbsp;', ' ');
   });

   return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    const iconaBannerAttivo = new ImmaginePdf();
    iconaBannerAttivo.indiceColonna = 0;
    iconaBannerAttivo.srcIcona = 'assets/img/active-banner.png';
    iconaBannerAttivo.posizioneX = 2;
    iconaBannerAttivo.posizioneY = 2;
    iconaBannerAttivo.larghezza = 9;
    iconaBannerAttivo.altezza = 17;
    return [iconaBannerAttivo];
  }

  getColonneFileExcel(colonne: Colonna[]) {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      const rigaFormattata = riga;
      delete rigaFormattata.id;
      rigaFormattata.iconaBanner = riga.iconaBanner.display === 'none' ? 'DISABILITATO' : 'ATTIVO';
      rigaFormattata.titolo = riga.titolo.value;
      rigaFormattata.testo = riga.testo.value;
      rigaFormattata.inizio = riga.inizio.value;
      rigaFormattata.fine = riga.fine.value;
      return rigaFormattata;
    });
  }

  onChangeListaElementi(listaBannerFiltrati: Banner[]): void {
    this.tableData.rows = [];
    listaBannerFiltrati.forEach(banner => {
      this.tableData.rows.push(this.creaRigaTabella(banner));
    });
    this.tempTableData = this.tableData;
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.selectionElementi = rowsChecked;
    this.listaBannerIdSelezionati = rowsChecked.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaBannerIdSelezionati.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaBannerIdSelezionati.length === 0;
  }

  mostraDettaglioBanner(rigaCliccata: any) {
    this.mostraDettaglioElemento('/dettaglioBanner', rigaCliccata.id.value);
  }

}
