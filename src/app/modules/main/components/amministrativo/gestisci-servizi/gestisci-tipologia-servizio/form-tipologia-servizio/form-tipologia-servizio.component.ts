import {ChangeDetectorRef, Component, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {CampoTipologiaServizio} from '../../../../../model/CampoTipologiaServizio';
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
import {flatMap, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {ConfiguratoreCampiNuovoPagamento} from '../../../../../model/campo/ConfiguratoreCampiNuovoPagamento';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-form-tipologia-servizio',
  templateUrl: './form-tipologia-servizio.component.html',
  styleUrls: ['./form-tipologia-servizio.component.scss']
})
export class FormTipologiaServizioComponent extends FormElementoParentComponent implements OnInit {

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public items: CampoTipologiaServizio[] = [];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  waiting = false;

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
  private listaDipendeDa: CampoTipologiaServizio[];
  private refreshItemsEvent: EventEmitter<any> = new EventEmitter<any>();
  private tipoCampoIdSelect: number;

  codiceTipologia: string;
  nomeTipologia: string;
  private listaTipiCampo: any[];

  constructor(
    private cdr: ChangeDetectorRef,
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

  ngOnInit() {
    this.amministrativoService.salvaCampoFormEvent.subscribe((campoForm: CampoTipologiaServizio) => {
      let campoFormIdx = this.items.findIndex((value: CampoTipologiaServizio) => value.uuid && campoForm.uuid && value.uuid == campoForm.uuid);
      if (campoFormIdx != -1) {
        this.items[campoFormIdx] = campoForm;
      } else {
        campoForm.uuid = uuidv4();
        this.items.push(campoForm);
        this.cdr.detectChanges();
      }
      this.overlayService.mostraModaleDettaglioEvent.emit(null);
    });
    this.refreshItemsEvent.subscribe((items) => {
      this.listaDipendeDa = items.filter((value => value.tipoCampoId === this.tipoCampoIdSelect));
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
    let observable: Observable<number> = this.campoTipologiaServizioService.letturaConfigurazioneCampiNuovoPagamento(this.idFunzione)
      .pipe(map((configuratore: ConfiguratoreCampiNuovoPagamento) => {
        localStorage.setItem('listaCampiDettaglioTransazione', JSON.stringify(configuratore.listaCampiDettaglioTransazione));
        localStorage.setItem('listaControlliLogici', JSON.stringify(configuratore.listaControlliLogici));
        localStorage.setItem('listaTipologiche', JSON.stringify(configuratore.listaTipologiche));
        localStorage.setItem('listaJsonPath', JSON.stringify(configuratore.listaJsonPath));

        this.listaTipiCampo = configuratore.listaTipiCampo;

        let filter = configuratore.listaTipiCampo.filter((tc => tc.nome === TipoCampoEnum.SELECT));
        if (filter && filter.length > 0)
          this.tipoCampoIdSelect = filter[0].id;

        localStorage.setItem('listaTipiCampo', JSON.stringify(configuratore.listaTipiCampo));
      })).pipe(flatMap(() => obs));
    observable.subscribe();
  }

  caricaCampi(tipologiaServizioId: number): Observable<any> {
    this.waiting = true;
    return this.campoTipologiaServizioService.campiTipologiaServizio(tipologiaServizioId, this.idFunzione)
      .pipe(map(value => {
        this.items = _.sortBy(value, 'posizione');

        // Nel caso della funzione Aggiungi, i campi vengono copiati da un'altra tipologia servizio, ma andranno ricreati sul db come nuove entità
        if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
          this.items.forEach(campo => {
            campo.id = null;
            campo.uuid = uuidv4();
            if (campo.dipendeDa)
              campo.dipendeDa.id = null;
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
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      this.items.forEach((value, index) => value.posizione = index + 1);

      // let inserimento: InserimentoTipologiaServizio = new InserimentoTipologiaServizio();
      // inserimento.raggruppamentoId = this.filtro.raggruppamentoId;
      // inserimento.codice = this.codiceTipologia;
      // inserimento.nome = this.nomeTipologia;
      // inserimento.listaCampiTipologiaServizio = this.items;
      // this.campoTipologiaServizioService.inserimentoTipologiaServizio(inserimento).subscribe();

      this.resettaFiltri();
    } else if (this.funzione === FunzioneGestioneEnum.MODIFICA) {

    }
  }

  abilitaSalva(): boolean {
    return this.codiceTipologia && this.codiceTipologia != "" && this.nomeTipologia && this.nomeTipologia != "";
  }

  resettaFiltri(): void {
    this.filtro = new ParametriRicercaTipologiaServizio();
  }

  onChangeFiltri(filtri: ParametriRicercaTipologiaServizio) {
    // todo valutare se distruggere i campi attuali se viene deselezionato il raggruppamento e/o il codice

    this.filtro = filtri;

    if (this.filtro.codiceTipologia) {
      this.campoTipologiaServizioService.recuperaTipologieServizio(this.filtro, this.idFunzione).subscribe(listaTipologie => {
        // Con una ricerca di raggruppamento+codice, arriva una sola tipologia, che sarà usata per precaricarne e copiarne i campi
        if (listaTipologie && listaTipologie.length) {
          this.caricaCampi(listaTipologie[0].id).subscribe();
        }
      });
    }
  }

  add() {
    const campoForm = new CampoTipologiaServizio();
    this.refreshItemsEvent.emit(this.items);
    this.showModal(campoForm);
  }

  removeItem(item: CampoTipologiaServizio) {
    if (this.funzione != FunzioneGestioneEnum.DETTAGLIO) {
      this.confirmationService.confirm(
        Utils.getModale(() => {
            this.items.splice(this.items.findIndex((v) => v.id === item.id), 1);
            this.refreshItemsEvent.emit(this.items);
          },
          TipoModaleEnum.ELIMINA,
        )
      );
    }
  }

  calcolaDimensioneCampo(campo: CampoTipologiaServizio): string {
    let classe;

    if (this.decodeTipoCampo(campo.tipoCampoId) === TipoCampoEnum.DATEDDMMYY ||
      this.decodeTipoCampo(campo.tipoCampoId) === TipoCampoEnum.DATEMMYY ||
      this.decodeTipoCampo(campo.tipoCampoId) === TipoCampoEnum.DATEYY) {
      classe = 'col-lg-2 col-md-4 col-xs-6';
    } else if (this.decodeTipoCampo(campo.tipoCampoId) === TipoCampoEnum.INPUT_PREZZO) {
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

  private decodeTipoCampo(tipoCampoId: number): string {
    let find = this.listaTipiCampo.find((value) => value.id = tipoCampoId);
    if (find)
      return find.nome;
    else
      return "";
  }

  dropEvt(event: CdkDragDrop<{ item: CampoTipologiaServizio; index: number }, any>) {
    this.items[event.previousContainer.data.index] = event.container.data.item;
    this.items[event.container.data.index] = event.previousContainer.data.item;
  }

  showModal(item: CampoTipologiaServizio) {
    this.overlayService.mostraModaleDettaglioEvent.emit({
      campoForm: _.cloneDeep(item),
      funzione: this.funzione,
      livelloIntegrazione: this.livelloIntegrazione,
      listaDipendeDa: this.listaDipendeDa
    });
  }
}
