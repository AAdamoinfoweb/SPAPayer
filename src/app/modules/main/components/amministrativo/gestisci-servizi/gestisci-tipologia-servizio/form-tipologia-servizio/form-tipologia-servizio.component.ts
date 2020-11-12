import {Component, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {CampoForm} from '../../../../../model/CampoForm';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import * as _ from 'lodash';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConfirmationService} from 'primeng/api';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {Utils} from '../../../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../../../enums/tipoModale.enum';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Breadcrumb, SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {LivelloIntegrazioneEnum} from '../../../../../../../enums/livelloIntegrazione.enum';
import {ParametriRicercaTipologiaServizio} from '../../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {subscribeTo} from "rxjs/internal-compatibility";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-form-tipologia-servizio',
  templateUrl: './form-tipologia-servizio.component.html',
  styleUrls: ['./form-tipologia-servizio.component.scss']
})
export class FormTipologiaServizioComponent extends FormElementoParentComponent implements OnInit, OnChanges {

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public items: CampoForm[] = [];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  waiting = true;

  funzione: FunzioneGestioneEnum;

  FunzioneGestioneEnum = FunzioneGestioneEnum;

  titoloPagina: string;
  tooltip: string;

  breadcrumbList: Breadcrumb[] = [];

  readonly lunghezzaMaxCol1: number = 5;
  readonly lunghezzaMaxCol2: number = 10;
  readonly lunghezzaMaxCol3: number = 15;

  showEditId: string;
  filtro: ParametriRicercaTipologiaServizio;
  tipologiaServizioId: number;
  private livelloIntegrazione: LivelloIntegrazioneEnum;
  private listaDipendeDa: CampoForm[];
  private refreshItemsEvent: EventEmitter<any> = new EventEmitter<any>();
  private tipoCampoIdSelect: number;

  constructor(
    private overlayService: OverlayService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected http: HttpClient,
    protected amministrativoService: AmministrativoService,
    private viewportRuler: ViewportRuler,
    protected confirmationService: ConfirmationService,
    private campoTipologiaServizioService: CampoTipologiaServizioService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
    this.target = null;
    this.source = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngOnInit() {
    this.refreshItemsEvent.subscribe((items) => {
      this.listaDipendeDa = items.filter((value => value.tipo_campo_id === this.tipoCampoIdSelect));
    });
  }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioTipologia':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiTipologia':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaTipologia':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.controllaTipoFunzione();
    this.inizializzaBreadcrumb();
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Tipologia Servizio';
    this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una tipologia servizio';

    let obs = of(null);
    if (this.funzione === FunzioneGestioneEnum.MODIFICA || this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      this.tipologiaServizioId = parseInt(this.activatedRoute.snapshot.paramMap.get('tipologiaServizioId'));

      this.campoTipologiaServizioService.recuperaDettaglioTipologiaServizio(this.tipologiaServizioId, this.idFunzione).subscribe(tipologiaServizio => {
        this.filtro = new ParametriRicercaTipologiaServizio();
        this.filtro.raggruppamentoId = tipologiaServizio.raggruppamentoId;

        this.filtro.codiceTipologia = tipologiaServizio.codice;
      });

      obs = this.caricaCampi(this.tipologiaServizioId);
    }
    this.campoTipologiaServizioService.letturaConfigurazioneCampiNuovoPagamento(this.idFunzione)
      .pipe(map((value: any) => {
        localStorage.setItem('listaCampiDettaglioTransazione', JSON.stringify(value.listaCampiDettaglioTransazione));
        localStorage.setItem('listaControlliLogici', JSON.stringify(value.listaControlliLogici));
        localStorage.setItem('listaTipologiche', JSON.stringify(value.listaTipologiche));
        localStorage.setItem('listaJsonPath', JSON.stringify(value.listaJsonPath));

        let filter = value.listaTipiCampo.filter((tc => tc.nome === TipoCampoEnum.SELECT));
        if (filter && filter.length > 0)
          this.tipoCampoIdSelect = filter[0].id;

        localStorage.setItem('listaTipiCampo', JSON.stringify(value.listaTipiCampo));
      })).pipe(map(() => obs)).subscribe();
  }

  caricaCampi(tipologiaServizioId: number): Observable<any> {
    return this.campoTipologiaServizioService.campiTipologiaServizio(tipologiaServizioId, this.idFunzione)
      .pipe(map(value => {
        this.items = _.sortBy(value, 'posizione');

        // Nel caso della funzione Aggiungi, i campi vengono copiati da un'altra tipologia servizio, ma andranno ricreati sul db come nuove entità
        if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
          this.items.forEach(campo => {
            campo.id = null;
            // todo impostare campo.dipendeDa.id = null
          });
        }

        this.refreshItemsEvent.emit(this.items);
        this.waiting = false;
      }));
  }

  inizializzaBreadcrumb(): void {
    const breadcrumbs: SintesiBreadcrumb[] = []
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Tipologie Servizio', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Tipologie Servizio', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  onClickSalva(): void {
    // TODO onclicksalva
  }

  disabilitaBottone(): boolean {
    // todo logica disabilita bottone salva
    return true;
  }

  onChangeFiltri(filtri: ParametriRicercaTipologiaServizio) {
    this.filtro = filtri;

    if (this.filtro.codiceTipologia) {
      this.campoTipologiaServizioService.recuperaTipologieServizio(this.filtro, this.idFunzione).subscribe(listaTipologie => {
        // Con una ricerca di raggruppamento+codice, arriva una sola tipologia, che sarà usata per precaricarne e copiarne i campi
        if (listaTipologie && listaTipologie.length) {
          this.caricaCampi(listaTipologie[0].id);
        }
      });
    }
  }

  add() {
    const campoForm = new CampoForm();
    campoForm.titolo = 'nuovo campo';
    this.items.push(campoForm);
    this.showModal(campoForm);
    this.refreshItemsEvent.emit(this.items);
    //this.showEditId = campoForm.titolo;
  }

  removeItem(item: CampoForm) {
    this.confirmationService.confirm(
      Utils.getModale(() => {
          this.items.splice(this.items.findIndex((v) => v.id === item.id), 1);
          this.refreshItemsEvent.emit(this.items);
        },
        TipoModaleEnum.ELIMINA,
      )
    );
  }

  calcolaDimensioneCampo(campo: CampoForm): string {
    let classe;

    if (campo.tipoCampo === TipoCampoEnum.DATEDDMMYY || campo.tipoCampo === TipoCampoEnum.DATEMMYY || campo.tipoCampo === TipoCampoEnum.DATEYY) {
      classe = 'col-lg-2 col-md-4 col-xs-6';
    } else if (campo.tipoCampo === TipoCampoEnum.INPUT_PREZZO) {
      classe = 'col-lg-2 col-md-4 col-xs-6';
    } else {
      if (campo.lunghezza <= this.lunghezzaMaxCol1) {
        classe = 'col-lg-1 col-md-4 col-xs-6';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol2) {
        classe = 'col-lg-3 col-md-4 col-xs-6';
      } else if (campo.lunghezza <= this.lunghezzaMaxCol3) {
        classe = 'col-lg-4 col-md-5 col-xs-6';
      } else {
        classe = 'col-lg-5 col-md-6 col-xs-6';
      }
    }
    return classe;
  }

  dropEvt(event: CdkDragDrop<{ item: CampoForm; index: number }, any>) {
    this.items[event.previousContainer.data.index] = event.container.data.item;
    this.items[event.container.data.index] = event.previousContainer.data.item;
  }

  showModal(item: CampoForm) {
    this.overlayService.mostraModaleDettaglioEvent.emit({
      campoForm: _.cloneDeep(item),
      funzione: this.funzione,
      livelloIntegrazione: this.livelloIntegrazione,
      listaDipendeDa: this.listaDipendeDa
    });
  }
}
