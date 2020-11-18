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
import {HttpClient} from '@angular/common/http';
import {DatiBeneficiarioComponent} from '../dati-beneficiario/dati-beneficiario.component';
import {BeneficiarioSingolo} from '../../../../../model/ente/BeneficiarioSingolo';
import * as moment from "moment";
import {Utils} from "../../../../../../../utils/Utils";
import {EnteService} from "../../../../../../../services/ente.service";
import {Observable} from "rxjs";
import {Banner} from "../../../../../model/banner/Banner";
import {getBannerType, LivelloBanner} from "../../../../../../../enums/livelloBanner.enum";
import {BannerService} from "../../../../../../../services/banner.service";

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
  mapBeneficiario: Map<number, Beneficiario> = new Map();
  mapControllo: Map<number, boolean> = new Map();

  // form valid
  isFormDatiEnteValido = false;
  @ViewChild('datiBeneficiario', {static: false, read: ViewContainerRef}) target: ViewContainerRef;

  private componentRef: ComponentRef<any>;
  getListFromMap = (map: Map<number, any>) => Array.from(map, ([name, value]) => value);


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
    this.controlloEsito();
  }

  private controlloEsito() {
    const esito = history.state.esito;
    if (esito != null) {
      const banner: Banner = {
        titolo: 'ATTENZIONE',
        testo: esito,
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
  }

  onChangeDatiEnte(datiEnte: EnteCompleto): void {
    this.datiEnte = datiEnte;
  }

  aggiungiBeneficiario(datiBeneficiario?: Beneficiario): number {
    // creazione Dati Beneficiario Component
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiBeneficiarioComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const indexBeneficiario = this.target.length;
    // input
    this.componentRef.instance.indexDatiBeneficiario = indexBeneficiario;
    this.componentRef.instance.funzione = this.funzione;
    this.componentRef.instance.idFunzione = this.idFunzione;
    let instanceDatiBeneficiario: Beneficiario;
    if (datiBeneficiario == null) {
      instanceDatiBeneficiario = new Beneficiario();
    } else {
      instanceDatiBeneficiario = datiBeneficiario;
    }
    this.componentRef.instance.datiBeneficiario = instanceDatiBeneficiario;
    if (this.funzione === FunzioneGestioneEnum.MODIFICA && this.listaContiCorrente != null) {
      this.componentRef.instance.listaContiCorrente = this.listaContiCorrente;
    }
    // output
    this.componentRef.instance.onDeleteDatiBeneficiario.subscribe(index => {
      const beneficiario = this.mapBeneficiario.get(index);
      const isBeneficiarioDaModificare: boolean = beneficiario != null;
      if (isBeneficiarioDaModificare) {
        this.mapBeneficiario.delete(index);
        this.mapControllo.delete(index);
      }
      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const zeroBasedIndex = index - 1;
      const viewRef = this.target.get(zeroBasedIndex);
      if (viewRef == null && this.target.length === 1) {
        this.target.clear();
      } else {
        this.target.remove(zeroBasedIndex);
      }
    });
    this.componentRef.instance.onChangeDatiBeneficiario.subscribe((currentBeneficiario: BeneficiarioSingolo) => {
      this.mapBeneficiario.set(currentBeneficiario.index, currentBeneficiario.beneficiario);
      this.mapControllo.set(currentBeneficiario.index, currentBeneficiario.isFormValid);
    });
    this.componentRef.changeDetectorRef.detectChanges();
    return indexBeneficiario;
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
    this.datiEnte.listaBeneficiari = this.formattaCampi(this.datiEnte.listaBeneficiari, true);
    this.datiEnte.listaBeneficiari.forEach((beneficiario) => {
      if(this.target != null){
        this.aggiungiBeneficiario(beneficiario);
      }
    });
  }

  recuperoContiCorrente(idEnte) {
    return this.enteService.recuperaContiCorrenti(idEnte, this.idFunzione)
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
    this.enteService.inserimentoEnte(this.datiEnte, this.idFunzione).subscribe(esitoInserimentoModificaEnte => {
      const state = {esito: esitoInserimentoModificaEnte.esito};
      this.configuraRouterAndNavigate('/aggiungiEnte', state);
    });
  }

  private modificaEnte() {
    this.enteService.modificaEnte(this.datiEnte, this.idFunzione).subscribe((esitoInserimentoModificaEnte) => {
      const state = {esito: esitoInserimentoModificaEnte.esito};
      this.configuraRouterAndNavigate('/modificaEnte/' + esitoInserimentoModificaEnte.idEnte, state);
    });
  }

  private configuraRouterAndNavigate(pathFunzione: string, state) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // this.router.navigateByUrl(this.basePath + pathFunzione);
    this.router.navigate([this.basePath + pathFunzione], {state: state });
  }

  private formattaCampi(listaBeneficiari: Beneficiario[], dateIsIso?: boolean) {
    listaBeneficiari = listaBeneficiari.map((beneficiario) => {
      const contiCorrenti = beneficiario.listaContiCorrenti;
      if (contiCorrenti != null && contiCorrenti.length > 0) {
        beneficiario.listaContiCorrenti = contiCorrenti.map((contoCorrente) => {
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
      return beneficiario;
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
