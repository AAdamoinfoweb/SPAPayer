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
              confirmationService: ConfirmationService, private enteService: EnteService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    // get route per logica inserimento o modifica
    this.controllaTipoFunzione(snapshot);
    this.inizializzaBreadcrumbs();
    this.inizializzaTitolo();
    this.inizializzaDatiEnte();
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      // inizializzazione form modifico o dettaglio
      const enteId = snapshot.params.enteId;
      this.letturaEnte(enteId);
    } else {
      // inizializzazione form inserimento
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
    this.mapBeneficiario.set(indexBeneficiario, instanceDatiBeneficiario);
    this.mapControllo.set(indexBeneficiario, false);
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
      this.target.remove(index - 1);
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
      this.datiEnte = ente;
      if(this.funzione === FunzioneGestioneEnum.MODIFICA){
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
    this.datiEnte.listaBeneficiari = this.formattaCampi(this.datiEnte.listaBeneficiari);
    this.datiEnte.listaBeneficiari.forEach((beneficiario) => {
      this.aggiungiBeneficiario(beneficiario);
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
    this.inserimentoEnte().subscribe(enteId => {
      this.configuraRouterAndNavigate();
    });
  }

  private inserimentoEnte(): Observable<any> {
    let listaBeneficiari: Beneficiario[] = this.getListFromMap(this.mapBeneficiario);
    listaBeneficiari = this.formattaCampi(listaBeneficiari);
    this.datiEnte.listaBeneficiari = listaBeneficiari;
    return this.enteService.inserimentoEnte(this.datiEnte, this.idFunzione);
  }

  private configuraRouterAndNavigate() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(this.basePath + '/aggiungiEnte');
  }

  private formattaCampi(listaBeneficiari: Beneficiario[]) {
    listaBeneficiari = listaBeneficiari.map((beneficiario) => {
      const contiCorrenti = beneficiario.listaContiCorrenti;
      if (contiCorrenti != null && contiCorrenti.length > 0) {
        beneficiario.listaContiCorrenti = contiCorrenti.map((contoCorrente) => {
          const inizioValidita = contoCorrente.inizioValidita;
          if (inizioValidita != null) {
            if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
              contoCorrente.inizioValidita = moment(inizioValidita, Utils.FORMAT_DATE_CALENDAR)
                .format(Utils.FORMAT_LOCAL_DATE_TIME);
            } else {
              contoCorrente.inizioValidita = moment(inizioValidita, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
                .format(Utils.FORMAT_DATE_CALENDAR);
            }
          }
          const fineValidita = contoCorrente.fineValidita;
          if (fineValidita != null) {
            if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
              contoCorrente.fineValidita = moment(fineValidita, Utils.FORMAT_DATE_CALENDAR)
                .format(Utils.FORMAT_LOCAL_DATE_TIME_TO);
            } else {
              contoCorrente.fineValidita = moment(fineValidita, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
                .format(Utils.FORMAT_DATE_CALENDAR);
            }
          }
          return contoCorrente;
        });
      }
      return beneficiario;
    });
    return listaBeneficiari;
  }

  onClickAnnullaButton() {
    this.onClickAnnulla(this.funzione);
  }

}
