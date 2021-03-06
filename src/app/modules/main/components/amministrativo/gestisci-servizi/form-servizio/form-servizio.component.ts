import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {OverlayService} from '../../../../../../services/overlay.service';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ViewportRuler} from '@angular/cdk/overlay';
import {ConfirmationService} from 'primeng/api';
import {CampoTipologiaServizioService} from '../../../../../../services/campo-tipologia-servizio.service';
import {Breadcrumb, SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {ParametriRicercaServizio} from '../../../../model/servizio/ParametriRicercaServizio';
import {LivelloIntegrazioneEnum} from '../../../../../../enums/livelloIntegrazione.enum';
import {FormControl, NgModel, ValidatorFn} from '@angular/forms';
import {Societa} from '../../../../model/Societa';
import {SocietaService} from '../../../../../../services/societa.service';
import {catchError, map} from 'rxjs/operators';
import {EnteService} from '../../../../../../services/ente.service';
import {Observable, of} from 'rxjs';
import {ParametriRicercaEnte} from '../../../../model/ente/ParametriRicercaEnte';
import {CampoTipologiaServizio} from '../../../../model/CampoTipologiaServizio';
import {v4 as uuidv4} from 'uuid';
import * as _ from 'lodash';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {ConfiguratoreCampiNuovoPagamento} from '../../../../model/campo/ConfiguratoreCampiNuovoPagamento';
import {ContoCorrente} from '../../../../model/ente/ContoCorrente';
import {DatiContoCorrenteComponent} from '../../anagrafiche/gestisci-enti/dati-conto-corrente/dati-conto-corrente.component';
import {ConfiguraServizioService} from '../../../../../../services/configura-servizio.service';
import {RendicontazioneGiornaliera} from '../../../../model/servizio/RendicontazioneGiornaliera';
import {CampoServizio} from '../../../../model/servizio/CampoServizio';
import {FiltroSelect} from '../../../../model/servizio/FiltroSelect';
import {ImpositoreServizio} from '../../../../model/servizio/ImpositoreServizio';
import {LivelloIntegrazioneServizio} from '../../../../model/servizio/LivelloIntegrazioneServizio';
import {BeneficiarioServizio} from '../../../../model/servizio/BeneficiarioServizio';
import {FiltroUfficio} from '../../../../model/servizio/FiltroUfficio';
import {Contatti} from '../../../../model/servizio/Contatti';
import {Servizio} from '../../../../model/servizio/Servizio';
import {FlussiNotifiche} from '../../../../model/servizio/FlussiNotifiche';
import {ComponenteDinamico} from '../../../../model/ComponenteDinamico';
import {Utils} from '../../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../../enums/tipoModale.enum';
import {NotifichePagamento} from '../../../../model/servizio/NotifichePagamento';
import * as moment from 'moment';
import {aggiornaTipoCampoEvent} from '../../gestisci-tipologia-servizio/modale-campo-form/modale-campo-form.component';
import {aggiungiTipoCampoEvent} from '../../gestisci-tipologia-servizio/modale-campo-form/modale-aggiungi-tipo-campo/modale-aggiungi-tipo-campo.component';
import {RoutingService} from '../../../../../../services/routing.service';

@Component({
  selector: 'app-form-servizio',
  templateUrl: './form-servizio.component.html',
  styleUrls: ['./form-servizio.component.scss']
})
export class FormServizioComponent extends FormElementoParentComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private cdr: ChangeDetectorRef,
              private renderer: Renderer2,
              public configuraServizioService: ConfiguraServizioService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private overlayService: OverlayService,
              private societaService: SocietaService,
              private enteService: EnteService,
              protected activatedRoute: ActivatedRoute,
              protected router: Router,
              protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private viewportRuler: ViewportRuler,
              protected confirmationService: ConfirmationService,
              private campoTipologiaServizioService: CampoTipologiaServizioService,
              private routingService: RoutingService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  private firstAdd = false;
  private isSingleClick: boolean;
  private servizioId: number;

  titoloPagina: string;
  tooltip: string;

  breadcrumbList: Breadcrumb[] = [];

  readonly lunghezzaMaxCol1: number = 5;
  readonly lunghezzaMaxCol2: number = 10;
  readonly lunghezzaMaxCol3: number = 15;

  funzione: FunzioneGestioneEnum;
  filtro: ParametriRicercaServizio;

  LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;

  private listaTipiCampo: any[];

  servizio: Servizio = new Servizio();
  contatti: Contatti = new Contatti();
  impositore: ImpositoreServizio = new ImpositoreServizio();
  integrazione: LivelloIntegrazioneServizio = new LivelloIntegrazioneServizio();
  beneficiario: BeneficiarioServizio = new BeneficiarioServizio();

  listaSocieta: Societa[] = [];
  listaLivelloIntegrazione: FiltroSelect[] = [];
  listaLivelloTerritoriale: FiltroSelect[] = [];
  listaEnti: FiltroSelect[] = [];
  listaEntiBenef: FiltroSelect[] = [];
  listaPortaleEsterno: FiltroSelect[] = [];
  listaUfficio: FiltroUfficio[] = [];

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  filtri: ParametriRicercaServizio;


  campoTipologiaServizioOriginal: CampoServizio[] = [];

  private tipoCampoIdSelect: number;

  testoTooltipIconaElimina = 'Elimina dati beneficiario';

  listaContiCorrente: ContoCorrente[];

  @ViewChildren('datiContoCorrente', {read: ViewContainerRef})
  datiBeneficiarioFormQuery: QueryList<any>;

  @ViewChild('datiContoCorrente', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  private componentRefs: ComponentRef<any>[] = [];
  targetMap: Map<string, ViewRef> = new Map<string, ViewRef>();

  private refreshItemsEvent: EventEmitter<any> = new EventEmitter<any>();
  private listaDipendeDa: CampoTipologiaServizio[];
  rendicontazioneGiornaliera: RendicontazioneGiornaliera = new RendicontazioneGiornaliera();

  TipoCampoEnum = TipoCampoEnum;
  invioNotifiche: any = {};
  emailsControl: FormControl[] = [new FormControl()];
  displayCc = false;

  mapContoCorrente: Map<string, ContoCorrente> = new Map<string, ContoCorrente>();
  mapControllo: Map<string, boolean> = new Map<string, boolean>();

  showEditId: number;
  getListaContiCorrente = (mapContoCorrente: Map<string, ContoCorrente>) => Array.from(mapContoCorrente, ([name, value]) => value);
  getListaControllo = (mapControllo: Map<string, boolean>) => Array.from(mapControllo, ([name, value]) => value);

  ngOnInit(): void {
    this.amministrativoService.salvaCampoFormEvent = new EventEmitter<any>();
    aggiungiTipoCampoEvent.subscribe(idTipoCampo => {
      this.impostaConfigurazioneCampi(idTipoCampo);
    });
  }

  public ngAfterViewInit() {
    this.datiBeneficiarioFormQuery.changes.subscribe(ql => {
      if (!this.firstAdd) {
        this.firstAdd = true;
        if (this.funzione == FunzioneGestioneEnum.AGGIUNGI) {
          this.aggiungiContoCorrente();
        } else {
          if (this.servizio.beneficiario && this.servizio.beneficiario.listaContiCorrenti) {
            this.servizio.beneficiario.listaContiCorrenti.forEach(value1 => {
              this.aggiungiContoCorrente(value1);
            });
          }
        }
      }
    });
  }

  private caricaLivelliIntegrazione() {
    this.configuraServizioService.filtroLivelliIntegrazione(null, this.idFunzione)
      .pipe(map((value) => this.listaLivelloIntegrazione = value)).subscribe();
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.campoTipologiaServizioOriginal = [];
    this.configuraServizioService.campoTipologiaServizioList = [];
    this.configuraServizioService.campoServizioAddList = [];
    let self = this;
    this.amministrativoService.salvaCampoFormEvent.subscribe((campoForm: CampoServizio) => {
      let parentCampo = self.campoTipologiaServizioOriginal.find((value: CampoServizio) => value.id == campoForm.campoTipologiaServizioId || value.id == campoForm.id);
      let campoFormIdx;
      let campoFormIdx2;
      campoFormIdx = self.configuraServizioService.campoTipologiaServizioList.findIndex((value: CampoServizio) => value.uuid && campoForm.uuid && value.uuid == campoForm.uuid);
      campoFormIdx2 = self.configuraServizioService.campoServizioAddList.findIndex((value: CampoServizio) => value.uuid && campoForm.uuid && value.uuid == campoForm.uuid);

      if (campoFormIdx != -1) {
        campoForm.campoTipologiaServizioId = parentCampo.id;
        self.configuraServizioService.campoTipologiaServizioList[campoFormIdx] = _.cloneDeep(campoForm);
      } else if (campoFormIdx2 != -1) {
        self.configuraServizioService.campoServizioAddList[campoFormIdx2] = _.cloneDeep(campoForm);
      } else {
        campoForm.uuid = uuidv4();
        campoForm.draggable = true;
        self.configuraServizioService.campoServizioAddList.push(campoForm);
      }
      self.overlayService.mostraModaleCampoEvent.emit(null);

      self.refreshItemsDipendeDa();
    });

    this.refreshItemsEvent.subscribe((items) => {
      this.listaDipendeDa = items.filter((value => value && value.tipoCampoId === this.tipoCampoIdSelect));
    });
    this.societaService.ricercaSocieta(null, this.idFunzione)
      .pipe(map((value: Societa[]) => this.listaSocieta = value)).subscribe();

    this.configuraServizioService.configuraServiziFiltroPortaleEsterno(this.idFunzione)
      .pipe(map((value: FiltroSelect[]) => this.listaPortaleEsterno = value)).subscribe();

    this.impostaConfigurazioneCampi();

    this.caricaLivelliIntegrazione();
    this.controllaTipoFunzione();
    this.inizializzaBreadcrumb();
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Servizio';
    this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una tipologia servizio';

    if (this.funzione === FunzioneGestioneEnum.MODIFICA || this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      this.servizioId = parseInt(snapshot.paramMap.get('servizioId'));

      let self = this;
      this.configuraServizioService.dettaglioServizio(this.servizioId, this.idFunzione).pipe(map((value: Servizio) => {
        this.servizio = value;
        this.filtro = new ParametriRicercaServizio();
        this.filtro.raggruppamentoId = value.raggruppamentoId;
        this.filtro.nomeServizio = value.nomeServizio;
        this.filtro.tipologiaServizioId = value.tipologiaServizioId;
        this.caricaCampi(value.tipologiaServizioId).subscribe((list) => {
          self.configuraServizioService.campoServizioAddList = value.listaCampiServizio.filter((obj) => {
            return !obj.campoTipologiaServizioId;
          }).map(value1 => {
            value1.uuid = uuidv4();
            value1.draggable = true;
            return value1;
          });

          self.configuraServizioService.campoTipologiaServizioList = list.map((obj) => {
            const campoServizio = value.listaCampiServizio.find((value1 => value1.campoTipologiaServizioId == obj.id));
            if (campoServizio)
              campoServizio.uuid = uuidv4();
            return campoServizio ? campoServizio : obj;
          });
        });
        this.filtro.abilitaDa = moment(value.abilitaDa, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR);
        this.filtro.abilitaA = value.abilitaA ? moment(value.abilitaA, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
        this.filtro.attivo = value.flagAttiva;
        this.contatti = value.contatti;
        this.integrazione = value.integrazione;
        if (value.impositore && value.impositore.societaId) {
          this.impositore = value.impositore;
          this._onChangeSocietaImpositore(value.impositore.societaId);
        }

        if (value.beneficiario && value.beneficiario.livelloTerritorialeId) {
          this.beneficiario = value.beneficiario;
          this.beneficiario.ufficio = _.cloneDeep(value.beneficiario.ufficio);
          this.beneficiario.listaContiCorrenti.forEach(cc => {
            cc.inizioValidita = moment(cc.inizioValidita).format(Utils.FORMAT_DATE_CALENDAR);
            if (cc.fineValidita)
              cc.fineValidita = moment(cc.fineValidita).format(Utils.FORMAT_DATE_CALENDAR);
          });
          this._onChangeLivelloTerritorialeBeneficiario(this.beneficiario.livelloTerritorialeId);
          this.enteService.recuperaContiCorrenti(this.beneficiario.enteId, this.idFunzione).subscribe(contiCorrenti => {
            this.listaContiCorrente = contiCorrenti;
          });
        }

        this.emailsControl = [];
        if (value.flussiNotifiche) {
          this.rendicontazioneGiornaliera = value.flussiNotifiche.rendicontazioneGiornaliera != null ?
            value.flussiNotifiche.rendicontazioneGiornaliera : new RendicontazioneGiornaliera();
          if (value.flussiNotifiche.notifichePagamento &&
            value.flussiNotifiche.notifichePagamento && value.flussiNotifiche.notifichePagamento.length > 0) {
            const strings = value.flussiNotifiche.notifichePagamento;
            if (strings && strings.length > 0) {
              strings.forEach(obj => {
                const formControl = new FormControl();
                formControl.setValue(obj.email);
                if (this.funzione == FunzioneGestioneEnum.DETTAGLIO) {
                  formControl.disable();
                }
                this.emailsControl.push(formControl);
              });
            }
          }
        }

        this.filtri = this.filtro;
      })).subscribe();
    }
  }

  impostaConfigurazioneCampi(idTipoCampo: number = null): void {
    this.campoTipologiaServizioService.letturaConfigurazioneCampiNuovoPagamento(this.idFunzione)
      .pipe(map((configuratore: ConfiguratoreCampiNuovoPagamento) => {
        localStorage.setItem('listaCampiDettaglioTransazione', JSON.stringify(configuratore.listaCampiDettaglioTransazione));
        localStorage.setItem('listaControlliLogici', JSON.stringify(configuratore.listaControlliLogici));
        localStorage.setItem('listaTipologiche', JSON.stringify(configuratore.listaTipologiche));
        localStorage.setItem('listaJsonPath', JSON.stringify(configuratore.listaJsonPath));

        this.listaTipiCampo = configuratore.listaTipiCampo;

        const filter = configuratore.listaTipiCampo.filter((tc => tc.nome === TipoCampoEnum.SELECT));
        if (filter && filter.length > 0) {
          this.tipoCampoIdSelect = filter[0].id;
        }

        localStorage.setItem('listaTipiCampo', JSON.stringify(configuratore.listaTipiCampo));

        if (idTipoCampo) {
          aggiornaTipoCampoEvent.emit(idTipoCampo);
        }
      })).subscribe();
  }

  caricaCampi(tipologiaServizioId: number): Observable<any> {
    let self = this;
    return this.campoTipologiaServizioService.campiTipologiaServizio(tipologiaServizioId, this.idFunzione)
      .pipe(map(value => {
        self.campoTipologiaServizioOriginal = _.sortBy(value, 'posizione');
        let list = _.cloneDeep(this.campoTipologiaServizioOriginal);

        // Nel caso della funzione Aggiungi, i campi vengono copiati da un'altra tipologia servizio, ma andranno ricreati sul db come nuove entit??
        if (self.funzione !== FunzioneGestioneEnum.DETTAGLIO) {
          list.forEach(campo => {
            campo.uuid = uuidv4();
            if (campo.dipendeDa && this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
              campo.dipendeDa.id = null;
            }
          });
        }
        self.refreshItemsDipendeDa();
        return list;
      }));
  }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioServizio':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiServizio':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaServizio':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  inizializzaBreadcrumb(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Configura Servizi', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Servizio', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  ngOnDestroy(): void {
    this.configuraServizioService.campoServizioAddList = [];
    this.configuraServizioService.campoTipologiaServizioList = [];
    if (this.amministrativoService.salvaCampoFormEvent.observers)
      this.amministrativoService.salvaCampoFormEvent.unsubscribe();
  }

  onClickSalva(): void {
    const emails: string[] = [];
    this.emailsControl.forEach((control) => {
      if (control.value) {
        emails.push(control.value);
      }
    });

    if (this.integrazione.livelloIntegrazioneId !== LivelloIntegrazioneEnum.LV1) {
      let list = _.cloneDeep(this.configuraServizioService.campoTipologiaServizioList);
      const campoServizios: CampoServizio[] = list
        .filter((value => !value.id || value.campoTipologiaServizioId))
        .map(value => {
          value.id = null;
          return value;
        });

      this.configuraServizioService.campoServizioAddList.forEach((value, index) => value.posizione = index + 1);
      this.servizio.listaCampiServizio = _.concat(campoServizios, this.configuraServizioService.campoServizioAddList);
    }

    const flussiNotifiche = new FlussiNotifiche();
    flussiNotifiche.notifichePagamento = [];
    flussiNotifiche.rendicontazioneGiornaliera = this.rendicontazioneGiornaliera;
    if (emails && emails.length > 0) {
      emails.forEach(email => {
        const notifichePagamento: NotifichePagamento = new NotifichePagamento();
        notifichePagamento.email = email;
        flussiNotifiche.notifichePagamento.push(notifichePagamento);
      });
    }
    this.servizio.flussiNotifiche = flussiNotifiche;

    this.servizio.tipologiaServizioId = this.filtri.tipologiaServizio.id;
    this.servizio.raggruppamentoId = this.filtri.raggruppamentoId;
    this.servizio.nomeServizio = this.filtri.nomeServizio;
    this.servizio.abilitaDa = moment(this.filtri.abilitaDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME);
    this.servizio.abilitaA = this.filtri.abilitaA ? moment(this.filtri.abilitaA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    this.servizio.flagAttiva = this.filtri.attivo;

    this.servizio.contatti = this.contatti;
    this.servizio.integrazione = this.integrazione;
    this.servizio.impositore = this.impositore;
    this.servizio.beneficiario = this.beneficiario;
    const listaContiCorrenti = _.cloneDeep(this.getListaContiCorrente(this.mapContoCorrente));
    const listaContiCorrentiPerBe = listaContiCorrenti.map(value => {
      value.inizioValidita = moment(value.inizioValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME);
      if (value.fineValidita) {
        value.fineValidita = moment(value.fineValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO);
      }
      return value;
    });
    this.servizio.beneficiario.listaContiCorrenti = listaContiCorrentiPerBe;

    if (this.funzione == FunzioneGestioneEnum.AGGIUNGI) {
      this.configuraServizioService.inserimentoServizio(this.servizio, this.idFunzione)
        .subscribe((id) => {
          if (id) {
            this.resetPagina();
          }
        });
    } else if (this.funzione == FunzioneGestioneEnum.MODIFICA) {
      this.configuraServizioService.modificaServizio(this.servizio, this.idFunzione)
        .subscribe((id) => {
          if (id) {
            this.routingService.configuraRouterAndNavigate(this.basePath + '/modificaServizio/' + this.servizio.id, null);
          }
        });
    }
  }

  private resetPagina() {
    this.filtro = new ParametriRicercaServizio();
    this.filtri = null;
    this.servizio = new Servizio();
    this.contatti = new Contatti();
    this.impositore = new ImpositoreServizio();
    this.integrazione = new LivelloIntegrazioneServizio();
    this.beneficiario = new BeneficiarioServizio();
  }

  onChangeFiltri(event: ParametriRicercaServizio) {
    this.filtri = event;
  }

  cambiaLivelloIntegrazione(event: any) {
    if (event !== LivelloIntegrazioneEnum.LV1) {
      this.configuraServizioService.campoServizioAddList = [];
      this.caricaCampi(this.filtri.tipologiaServizio.id).subscribe((list) => this.configuraServizioService.campoTipologiaServizioList = list);
    } else {
      this.campoTipologiaServizioOriginal = [];
      this.configuraServizioService.campoTipologiaServizioList = [];
      this.configuraServizioService.campoServizioAddList = [];
    }
  }

  disabilitaCampi() {
    return this.funzione == FunzioneGestioneEnum.DETTAGLIO;
  }

  onChangeSocietaImpositore(societaInput: NgModel) {
    this.impositore.livelloTerritorialeId = null;
    this.impositore.enteId = null;
    this._onChangeSocietaImpositore(societaInput.value);
  }

  private _onChangeSocietaImpositore(entity: any) {
    if (entity) {
      this.configuraServizioService.configuraServiziFiltroLivelloTerritoriale(entity, this.idFunzione)
        .pipe(map((value) => {
          this.listaLivelloTerritoriale = value;
          if (this.impositore.livelloTerritorialeId) {
            this._onChangeLivelloTerritorialeImpositore(this.impositore.livelloTerritorialeId);
          }
        })).subscribe();
    }
  }

  onChangeSocietaBeneficiario(societaInput: NgModel) {
    this.beneficiario.enteId = null;
    this.beneficiario.ufficio = null;
    this.beneficiario.livelloTerritorialeId = null;
    if (societaInput.value) {
      this.configuraServizioService.configuraServiziFiltroLivelloTerritoriale(societaInput.value, this.idFunzione)
        .pipe(map((value) => this.listaLivelloTerritoriale = value)).subscribe();
    }
  }

  onChangeLivelloTerritorialeImpositore(societaInput: NgModel, livelloTerritorialeInput: NgModel) {
    this.impositore.enteId = null;
    return this._onChangeLivelloTerritorialeImpositore(livelloTerritorialeInput.value);
  }

  private _onChangeLivelloTerritorialeImpositore(livelloTerritorialeId: any) {
    if (livelloTerritorialeId) {
      const params = new ParametriRicercaEnte();
      params.societaId = this.impositore.societaId;
      params.livelloTerritorialeId = livelloTerritorialeId;
      return this.configuraServizioService.filtroEnti(params, this.idFunzione)
        .pipe(map((value) => {
          this.listaEnti = value;

        })).subscribe();
    }
  }

  onChangeLivelloTerritorialeBeneficiario(societaInput: NgModel, livelloTerritorialeInput: NgModel) {
    if (!livelloTerritorialeInput.value) {
      this.beneficiario.enteId = null;
    } else {
      this._onChangeLivelloTerritorialeBeneficiario(livelloTerritorialeInput.value);
    }
  }

  private _onChangeLivelloTerritorialeBeneficiario(livelloTerritorialeId: any) {
    const params = new ParametriRicercaEnte();
    params.societaId = this.beneficiario.societaId;
    params.livelloTerritorialeId = livelloTerritorialeId;
    this.configuraServizioService.configuraServiziFiltroEnteBeneficiario(params, this.idFunzione)
      .pipe(map((value) => {
        this.listaEntiBenef = value;
        if (this.beneficiario.ufficio) {
          this.configuraServizioService.configuraServiziFiltroUfficio(this.beneficiario.enteId, this.idFunzione)
            .pipe(map((list) => {
              this.listaUfficio = list;
              let descr = this.beneficiario.ufficio.descrizione;
              this.beneficiario.ufficio = this.listaUfficio.find((item) =>
                item.enteId == this.beneficiario.enteId && item.codiceUfficio == this.beneficiario.ufficio.codiceUfficio &&
                item.tipoUfficio == this.beneficiario.ufficio.tipoUfficio);
              this.beneficiario.ufficio.descrizione = descr;
            })).subscribe();
        }
      })).subscribe();
  }

  isCampoInvalido(campo: NgModel | FormControl) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel | FormControl, tipoCampo: TipoCampoEnum): string {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return null;
    } else if (campo instanceof NgModel && campo.control?.errors?.required) {
      return 'Il campo ?? obbligatorio';
    } else if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'Seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'Inserisci testo';
        case TipoCampoEnum.INPUT_TESTUALE_EMAILS:
          return 'Inserisci le email separate da ;';
        case TipoCampoEnum.DATEDDMMYY:
          return 'Inserisci data';
      }
    }
  }

  onChangeEnte(enteInput: NgModel) {
    if (!enteInput.value) {
      this.beneficiario.ufficio = null;
    } else {
      this.enteService.recuperaContiCorrenti(enteInput.value, this.idFunzione)
        .subscribe((value) => {
          this.listaContiCorrente = _.cloneDeep(value);
          this.aggiornaListaContiCorrenti();
        }, catchError(() => {
          this.listaContiCorrente = [];
          this.aggiornaListaContiCorrenti();
          return of(null);
        }));
      return this.configuraServizioService.configuraServiziFiltroUfficio(enteInput.value, this.idFunzione)
        .pipe(map((value) => {
          this.listaUfficio = value;

        })).subscribe();
    }
  }

  aggiornaListaContiCorrenti() {
    let i = 0;
    const targetLength = this.target.length;
    const components = this.componentRefs;
    this.componentRefs = [];
    this.target.clear();
    while (i < targetLength) {
      const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiContoCorrenteComponent);
      const uuid = components[i].instance.uuid;
      const indexDatiContoCorrente = components[i].instance.indexDatiContoCorrente;
      const funzione = components[i].instance.funzione;
      const datiContoCorrente = components[i].instance.datiContoCorrente;
      const listaContiCorrente = this.listaContiCorrente;
      this.inizializzaComponentRefInstance(childComponent, uuid, indexDatiContoCorrente, funzione, datiContoCorrente, listaContiCorrente);
      i++;
    }

  }

  private inizializzaComponentRefInstance(childComponent: ComponentFactory<any>, uuid, index,
                                          funzione, datiContoCorrente, listaContiCorrente) {
    this.componentRef = this.target.createComponent(childComponent);
    this.renderer.addClass(this.componentRef.location.nativeElement, 'w-100');
    // input
    this.componentRef.instance.uuid = uuid;
    this.targetMap.set(uuid, this.componentRef.hostView);
    this.componentRef.instance.indexDatiContoCorrente = index;
    this.componentRef.instance.funzione = funzione;
    this.componentRef.instance.datiContoCorrente = datiContoCorrente;
    this.componentRef.instance.listaContiCorrente = listaContiCorrente;
    // output
    this.componentRef.instance.onDeleteDatiContoCorrente.subscribe((componenteDinamico: ComponenteDinamico) => {
      const contoCorrente = this.mapContoCorrente.get(componenteDinamico.uuid);
      const isContoCorrenteDaModificare: boolean = contoCorrente != null;
      if (isContoCorrenteDaModificare) {
        this.mapContoCorrente.delete(componenteDinamico.uuid);
        this.mapControllo.delete(componenteDinamico.uuid);
      }
      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const viewRef = this.targetMap.get(componenteDinamico.uuid);
      const indexViewRef = this.target.indexOf(viewRef);
      if (this.target.length === 1) {
        this.target.clear();
        this.targetMap.clear();
      } else {
        this.target.remove(indexViewRef);
        this.targetMap.delete(componenteDinamico.uuid);
      }
      this.setListaContiCorrente();
    });
    this.componentRef.instance.onChangeDatiContoCorrente.subscribe((componenteDinamico: ComponenteDinamico) => {
      this.mapContoCorrente.set(componenteDinamico.uuid, componenteDinamico.oggetto);
      this.mapControllo.set(componenteDinamico.uuid, componenteDinamico.isFormValid);
      this.setListaContiCorrente();
    });
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRefs.push(this.componentRef);
  }

  showModal(item: CampoTipologiaServizio) {
    let obj = _.cloneDeep(item);
    obj.uuid = item.uuid;
    this.overlayService.mostraModaleCampoEvent.emit({
      campoForm: obj,
      funzione: this.funzione,
      idFunzione: this.idFunzione,
      livelloIntegrazione: this.integrazione.livelloIntegrazioneId,
      mostraLivelloIntegrazione: true,
      listaDipendeDa: this.listaDipendeDa
    });
  }

  removeItem(item: CampoServizio) {
    if (this.funzione != FunzioneGestioneEnum.DETTAGLIO) {
      this.confirmationService.confirm(
        Utils.getModale(() => {
            this.configuraServizioService.campoServizioAddList.splice(this.configuraServizioService.campoServizioAddList.findIndex((v) => v.id === item.id), 1);
            this.refreshItemsDipendeDa();
          },
          TipoModaleEnum.ELIMINA,
        )
      );
    }
  }

  undo(item: CampoServizio) {
    if (this.funzione != FunzioneGestioneEnum.DETTAGLIO) {
      this.confirmationService.confirm(
        Utils.getModale(() => {
            const finded = this.campoTipologiaServizioOriginal.find((value => value.id == item.campoTipologiaServizioId));

            const findIndex = this.configuraServizioService.campoTipologiaServizioList.findIndex((value) => value.id == item.id);
            if (findIndex != -1) {
              finded.uuid = this.configuraServizioService.campoTipologiaServizioList[findIndex].uuid;
              this.configuraServizioService.campoTipologiaServizioList[findIndex] = _.cloneDeep(finded);
              this.refreshItemsDipendeDa();
            }
          },
          TipoModaleEnum.CUSTOM,
          'Annullamento modifiche',
          'Confermare l\'annullamento delle modifiche?'
        )
      );
    }
  }

  private refreshItemsDipendeDa() {
    const list = _.concat(this.configuraServizioService.campoTipologiaServizioList, this.configuraServizioService.campoServizioAddList);
    this.refreshItemsEvent.emit(list);
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
    return classe + ' example-list';
  }

  private decodeTipoCampo(tipoCampoId: number): string {
    const find = this.listaTipiCampo.find((value) => value.id = tipoCampoId);
    if (find) {
      return find.nome;
    } else {
      return '';
    }
  }

  add() {
    const campoForm = new CampoTipologiaServizio();
    if (this.integrazione.livelloIntegrazioneId !== this.LivelloIntegrazioneEnum.LV1) {
      campoForm.campoInput = true;
    }
    this.refreshItemsDipendeDa();
    this.showModal(campoForm);
  }

  aggiungiContoCorrente(datiContoCorrente?: ContoCorrente): number {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiContoCorrenteComponent);
    const indexContoCorrente = this.target.length;
    // input
    const uuid = Utils.uuidv4();
    const funzione = this.funzione;
    let instanceContoCorrente: ContoCorrente;
    if (datiContoCorrente == null) {
      instanceContoCorrente = new ContoCorrente();
    } else {
      instanceContoCorrente = datiContoCorrente;
    }
    const listaContiCorrente = this.listaContiCorrente;
    this.inizializzaComponentRefInstance(childComponent, uuid, indexContoCorrente, funzione, instanceContoCorrente, listaContiCorrente);
    return indexContoCorrente;
  }


  private setListaContiCorrente() {
    const listaContiCorrente: ContoCorrente[] = this.getListaContiCorrente(this.mapContoCorrente);
    this.beneficiario.listaContiCorrenti = listaContiCorrente;
  }

  validateUrl() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '(http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?';
        if (!new RegExp(regex).test(control.value)) {
          return {url: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }


  validateServer() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?';
        const regexIp = '^([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})$';
        if (new RegExp(regex).test(control.value) || new RegExp(regexIp).test(control.value)) {
          return null;
        } else {
          return {url: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }

  validateEmail() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
        if (!new RegExp(regex).test(control.value)) {
          return {email: false};
        }
      }

      return null;
    }) as ValidatorFn;
  }

  getPlaceholderRequired(label: string, required: boolean) {
    if (required) {
      return label + ' *';
    }
    return label;
  }

  addEmail() {
    this.emailsControl.push(new FormControl());
  }

  removeEmail(index: number) {
    this.emailsControl.splice(index, 1);
  }

  selezionaDaCC() {
    this.displayCc = !this.displayCc;
  }

  changeEmailGiornaliera(event: boolean) {
  }

  changeFtpGiornaliera(event: boolean) {
  }

  showModalAtClick(item: CampoTipologiaServizio) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.showModal(item);
      }
    }, 250);
  }

  dblClick(item: CampoServizio, index: number) {
    if (this.funzione == FunzioneGestioneEnum.DETTAGLIO) {
      return;
    }
    this.isSingleClick = false;
    this.showEditId = index;
  }

  applyEdit(item: CampoServizio) {
    if (item) {
      if (!this.campoTipologiaServizioOriginal.find((value) => value.id == item.id && value.titolo == item.titolo)) {
        this.amministrativoService.salvaCampoFormEvent.emit(item);
      }
      this.showEditId = null;
    }
  }

  isPresenteInDettaglioAndRendicontazione() {
    return !this.servizio.flagPresenzaDettaglioTransazione && !this.servizio.flagPresenzaRendicontazione;
  }

  isPresenteInDatiBonificoAndRendicontazione() {
    return !this.servizio.flagPresenzaDatiBonifico && !this.servizio.flagPresenzaRendicontazione;
  }

  isPresenteInDettaglio() {
    return !this.servizio.flagPresenzaDettaglioTransazione;
  }

  drop(event: CdkDragDrop<{ item: CampoServizio; index: number }, any>) {
    let arr = _.cloneDeep(this.configuraServizioService.campoServizioAddList);

    arr.splice(event.previousContainer.data.index, 1);
    arr.splice(event.container.data.index, 0, event.previousContainer.data.item);

    this.configuraServizioService.campoServizioAddList = arr;
  }

  isPresenteInQuadratura() {
    return !this.servizio.flagPresenzaQuadraturaPagoPA;
  }

  validateEmails() {
    return ((control: FormControl) => {

      if (control.value) {
        let emails: string[] = control.value.split(";");
        const regex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
        for (let idx in emails) {
          let value = emails[idx];
          if (value != "" && !new RegExp(regex).test(value)) {
            return {email: false};
          }
        }
      }
      return null;
    }) as ValidatorFn;
  }
}

