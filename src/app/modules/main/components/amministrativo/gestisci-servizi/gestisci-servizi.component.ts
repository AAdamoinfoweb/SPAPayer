import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Breadcrumb, SintesiBreadcrumb} from '../../../dto/Breadcrumb';
import {Tabella} from '../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {CampoTipologiaServizioService} from '../../../../../services/campo-tipologia-servizio.service';
import {MenuService} from '../../../../../services/menu.service';
import {ConfirmationService} from 'primeng/api';
import {Utils} from '../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../enums/tipoModale.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {ConfiguraServizioService} from '../../../../../services/configura-servizio.service';
import {ParametriRicercaServizio} from '../../../model/servizio/ParametriRicercaServizio';
import {SintesiServizio} from '../../../model/servizio/SintesiServizio';
import {TipoUtenteEnum} from '../../../../../enums/TipoUtente.enum';
import * as moment from 'moment';
import {SpinnerOverlayService} from '../../../../../services/spinner-overlay.service';
import {BannerService} from "../../../../../services/banner.service";

@Component({
  selector: 'app-gestisci-servizi',
  templateUrl: './gestisci-servizi.component.html',
  styleUrls: ['./gestisci-servizi.component.scss']
})
export class GestisciServiziComponent extends GestisciElementoComponent implements OnInit, AfterViewInit {

  readonly toolbarIcons = [
    {type: ToolEnum.INSERT, tooltip: 'Aggiungi Servizio'},
    {type: ToolEnum.UPDATE, disabled: true, tooltip: 'Modifica Servizio'},
    {type: ToolEnum.DELETE, disabled: true, tooltip: 'Elimina Servizio'},
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'}
  ];
  readonly indiceIconaModifica = 1;
  readonly indiceIconaElimina = 2;

  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa dei servizi a cui sei abilitato e filtrarli';
  breadcrumbList: Breadcrumb[] = [];
  isMenuCarico: boolean;

  tabs = [
    {value: TipoUtenteEnum.TUTTI},
    {value: TipoUtenteEnum.ATTIVI},
    {value: TipoUtenteEnum.DISABILITATI}
  ];

  nomeTabCorrente: TipoUtenteEnum = TipoUtenteEnum.TUTTI;

  filtriRicerca: ParametriRicercaServizio;
  listaElementi: any[];
  righeSelezionate: any[];
  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'servizioAttivo', header: '', type: tipoColonna.ICONA},
      {field: 'nome', header: 'Nome', type: tipoColonna.TESTO},
      {field: 'tipologiaServizioDescrizione', header: 'Tipologia', type: tipoColonna.TESTO},
      {field: 'livelloIntegrazioneNome', header: 'Integrazione', type: tipoColonna.TESTO},
      {field: 'enteImpositoreNome', header: 'Ente impositore', type: tipoColonna.TESTO},
      {field: 'enteBeneficiarioNome', header: 'Ente beneficiario', type: tipoColonna.TESTO},
      {field: 'inizioAbilitazione', header: 'Inizio', type: tipoColonna.TESTO},
      {field: 'fineAbilitazione', header: 'Fine', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(router: Router, private bannerService: BannerService,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2,
              private configuraServizioService: ConfiguraServizioService,
              private campoTipologiaServizioService: CampoTipologiaServizioService, private el: ElementRef,
              private menuService: MenuService, private spinnerOverlayService: SpinnerOverlayService,
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
      {label: 'Configura Servizi', link: null}
    ]);
    this.popolaListaElementi();
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    }
  }

  callbackPopolaLista() {
  }

  inizializzaBreadcrumbList(breadcrumbs: SintesiBreadcrumb[]): Breadcrumb[] {
    return super.inizializzaBreadcrumbList(breadcrumbs);
  }

  creaRigaTabella(servizio: SintesiServizio) {
    const riga = {
      id: {value: servizio.id},
      servizioAttivo: Utils.creaIcona('#it-ban', '#ef8157', 'Servizio non attivo', !this.isServizioAbilitato(servizio) ? 'inline' : 'none'),
      nome: {value: servizio.nome},
      tipologiaServizioDescrizione: {value: servizio.tipologiaServizioDescrizione},
      livelloIntegrazioneNome: {value: servizio.livelloIntegrazioneNome},
      enteImpositoreNome: {value: servizio.enteImpositoreNome},
      enteBeneficiarioNome: {value: servizio.enteBeneficiarioNome},
      inizioAbilitazione: {value: servizio.inizioAbilitazione ? moment(servizio.inizioAbilitazione).format('DD/MM/YYYY') : null},
      fineAbilitazione: {value: servizio.fineAbilitazione ? moment(servizio.fineAbilitazione).format('DD/MM/YYYY') : null},
    };
    return riga;
  }

  private isServizioAbilitato(servizio: SintesiServizio) {
    return servizio.servizioAttivo;
  }

  eseguiAzioni(azioneTool) {
    switch (azioneTool) {
      case ToolEnum.INSERT:
        this.aggiungiElemento('/aggiungiServizio');
        break;
      case ToolEnum.UPDATE:
        this.modificaElementoSelezionato('/modificaServizio', this.getListaIdElementiSelezionati()[0]);
        break;
      case ToolEnum.DELETE:
        this.eliminaServiziSelezionate();
        break;
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Servizio');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Servizio');
        break;
    }
  }

  mostraDettaglioTipologiaServizio(rigaTabella: any) {
    super.mostraDettaglioElemento('/dettaglioServizio', rigaTabella.id.value);
  }

  eliminaServiziSelezionate(): void {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.configuraServizioService.eliminaServizioSelezionati(this.getListaIdElementiSelezionati(), this.idFunzione)
            .subscribe((value) => {
              if (!value) {
                this.popolaListaElementi();
                this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
              }
            });
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

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getObservableFunzioneRicerca(): Observable<any[]> {
    return this.configuraServizioService.recuperaServizio(this.filtriRicerca, this.idFunzione);
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne.filter(col => col.field !== 'id');
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      delete riga.id;
      riga.servizioAttivo = riga.servizioAttivo.value;
      riga.nome = riga.nome.value;
      riga.tipologiaServizioDescrizione = riga.tipologiaServizioDescrizione.value;
      riga.livelloIntegrazioneNome = riga.livelloIntegrazioneNome.value;
      riga.enteImpositoreNome = riga.enteImpositoreNome.value;
      riga.enteBeneficiarioNome = riga.enteBeneficiarioNome.value;
      riga.inizioAbilitazione = riga.inizioAbilitazione.value;
      riga.fineAbilitazione = riga.fineAbilitazione.value;
      return riga;
    });
  }

  onChangeTab(value: TipoUtenteEnum) {
    const subscription = this.spinnerOverlayService.spinner$.subscribe();
    this.nomeTabCorrente = value;
    let tabRows = null;

    switch (value) {
      case TipoUtenteEnum.TUTTI:
        tabRows = this.listaElementi;
        break;
      case TipoUtenteEnum.ATTIVI:
        tabRows = this.listaElementi.filter(servizio => this.isServizioAbilitato(servizio));
        break;
      case TipoUtenteEnum.DISABILITATI:
        tabRows = this.listaElementi.filter(servizio => !this.isServizioAbilitato(servizio));
        break;
    }

    this.impostaTabella(tabRows);
    setTimeout(() => subscription.unsubscribe(), 500);
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
    this.toolbarIcons[this.indiceIconaModifica].disabled = this.righeSelezionate.length !== 1;
    this.toolbarIcons[this.indiceIconaElimina].disabled = this.righeSelezionate.length === 0;
  }

  getNumeroRecord(): string {
    const map: Map<string, number> = this.calcolaNumeroAttivitaAttiveDisabilitate();
    return `Totale: ${this.listaElementi.length} \b, di cui ${map.get('attive')} abilitati \b, di cui ${map.get('disabilitate')} disabilitati`;
  }

  private calcolaNumeroAttivitaAttiveDisabilitate(): Map<string, number> {
    const map: Map<string, number> = new Map<string, number>();
    const attive = this.listaElementi.filter((servizio) => this.isServizioAbilitato(servizio));
    const disabilitate = this.listaElementi.filter((servizio) => !(this.isServizioAbilitato((servizio))));
    map.set('attive', attive.length);
    map.set('disabilitate', disabilitate.length);
    return map;
  }
}
