import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver, ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, Renderer2, ViewChild, ViewContainerRef
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
import {Form, FormControl, NgForm, NgModel, ValidatorFn, Validators} from '@angular/forms';
import {Societa} from '../../../../model/Societa';
import {SocietaService} from '../../../../../../services/societa.service';
import {map} from 'rxjs/operators';
import {EnteService} from '../../../../../../services/ente.service';
import {Observable} from 'rxjs';
import {SintesiEnte} from '../../../../model/ente/SintesiEnte';
import {ParametriRicercaEnte} from '../../../../model/ente/ParametriRicercaEnte';
import {LivelloTerritoriale} from '../../../../model/LivelloTerritoriale';
import {CampoTipologiaServizio} from '../../../../model/CampoTipologiaServizio';
import {v4 as uuidv4} from 'uuid';
import * as _ from 'lodash';
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {TipoCampoEnum} from "../../../../../../enums/tipoCampo.enum";
import {ConfiguratoreCampiNuovoPagamento} from "../../../../model/campo/ConfiguratoreCampiNuovoPagamento";
import {ContoCorrente} from "../../../../model/ente/ContoCorrente";
import {DatiContoCorrenteComponent} from "../../anagrafiche/gestisci-enti/dati-conto-corrente/dati-conto-corrente.component";
import {ContoCorrenteSingolo} from "../../../../model/ente/ContoCorrenteSingolo";
import {Beneficiario} from "../../../../model/ente/Beneficiario";
import {BeneficiarioSingolo} from "../../../../model/ente/BeneficiarioSingolo";
import {ConfiguraServizioService} from "../../../../../../services/configura-servizio.service";

export class LivelloIntegrazioneServizio {
  livelloIntegrazioneId: number = null;
  codiceIdServizio: number = null;
  numeroTentativiNotifica = 0;
  notificaUtente = false;
  redirect: boolean;
  codiceEnte: number;
  tipoUfficio: string;
  codiceUfficio: string;
  urlWsBO: string;
  portaleEsterno: number;
}

export class ImpositoreServizio {
  societaId: number = null;
  enteId: number = null;
  mostraAlVersante = false;
  livelloTerritorialeId: number = null;
}

export class BeneficiarioServizio {
  societaId: number = null;
  enteId: number = null;
  livelloTerritorialeId: number = null;
  ufficio: FiltroUfficio;
}

export class FiltroConfiguraServizi {
  id: number = null;
  nome: string = null;
}

class FiltroUfficio {
  enteId: number = null;
  codiceEnte: string = null;
  tipoUfficio: string = null;
  codiceUfficio: string = null;
  descrizioneUfficio: string = null;
}

class RendicontazioneGiornaliera {
  emailEnabled = false;
  ftpEnabled = false;
  email: string;
  emailCcn: string;
  server: string;
  username: string;
  password: string;
  directory: string;

}

@Component({
  selector: 'app-form-servizio',
  templateUrl: './form-servizio.component.html',
  styleUrls: ['./form-servizio.component.scss']
})
export class FormServizioComponent extends FormElementoParentComponent implements OnInit, OnDestroy {

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

  servizio: any = {};
  contatti: any = {};
  impositore: ImpositoreServizio = new ImpositoreServizio();
  integrazione: LivelloIntegrazioneServizio = new LivelloIntegrazioneServizio();
  beneficiario: BeneficiarioServizio = new BeneficiarioServizio();

  listaSocieta: Societa[] = [];
  listaLivelloTerritoriale: FiltroConfiguraServizi[] = [];
  listaEnti: FiltroConfiguraServizi[] = [];
  listaEntiBenef: FiltroConfiguraServizi[] = [];
  listaPortaleEsterno: FiltroConfiguraServizi[] = [];
  listaUfficio: FiltroUfficio[] = [];

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  filtri: ParametriRicercaServizio;


  campoTipologiaServizioOriginal: CampoTipologiaServizio[];

  campoTipologiaServizioList: CampoTipologiaServizio[];
  private tipoCampoIdSelect: number;

  testoTooltipIconaElimina = 'Elimina dati beneficiario';

  @Input() indexDatiBeneficiario: number;
  @Input() datiBeneficiario: Beneficiario;
  @Input() listaContiCorrente: ContoCorrente[];
  @Output()
  onChangeDatiBeneficiario: EventEmitter<BeneficiarioSingolo> = new EventEmitter<BeneficiarioSingolo>();
  @Output()
  onDeleteDatiBeneficiario: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('datiContoCorrente', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  @ViewChild('datiBeneficiarioForm', {static: false, read: NgForm})
  formDatiBeneficiario: NgForm;

  mapContoCorrente: Map<number, ContoCorrente> = new Map<number, ContoCorrente>();
  mapControllo: Map<number, boolean> = new Map<number, boolean>();
  getListaContiCorrente = (mapContoCorrente: Map<number, ContoCorrente>) => Array.from(mapContoCorrente, ([name, value]) => value);
  getListaControllo = (mapControllo: Map<number, boolean>) => Array.from(mapControllo, ([name, value]) => value);
  ì

  private refreshItemsEvent: EventEmitter<any> = new EventEmitter<any>();
  private listaDipendeDa: CampoTipologiaServizio[];
  rendicontazioneGiornaliera: RendicontazioneGiornaliera = new RendicontazioneGiornaliera();
  rendicontazioneFlussoPA: RendicontazioneGiornaliera = new RendicontazioneGiornaliera();
  TipoCampoEnum = TipoCampoEnum;
  invioNotifiche: any = {};
  emailsControl: FormControl[] = [new FormControl()];
  displayCc = false;

  constructor(private cdr: ChangeDetectorRef,
              private renderer: Renderer2,
              private configuraServizioService: ConfiguraServizioService,
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
              private campoTipologiaServizioService: CampoTipologiaServizioService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  ngOnInit(): void {
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.refreshItemsEvent.subscribe((items) => {
      this.listaDipendeDa = items.filter((value => value.tipoCampoId === this.tipoCampoIdSelect));
    });
    this.societaService.ricercaSocieta(null, this.idFunzione)
      .pipe(map((value: Societa[]) => this.listaSocieta = value)).subscribe();

    this.configuraServizioService.configuraServiziFiltroPortaleEsterno(this.idFunzione)
      .pipe(map((value: FiltroConfiguraServizi[]) => this.listaPortaleEsterno = value)).subscribe();

    this.campoTipologiaServizioService.letturaConfigurazioneCampiNuovoPagamento(this.idFunzione)
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
      })).subscribe();

    this.controllaTipoFunzione();
    this.inizializzaBreadcrumb();
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Servizio';
    this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una tipologia servizio';
  }

  caricaCampi(tipologiaServizioId: number): Observable<any> {
    return this.campoTipologiaServizioService.campiTipologiaServizio(tipologiaServizioId, this.idFunzione)
      .pipe(map(value => {
        this.campoTipologiaServizioOriginal = _.sortBy(value, 'posizione');
        this.campoTipologiaServizioList = _.cloneDeep(this.campoTipologiaServizioOriginal);

        // Nel caso della funzione Aggiungi, i campi vengono copiati da un'altra tipologia servizio, ma andranno ricreati sul db come nuove entità
        if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
          this.campoTipologiaServizioOriginal.forEach(campo => {
            campo.id = null;
            campo.uuid = uuidv4();
            if (campo.dipendeDa)
              campo.dipendeDa.id = null;
          });
        }

        this.refreshItemsEvent.emit(this.campoTipologiaServizioList);
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
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Servizio', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Servizio', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  ngOnDestroy(): void {
  }

  onClickSalva(): void {
  }

  onChangeFiltri(event: ParametriRicercaServizio) {
    this.filtri = event;
    // this.aggiungiContoCorrente();

  }

  cambiaLivelloIntegrazione(event: any) {
    if (event !== LivelloIntegrazioneEnum.LV1)
      this.caricaCampi(this.filtri.tipologiaServizio.id).subscribe();
    else {
      this.campoTipologiaServizioOriginal = null;
      this.campoTipologiaServizioList = null;
    }
  }

  disabilitaCampi() {
    return false;
  }

  onChangeSocietaImpositore(societaInput: NgModel) {
    if (!societaInput.value) {
      this.impositore.livelloTerritorialeId = null;
      this.impositore.enteId = null;
    } else {
      this.configuraServizioService.configuraServiziFiltroLivelloTerritoriale(societaInput.value, this.idFunzione)
        .pipe(map((value) => this.listaLivelloTerritoriale = value)).subscribe();
    }
  }

  onChangeSocietaBeneficiario(societaInput: NgModel) {
    if (!societaInput.value) {
      this.beneficiario.livelloTerritorialeId = null;
      this.beneficiario.enteId = null;
    } else {
      this.configuraServizioService.configuraServiziFiltroLivelloTerritoriale(societaInput.value, this.idFunzione)
        .pipe(map((value) => this.listaLivelloTerritoriale = value)).subscribe();
    }
  }

  onChangeLivelloTerritorialeImpositore(societaInput: NgModel, livelloTerritorialeInput: NgModel) {
    if (!livelloTerritorialeInput.value) {
      this.impositore.enteId = null;
    } else {
      const params = new ParametriRicercaEnte();
      params.societaId = societaInput.value;
      params.livelloTerritorialeId = livelloTerritorialeInput.value;
      return this.configuraServizioService.configuraServiziFiltroEnteImpositore(params, this.idFunzione)
        .pipe(map((value) => this.listaEnti = value)).subscribe();
    }
  }

  onChangeLivelloTerritorialeBeneficiario(societaInput: NgModel, livelloTerritorialeInput: NgModel) {
    if (!livelloTerritorialeInput.value) {
      this.beneficiario.enteId = null;
    } else {
      const params = new ParametriRicercaEnte();
      params.societaId = societaInput.value;
      params.livelloTerritorialeId = livelloTerritorialeInput.value;
      return this.configuraServizioService.configuraServiziFiltroEnteBeneficiario(params, this.idFunzione)
        .pipe(map((value) => this.listaEntiBenef = value)).subscribe();
    }
  }

  isCampoInvalido(campo: NgModel | FormControl) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel | FormControl, tipoCampo: TipoCampoEnum): string {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return null;
    } else if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'inserisci testo';
        case TipoCampoEnum.DATEDDMMYY:
          return 'inserisci data';
      }
    }
  }

  onChangeEnte(enteInput: NgModel) {
    if (!enteInput.value) {
      this.beneficiario.ufficio = null;
    } else {
      return this.configuraServizioService.configuraServiziFiltroUfficio(enteInput.value, this.idFunzione)
        .pipe(map((value) => this.listaUfficio = value)).subscribe();
    }
  }

  showModal(item: CampoTipologiaServizio) {
    this.overlayService.mostraModaleCampoEvent.emit({
      campoForm: _.cloneDeep(item),
      funzione: this.funzione,
      idFunzione: this.idFunzione,
      livelloIntegrazione: this.integrazione.livelloIntegrazioneId,
      listaDipendeDa: this.listaDipendeDa
    });
  }

  removeItem(item: CampoTipologiaServizio) {

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
    this.campoTipologiaServizioList[event.previousContainer.data.index] = event.container.data.item;
    this.campoTipologiaServizioList[event.container.data.index] = event.previousContainer.data.item;
  }

  add() {
    const campoForm = new CampoTipologiaServizio();
    this.refreshItemsEvent.emit(this.campoTipologiaServizioList);
    this.showModal(campoForm);
  }

  aggiungiContoCorrente(datiContoCorrente?: ContoCorrente): number {
    // creazione Dati Conto Corrente Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiContoCorrenteComponent);
    this.componentRef = this.target.createComponent(childComponent);
    this.renderer.setStyle(this.componentRef.instance.el.nativeElement, 'width', '100%');
    const indexContoCorrente = this.target.length;
    // input
    this.componentRef.instance.indexDatiContoCorrente = indexContoCorrente;
    this.componentRef.instance.funzione = this.funzione;
    let instanceContoCorrente: ContoCorrente;
    if (datiContoCorrente == null) {
      instanceContoCorrente = new ContoCorrente();
    } else {
      instanceContoCorrente = datiContoCorrente;
    }
    this.componentRef.instance.datiContoCorrente = instanceContoCorrente;
    if (this.listaContiCorrente != null && FunzioneGestioneEnum.MODIFICA) {
      this.componentRef.instance.listaContiCorrente = this.listaContiCorrente;
    }
    // output
    this.componentRef.instance.onDeleteDatiContoCorrente.subscribe(index => {
      const contoCorrente = this.mapContoCorrente.get(index);
      const isContoCorrenteDaModificare: boolean = contoCorrente != null;
      if (isContoCorrenteDaModificare) {
        this.mapContoCorrente.delete(index);
        this.mapControllo.delete(index);
      }
      this.target.remove(index - 1);
      this.setListaContiCorrente();
    });
    this.componentRef.instance.onChangeDatiContoCorrente.subscribe((currentContoCorrente: ContoCorrenteSingolo) => {
      this.mapContoCorrente.set(currentContoCorrente.index, currentContoCorrente.contoCorrente);
      this.mapControllo.set(currentContoCorrente.index, currentContoCorrente.isFormValid);
      this.setListaContiCorrente();
    });
    this.componentRef.changeDetectorRef.detectChanges();
    return indexContoCorrente;
  }

  private setListaContiCorrente() {
    const listaContiCorrente: ContoCorrente[] = this.getListaContiCorrente(this.mapContoCorrente);
    this.datiBeneficiario.listaContiCorrenti = listaContiCorrente;
    //this.onChangeDatiBeneficiario.emit(this.setBeneficiarioSingolo(this.controlloForm()));
  }

  validateUrl() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '(http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?';
        if (!new RegExp(regex).test(control.value))
          return {url: false};
      }

      return null;
    }) as ValidatorFn;
  }


  validateEmail() {
    return ((control: FormControl) => {

      if (control.value) {
        const regex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
        if (!new RegExp(regex).test(control.value))
          return {email: false};
      }

      return null;
    }) as ValidatorFn;
  }

  getPlaceholderRequired(label: string, required: boolean) {
    if (required)
      return label + ' *';
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
}
