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
import {Societa} from '../../../../model/Societa';
import {SocietaService} from '../../../../../../services/societa.service';
import {tipoColonna} from '../../../../../../enums/TipoColonna.enum';

@Component({
  selector: 'app-gestione-societa',
  templateUrl: './gestisci-societa.component.html',
  styleUrls: ['./gestisci-societa.component.scss']
})
export class GestisciSocietaComponent extends AmministrativoParentComponent implements OnInit, AfterViewInit {

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa delle società a cui sei abilitato e filtrarle';

  breadcrumbList = [];

  listaSocieta: Array<Societa> = new Array<Societa>();
  filtroSocieta: string = null;

  toolbarIcons = [
    {type: ToolEnum.INSERT},
    {type: ToolEnum.UPDATE, disabled: true},
    {type: ToolEnum.EXPORT_PDF},
    {type: ToolEnum.EXPORT_XLS}
  ];

  // TODO imposta tableData
  tableData = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO},
      {field: 'telefono', header: 'Telefono', type: tipoColonna.TESTO},
      {field: 'email', header: 'Email', type: tipoColonna.TESTO},
      // {field: 'utentiAbilitati', header: 'Utenti abilitati', type: tipoColonna.LINK}
    ],
    dataKey: 'nome.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;
  waiting = true;

  constructor(router: Router, overlayService: OverlayService,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private societaService: SocietaService, private el: ElementRef
              ) {
    super(router, overlayService, route, http, amministrativoService);
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Anagrafiche', null, null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Societa', null, null));
  }

  ngOnInit(): void {
    this.waitingEmitter.subscribe((value) => {
      this.waiting = value;
      this.inizializzaBreadcrumbList();

      this.societaService.ricercaSocieta(null, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
        this.listaSocieta = listaSocieta;

        // TODO subscribe societaservice

        this.listaSocieta.forEach(societa => {
          this.tableData.rows.push(this.creaRigaTabella(societa));
        });
        this.tempTableData = Object.assign({}, this.tableData);
      });
    });
  }

  ngAfterViewInit(): void {
    if (!this.waiting)
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  creaRigaTabella(societa: Societa): object {
    // TODO aggiungere link utenti abilitati

    const riga = {
      nome: {value: societa.nome},
      telefono: {value: societa.telefono},
      email: {value: societa.email}
    };
    return riga;
  }

  eseguiAzioni(azioneTool) {
    // TODO metodo eseguiAzioni
  }

  esportaTabellaInFilePdf(dataTable: any): void {
    // TODO metodo esportaTabellaInFilePdf
  }

  esportaTabellaInFileExcel(dataTable: any): void {
    // TODO metodo esportaTabellaInFileExcel
  }

  onChangeListaSocieta(listaSocietaFiltrate: Societa[]): void {
    this.tableData.rows.length = 0;
    listaSocietaFiltrate.forEach(societa => {
      this.tableData.rows.push(this.creaRigaTabella(societa));
    });
  }

  getTotaliPerRecord(): string {
    // TODO metodo getTotaliPerRecord
    return null;
  }

  selezionaRigaTabella(rowsChecked): void {
    // TODO metodo selezionaRigaTabella
  }

}
