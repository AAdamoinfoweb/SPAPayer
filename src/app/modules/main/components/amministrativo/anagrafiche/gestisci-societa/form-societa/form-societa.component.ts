import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Societa} from '../../../../../model/Societa';
import {SocietaService} from '../../../../../../../services/societa.service';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {ConfirmationService} from 'primeng/api';
import {Utils} from '../../../../../../../utils/Utils';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BannerService} from '../../../../../../../services/banner.service';

@Component({
  selector: 'app-dettaglio-societa',
  templateUrl: './form-societa.component.html',
  styleUrls: ['./form-societa.component.scss']
})
export class FormSocietaComponent extends FormElementoParentComponent implements OnInit {

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;

  titoloPagina: string;
  tooltip: string;
  societa: Societa = new Societa();
  isFormValido: boolean;

  breadcrumbList = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected http: HttpClient,
    protected amministrativoService: AmministrativoService,
    private overlayService: OverlayService,
    private societaService: SocietaService,
    confirmationService: ConfirmationService,
    private bannerService: BannerService
  ) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumb();
      this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Società';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una società';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.societa.id = parseInt(this.activatedRoute.snapshot.paramMap.get('societaid'));
        this.societaService.ricercaSocieta(this.societa.id, this.idFunzione).subscribe(listaSocieta => {
          this.societa = listaSocieta[0];
        });
      }
    });
  }

  ngOnInit(): void {
  }

  inizializzaBreadcrumb(): void {
    const breadcrumbs: SintesiBreadcrumb[] = []
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Società', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Società', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
    }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioSocieta':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiSocieta':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaSocieta':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  onClickSalva(): void {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.societaService.aggiuntaSocieta(this.societa, this.idFunzione).subscribe((response) => {
          if (!(response instanceof HttpErrorResponse)) {
            this.societa = new Societa();
            this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
          }
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.societaService.modificaSocieta(this.societa, this.idFunzione).subscribe((response) => {
          if (!(response instanceof HttpErrorResponse)) {
            this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
          }
        });
        break;
    }
  }

  onChangeForm(isFormValido: boolean) {
    this.isFormValido = isFormValido;
  }

  disabilitaBottone() {
    return !this.isFormValido;
  }

}
