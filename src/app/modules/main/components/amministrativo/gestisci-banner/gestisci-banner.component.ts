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

@Component({
  selector: 'app-gestisci-banner',
  templateUrl: './gestisci-banner.component.html',
  styleUrls: ['./gestisci-banner.component.scss']
})
export class GestisciBannerComponent extends AmministrativoParentComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi visualizzare la lista completa dei banner presenti in Payer e filtrarli';

  breadcrumbList = [];

  listaBanner: Array<Banner> = new Array<Banner>();

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

  waiting = true;

  constructor(router: Router, overlayService: OverlayService, route: ActivatedRoute, http: HttpClient,
              amministrativoService: AmministrativoService, private renderer: Renderer2, private el: ElementRef,
              private bannerService: BannerService) {
    super(router, overlayService, route, http, amministrativoService);
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Banner', null, null));
  }

  ngOnInit(): void {
    this.waitingEmitter.subscribe((value) => {
      this.waiting = value;
      this.inizializzaBreadcrumbList();

      const parametriRicercaBanner = new ParametriRicercaBanner();
      this.bannerService.ricercaBanner(parametriRicercaBanner, this.amministrativoService.idFunzione).pipe(map(listaBanner => {
        if (listaBanner != null) {
          listaBanner.forEach(banner => {
            this.listaBanner.push(banner);
            this.tableData.rows.push(this.creaRigaTabella(banner));
          });
        }
        this.tempTableData = Object.assign({}, this.tableData);
      })).subscribe();
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
        // TODO this.aggiungiSocieta(dataTable);
        break;
      case ToolEnum.UPDATE:
        // TODO this.modificaSocietaSelezionata(dataTable);
        break;
      case ToolEnum.DELETE:
        // TODO this.eliminaSocietaSelezionate(dataTable);
        break;
      case ToolEnum.EXPORT_PDF:
        // TODO this.esportaTabellaInFilePdf(dataTable);
        break;
      case ToolEnum.EXPORT_XLS:
        // TODO this.esportaTabellaInFileExcel(dataTable);
        break;
    }
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
    this.toolbarIcons[this.indiceIconaModifica].disabled = rowsChecked.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = rowsChecked.length === 0;
  }

  mostraDettaglioBanner(row: any) {
    // TODO logica visualizzazione dettaglio banner
  }

}
