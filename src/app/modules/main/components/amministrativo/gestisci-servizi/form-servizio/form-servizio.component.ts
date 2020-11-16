import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormElementoParentComponent} from "../../form-elemento-parent.component";
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {OverlayService} from "../../../../../../services/overlay.service";
import {HttpClient} from "@angular/common/http";
import {AmministrativoService} from "../../../../../../services/amministrativo.service";
import {ViewportRuler} from "@angular/cdk/overlay";
import {ConfirmationService} from "primeng/api";
import {CampoTipologiaServizioService} from "../../../../../../services/campo-tipologia-servizio.service";
import {Breadcrumb, SintesiBreadcrumb} from "../../../../dto/Breadcrumb";
import {ParametriRicercaTipologiaServizio} from "../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio";
import {ParametriRicercaServizio} from "../../../../model/servizio/ParametriRicercaServizio";

@Component({
  selector: 'app-form-servizio',
  templateUrl: './form-servizio.component.html',
  styleUrls: ['./form-servizio.component.scss']
})
export class FormServizioComponent extends FormElementoParentComponent implements OnInit, OnDestroy {

  titoloPagina: string;
  tooltip: string;

  breadcrumbList: Breadcrumb[] = [];
  funzione: FunzioneGestioneEnum;
  filtro: ParametriRicercaServizio;

  constructor(private cdr: ChangeDetectorRef,
              private overlayService: OverlayService,
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
    this.controllaTipoFunzione();
    this.inizializzaBreadcrumb();
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Servizio';
    this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una tipologia servizio';


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

  onChangeFiltri($event: any) {

  }
}
