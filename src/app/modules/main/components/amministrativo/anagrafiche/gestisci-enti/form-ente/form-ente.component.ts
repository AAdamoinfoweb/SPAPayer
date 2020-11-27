import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {ConfirmationService} from 'primeng/api';
import {SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {EnteCompleto} from '../../../../../model/ente/EnteCompleto';
import {Beneficiario} from '../../../../../model/ente/Beneficiario';
import {ContoCorrente} from '../../../../../model/ente/ContoCorrente';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {DatiBeneficiarioComponent} from '../dati-beneficiario/dati-beneficiario.component';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {EnteService} from '../../../../../../../services/ente.service';
import {Banner} from '../../../../../model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../../../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../../../../services/banner.service';
import {ComponenteDinamico} from '../../../../../model/ComponenteDinamico';
import {Util} from 'design-angular-kit/lib/util/util';

@Component({
  selector: 'app-form-ente',
  templateUrl: './form-ente.component.html',
  styleUrls: ['./form-ente.component.scss']
})
export class FormEnteComponent extends FormElementoParentComponent implements OnInit {
  // enums e consts class
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  idFunzione;
  // header page
  breadcrumbList = [];
  tooltipTitolo: string;
  titoloPagina: string;
  // data
  funzione: FunzioneGestioneEnum;
  datiEnte: EnteCompleto = new EnteCompleto();
  datiBeneficiario: Beneficiario;
  datiContoCorrente: ContoCorrente;
  listaContiCorrente: ContoCorrente[];
  mapBeneficiario: Map<string, Beneficiario> = new Map();
  mapControllo: Map<string, boolean> = new Map();
  esito;

  // form valid
  isFormDatiEnteValido = false;
  @ViewChild('datiBeneficiario', {static: false, read: ViewContainerRef}) target: ViewContainerRef;

  private componentRef: ComponentRef<any>;

  private componentRefs: ComponentRef<any>[] = [];
  getListFromMap = (map: Map<string, any>) => Array.from(map, ([name, value]) => value);


  constructor(router: Router,
              activatedRoute: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef, amministrativoService: AmministrativoService,
              private overlayService: OverlayService, http: HttpClient,
              confirmationService: ConfirmationService, private enteService: EnteService, private bannerService: BannerService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    // get route per logica inserimento o modifica
    this.controllaTipoFunzione(snapshot);
    this.inizializzaBreadcrumbs();
    this.inizializzaTitolo();
    this.inizializzaDatiEnte();
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      // inizializzazione form modifica o dettaglio
      const enteId = snapshot.params.enteId;
      this.letturaEnte(enteId);
    } else {
      // inizializzazione form inserimento
    }
  }

  private controlloEsito() {
    if (this.esito != null) {
      const banner: Banner = {
        titolo: 'ATTENZIONE',
        testo: this.esito,
        tipo: getBannerType(LivelloBanner.WARNING)
      };
      this.bannerService.bannerEvent.emit([banner]);
    }
  }

  ngOnInit(): void {
  }

  controllaTipoFunzione(snapshot) {
    const url = snapshot.url[1].path;
    switch (url) {
      case 'dettaglioEnte':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiEnte':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaEnte':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  inizializzaBreadcrumbs(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Enti', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Ente', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  private inizializzaTitolo() {
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Ente';
    this.tooltipTitolo = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di un ente';
  }

  inizializzaDatiEnte() {
    this.datiEnte.societaId = null;
    this.datiEnte.livelloTerritorialeId = null;
    this.datiEnte.comune = null;
    this.datiEnte.provincia = null;
    this.datiEnte.logo = null;
  }

  onChangeDatiEnte(datiEnte: EnteCompleto): void {
    this.datiEnte = datiEnte;
  }

  aggiungiBeneficiario(datiBeneficiario?: Beneficiario): number {
    // creazione Dati Beneficiario Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiBeneficiarioComponent);
    const indexBeneficiario = this.target.length;
    // input
    const uuid = Utils.uuidv4();
    const funzione = this.funzione;
    const idFunzione = this.idFunzione;
    let instanceDatiBeneficiario: Beneficiario;
    if (datiBeneficiario == null) {
      instanceDatiBeneficiario = new Beneficiario();
    } else {
      instanceDatiBeneficiario = datiBeneficiario;
    }
    let listaContiCorrente = null;
    if (this.funzione === FunzioneGestioneEnum.MODIFICA && this.listaContiCorrente != null) {
      listaContiCorrente = this.listaContiCorrente;
    }
    this.inizializzaComponentRefInstance(childComponent, uuid, indexBeneficiario, funzione, idFunzione,
      instanceDatiBeneficiario, listaContiCorrente);
    return indexBeneficiario;
  }

  aggiornaListaContiCorrenti() {
    let i = 0;
    const targetLength = this.target.length;
    const components = this.componentRefs;
    this.componentRefs = [];
    this.target.clear();
    while (i < targetLength) {
      const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiBeneficiarioComponent);
      const uuid = components[i].instance.uuid;
      const indexDatiContoCorrente = components[i].instance.indexDatiBeneficiario;
      const funzione = components[i].instance.funzione;
      const datibeneficiario = components[i].instance.datiBeneficiario;
      const listaContiCorrente = this.listaContiCorrente;
      const idFunzione = components[i].instance.idFunzione;
      this.inizializzaComponentRefInstance(childComponent, uuid, indexDatiContoCorrente, funzione, idFunzione, datibeneficiario, listaContiCorrente);
      i++;
    }
  }

  inizializzaComponentRefInstance(childComponent, uuid, index, funzione, idFunzione, datiBeneficiario, listaContiCorrente){
    // creazione Dati Beneficiario Component
    this.componentRef = this.target.createComponent(childComponent);
    // input
    this.componentRef.instance.uuid = uuid;
    this.componentRef.instance.indexDatiBeneficiario = index;
    this.componentRef.instance.funzione = funzione;
    this.componentRef.instance.idFunzione = idFunzione;
    this.componentRef.instance.datiBeneficiario = datiBeneficiario;
    if (funzione === FunzioneGestioneEnum.MODIFICA && listaContiCorrente != null) {
      this.componentRef.instance.listaContiCorrente = listaContiCorrente;
    }
    // output
    this.componentRef.instance.onDeleteDatiBeneficiario.subscribe((componenteDinamico: ComponenteDinamico) => {
      const beneficiario = this.mapBeneficiario.get(componenteDinamico.uuid);
      const isBeneficiarioDaModificare: boolean = beneficiario != null;
      if (isBeneficiarioDaModificare) {
        this.mapBeneficiario.delete(componenteDinamico.uuid);
        this.mapControllo.delete(componenteDinamico.uuid);
      }
      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const zeroBasedIndex = componenteDinamico.index - 1;
      const viewRef = this.target.get(zeroBasedIndex);
      if (viewRef == null && this.target.length === 1) {
        this.target.clear();
      } else {
        this.target.remove(zeroBasedIndex);
      }
    });
    this.componentRef.instance.onChangeDatiBeneficiario.subscribe((componenteDinamico: ComponenteDinamico) => {
      this.mapBeneficiario.set(componenteDinamico.uuid, componenteDinamico.oggetto);
      this.mapControllo.set(componenteDinamico.uuid, componenteDinamico.isFormValid);
    });
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRefs.push(this.componentRef);
  }

  letturaEnte(idEnte) {
    this.enteService.dettaglioEnte(idEnte, this.idFunzione).subscribe((ente) => {
      // inizializza dati ente per modifica
      this.datiEnte = ente;
      this.isFormDatiEnteValido = true;
      // recupero conti corrente
      if (this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.recuperoContiCorrente(this.datiEnte.id).subscribe((contiCorrente) => {
          this.listaContiCorrente = contiCorrente;
          this.setListaBeneficiari();
        });
      } else {
        this.setListaBeneficiari();
      }
    });
  }

  private setListaBeneficiari() {
    if (this.datiEnte.listaBeneficiari) {
      this.datiEnte.listaBeneficiari = this.formattaCampi(this.datiEnte.listaBeneficiari, true);
      this.datiEnte.listaBeneficiari.forEach((beneficiario) => {
        if (this.target != null) {
          this.aggiungiBeneficiario(beneficiario);
        }
      });
    }
  }

  recuperoContiCorrente(idEnte) {
    return this.enteService.recuperaContiCorrenti(idEnte, this.idFunzione);
  }

  disabilitaBottone(): boolean {
    const listaControllo: boolean[] = this.getListFromMap(this.mapControllo);
    const isListaBeneficiarioInvalid = listaControllo.length > 0 ? listaControllo.includes(false) : false;
    return !this.isFormDatiEnteValido || isListaBeneficiarioInvalid;
  }

  onClickSalva(): void {
    let listaBeneficiari: Beneficiario[] = this.getListFromMap(this.mapBeneficiario);
    listaBeneficiari = this.formattaCampi(listaBeneficiari, false);
    this.datiEnte.listaBeneficiari = listaBeneficiari;
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      this.inserimentoEnte();
    } else if (this.funzione === FunzioneGestioneEnum.MODIFICA) {
      this.modificaEnte();
    }
  }

  private inserimentoEnte(): void {
    this.enteService.inserimentoEnte(this.datiEnte, this.idFunzione).subscribe(
      (response) => {
        if (!(response instanceof HttpErrorResponse)) {
          this.esito = response.esito;
          this.pulisciEnte();
        }
      });
  }

  private pulisciEnte() {
    this.controlloEsito();
    this.datiEnte = new EnteCompleto();
    this.inizializzaDatiEnte();
    this.target.clear();
    if (this.esito == null) {
      this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
    }
  }

  private modificaEnte() {
    this.enteService.modificaEnte(this.datiEnte, this.idFunzione).subscribe((response) => {
      if (!(response instanceof HttpErrorResponse)) {
        this.esito = response.esito;
        this.controlloEsito();
        if (this.esito == null) {
          this.recuperoContiCorrente(this.datiEnte.id).subscribe((contiCorrente) => {
            this.listaContiCorrente = contiCorrente;
            this.aggiornaListaContiCorrenti();
          });
          this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
        }
      }
    });
  }

  private formattaCampi(listaBeneficiari: Beneficiario[], dateIsIso?: boolean) {
    listaBeneficiari = listaBeneficiari.map((beneficiario) => {
      const beneficiarioCopy = JSON.parse(JSON.stringify(beneficiario));
      const contiCorrenti = beneficiarioCopy.listaContiCorrenti;
      if (contiCorrenti != null && contiCorrenti.length > 0) {
        beneficiarioCopy.listaContiCorrenti = contiCorrenti.map((contoCorrente) => {
          contoCorrente.iban = contoCorrente.iban.replace(/\s+/g, '');
          const ibanCCPostale = contoCorrente.ibanCCPostale;
          if (ibanCCPostale != null) {
            contoCorrente.ibanCCPostale = ibanCCPostale.replace(/\s+/g, '');
          }
          const inizioValidita = contoCorrente.inizioValidita;
          if (inizioValidita != null) {
            contoCorrente.inizioValidita = this.formattaData(inizioValidita, dateIsIso);
          }
          const fineValidita = contoCorrente.fineValidita;
          if (fineValidita != null) {
            contoCorrente.fineValidita = this.formattaData(fineValidita, dateIsIso, true);
          }
          return contoCorrente;
        });
      }
      return beneficiarioCopy;
    });
    return listaBeneficiari;
  }

  private formattaData(date: string, dateIsIso: boolean, to?: boolean): string {
    if (dateIsIso) {
      return moment(date, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
        .format(Utils.FORMAT_DATE_CALENDAR);
    } else {
      return moment(date, Utils.FORMAT_DATE_CALENDAR)
        .format(to ? Utils.FORMAT_LOCAL_DATE_TIME_TO : Utils.FORMAT_LOCAL_DATE_TIME);
    }
  }

  onClickAnnullaButton() {
    this.onClickAnnulla(this.funzione);
  }

}
