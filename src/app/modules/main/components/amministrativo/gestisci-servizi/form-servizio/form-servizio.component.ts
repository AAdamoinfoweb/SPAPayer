import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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
import {NgModel} from '@angular/forms';
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

export class LivelloIntegrazioneServizio {
  id: number = null;
  codiceIDServizio: number = null;
  numeroTentativiNotifica = 0;
  notificaUtente = false;
  redirect: boolean;
  codiceEnte: number;
  tipoUfficio: string;
  codiceUfficio: string;
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
  contatto: any = {};
  impositore: ImpositoreServizio = new ImpositoreServizio();
  livelloIntegrazione: LivelloIntegrazioneServizio = new LivelloIntegrazioneServizio();
  beneficiario: BeneficiarioServizio = new BeneficiarioServizio();

  listaSocieta: Societa[] = [];
  listaLivelloTerritoriale: LivelloTerritoriale[] = [];
  listaEnti: SintesiEnte[] = [];
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  filtri: ParametriRicercaServizio;

  listaEntiBenef: SintesiEnte[] = [];
  listaLivelloTerritorialeBenef: LivelloTerritoriale[] = [];

  campoTipologiaServizioOriginal: CampoTipologiaServizio[];

  campoTipologiaServizioList: CampoTipologiaServizio[];
  private tipoCampoIdSelect: number;


  constructor(private cdr: ChangeDetectorRef,
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
    this.societaService.ricercaSocieta(null, this.idFunzione)
      .pipe(map((value: Societa[]) => this.listaSocieta = value)).subscribe();

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

        // this.refreshItemsEvent.emit(this.items);
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
    this.caricaCampi(event.tipologiaServizio.id).subscribe();
  }

  cambiaLivelloIntegrazione($event: any) {

  }

  disabilitaCampi() {
    return false;
  }

  onChangeSocieta(societaInput: NgModel) {

  }

  onChangeLivelloTerritoriale(societaInput: NgModel, livelloTerritorialeInput: NgModel) {
    this.getObservableFunzioneRicerca(societaInput.value, livelloTerritorialeInput.value)
      .pipe(map((value) => this.listaEnti = value)).subscribe();
  }

  getObservableFunzioneRicerca(societaId, livelloTerritorialeId): Observable<SintesiEnte[]> {
    const params = new ParametriRicercaEnte();
    params.societaId = societaId;
    params.livelloTerritorialeId = livelloTerritorialeId;
    return this.enteService.ricercaEnti(params, this.idFunzione);
  }

  isCampoInvalido(societaInput: NgModel) {
    return false;
  }

  setPlaceholder(societaInput: NgModel, select: string) {


  }

  onChangeEnte(enteInput: NgModel) {

  }

  showModal(item: CampoTipologiaServizio) {

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

  dropEvt($event: CdkDragDrop<{ item: CampoTipologiaServizio; index: number }, any>) {

  }

  add() {


  }
}
