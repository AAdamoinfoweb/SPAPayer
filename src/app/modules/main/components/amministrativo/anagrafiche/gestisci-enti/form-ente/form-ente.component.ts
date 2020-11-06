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
import {InserimentoModificaUtente} from '../../../../../model/utente/InserimentoModificaUtente';
import {PermessoCompleto} from '../../../../../model/permesso/PermessoCompleto';
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
  mapBeneficiario: Map<number, Beneficiario> = new Map();

  // form valid
  isFormDatiEnteValido = false;

  @ViewChild('datiBeneficiario', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  getListaBeneficiari = (mapBeneficiario: Map<number, Beneficiario>) => Array.from(mapBeneficiario, ([name, value]) => value);


  constructor(router: Router,
              activatedRoute: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef, amministrativoService: AmministrativoService,
              private overlayService: OverlayService, http: HttpClient,
              confirmationService: ConfirmationService) {
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
    let instanceDatiBeneficiario: Beneficiario;
    if (datiBeneficiario == null) {
      instanceDatiBeneficiario = new Beneficiario();
    } else {
      instanceDatiBeneficiario = datiBeneficiario;
    }
    this.mapBeneficiario.set(indexBeneficiario, instanceDatiBeneficiario);
    this.componentRef.instance.datiBeneficiario = instanceDatiBeneficiario;
    // output
    this.componentRef.instance.onDeleteDatiBeneficiario.subscribe(index => {
      const beneficiario = this.mapBeneficiario.get(index);
      const isBeneficiarioDaModificare: boolean = beneficiario != null;
      if (isBeneficiarioDaModificare) {
        this.mapBeneficiario.delete(index);
      }
      this.target.remove(index - 1);
    });
    this.componentRef.instance.onChangeDatiBeneficiario.subscribe((currentBeneficiario: BeneficiarioSingolo) => {
      this.mapBeneficiario.set(currentBeneficiario.index, currentBeneficiario.beneficiario);
    });
    this.componentRef.changeDetectorRef.detectChanges();
    return indexBeneficiario;
  }

  letturaEnti(codiceFiscale) {
    // todo service lettura ente
  }

  disabilitaBottone(): boolean {
    return !this.isFormDatiEnteValido || this.controllaDatiBeneficiario() || this.controlloDate();
  }

  controllaDatiBeneficiario(): boolean {
    let ret = false;
    const listaBeneficiari: Beneficiario[] = this.getListaBeneficiari(this.mapBeneficiario);
    listaBeneficiari.forEach(beneficiario => {
      if (beneficiario.descrizione == null || beneficiario.codiceEnte == null) {
        ret = true;
      }
    });
    return ret;
  }

  controlloDate(): boolean {
    // todo controllo date se presenti
    return false;
  }

  onClickSalva(): void {
    // todo inserimento ente e redirect
    const idEnte = 3;
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/modificaUtentePermessi', idEnte]);

  }

  private inserimentoAggiornamentoEnte(codiceFiscale: string, utente: InserimentoModificaUtente) {
    // todo service ente inserimento e aggiornamento
  }

  onClickAnnullaButton() {
    this.onClickAnnulla(this.funzione);
  }

  tornaIndietro() {
    this.router.navigateByUrl('/gestioneAnagrafica/gestioneEnti?funzione=' + this.idFunzione);
  }

}
