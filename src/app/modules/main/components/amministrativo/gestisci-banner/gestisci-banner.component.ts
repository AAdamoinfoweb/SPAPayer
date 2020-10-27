import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {AmministrativoParentComponent} from '../amministrativo-parent.component';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {Breadcrumb} from '../../../dto/Breadcrumb';
import {OverlayService} from '../../../../../services/overlay.service';
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
import * as _ from 'lodash';
import {MenuService} from '../../../../../services/menu.service';
import {GestisciElementoComponent} from "../gestisci-elemento.component";
import {ConfirmationService} from 'primeng/api';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Colonna} from '../../../model/tabella/Colonna';

@Component({
  selector: 'app-gestisci-banner',
  templateUrl: './gestisci-banner.component.html',
  styleUrls: ['./gestisci-banner.component.scss']
})
export class GestisciBannerComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei banner presenti in Payer e filtrarli';

  breadcrumbList = [];

  listaBanner: Array<Banner> = new Array<Banner>();
  listaBannerIdSelezionati: Array<number> = new Array<number>();

  toolbarIcons = [
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
      {field: 'iconaBanner', header: '', type: tipoColonna.ICONA},
      {field: 'titolo', header: 'Titolo', type: tipoColonna.TESTO},
      {field: 'testo', header: 'Testo', type: tipoColonna.TESTO},
      {field: 'inizio', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fine', header: 'Fine', type: tipoColonna.TESTO},
    ],
    dataKey: 'titolo.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };
  tempTableData = this.tableData;

  isMenuCarico = false;
  waiting = true;

  constructor(router: Router, route: ActivatedRoute, http: HttpClient,
              amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
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
    this.popolaListaBanner();
  }

  popolaListaBanner(): void {
    this.listaBanner = [];
    const parametriRicercaBanner = new ParametriRicercaBanner();

    this.bannerService.ricercaBanner(parametriRicercaBanner, this.amministrativoService.idFunzione).subscribe(listaBanner => {
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
    const dataTable = JSON.parse(JSON.stringify(this.tempTableData));
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiBanner');
        break;
      case ToolEnum.UPDATE:
        // TODO this.modificaBannerSelezionato(dataTable);
        break;
      case ToolEnum.DELETE:
        this.eliminaBannerSelezionati();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(dataTable);
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(dataTable, 'Banner');
        break;
    }
  }

  eliminaBannerSelezionati(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.bannerService.eliminaBanner(this.listaBannerIdSelezionati, this.amministrativoService.idFunzione).pipe(map(() => {
            this.popolaListaBanner();
            this.toolbarIcons[this.indiceIconaModifica].disabled = true;
            this.toolbarIcons[this.indiceIconaElimina].disabled = true;
          })).subscribe();
        },
        TipoModaleEnum.ELIMINA
      )
    );
  }

  esportaTabellaInFilePdf(dataTable: any): void {
    const iconaBannerAttivo = new ImmaginePdf();
    iconaBannerAttivo.indiceColonna = 0;
    iconaBannerAttivo.srcIcona = 'assets/img/active-banner.png';
    iconaBannerAttivo.posizioneX = 2;
    iconaBannerAttivo.posizioneY = 2;
    iconaBannerAttivo.larghezza = 9;
    iconaBannerAttivo.altezza = 17;
    Utils.esportaTabellaInFilePdf(dataTable, 'Lista Banner', [iconaBannerAttivo]);
  }

  getRigheFileExcel(righe: any[]) {
    // TODO implementa get righe excel
    return null;
  }

  getColonneFileExcel(colonne: Colonna[]) {
    // TODO implementa get header excel
    return null;
  }

  onChangeListaBanner(listaBannerFiltrati: Banner[]): void {
    this.tableData.rows.length = 0;
    listaBannerFiltrati.forEach(banner => {
      this.tableData.rows.push(this.creaRigaTabella(banner));
    });
  }

  getTotaliPerRecord(): string {
    return 'Totale: ' + this.tableData.rows.length;
  }

  selezionaRigaTabella(rowsChecked): void {
    this.listaBannerIdSelezionati = rowsChecked.map(riga => riga.id.value);
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.listaBannerIdSelezionati.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.listaBannerIdSelezionati.length === 0;
  }

  mostraDettaglioBanner(row: any) {
    // TODO logica visualizzazione dettaglio banner
  }

}
