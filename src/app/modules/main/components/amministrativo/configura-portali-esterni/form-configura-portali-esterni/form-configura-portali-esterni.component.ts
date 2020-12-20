import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ConfiguraPortaleEsterno} from '../../../../model/configuraportaliesterni/ConfiguraPortaleEsterno';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ConfirmationService} from 'primeng/api';
import {ConfiguraPortaliEsterniService} from '../../../../../../services/configura-portali-esterni.service';
import {SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {BannerService} from '../../../../../../services/banner.service';
import {Utils} from '../../../../../../utils/Utils';
import {TipoPortaleEsterno} from '../../../../model/configuraportaliesterni/TipoPortaleEsterno';

@Component({
  selector: 'app-form-configura-portali-esterni',
  templateUrl: './form-configura-portali-esterni.component.html',
  styleUrls: ['./form-configura-portali-esterni.component.scss']
})
export class FormConfiguraPortaliEsterniComponent extends FormElementoParentComponent implements OnInit {

  breadcrumbList = [];

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;

  titoloPagina: string;
  tooltip: string;

  datiPortaleEsterno: ConfiguraPortaleEsterno = new ConfiguraPortaleEsterno();
  portaleEsternoId: number;

  isFormValido: boolean;

  constructor(protected router: Router, protected activatedRoute: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService, confirmationService: ConfirmationService,
              private configuraPortaliEsterniService: ConfiguraPortaliEsterniService, private bannerService: BannerService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumb();
      this.inizializzaDatiPortaleEsterno();
      this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Portale Esterno';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di un portale esterno';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.portaleEsternoId = Number(this.activatedRoute.snapshot.paramMap.get('portaleEsternoId'));
        this.configuraPortaliEsterniService.dettaglioPortaleEsterno(this.portaleEsternoId, this.idFunzione).subscribe(portaleEsterno => {
          if (portaleEsterno != null) {
            this.datiPortaleEsterno = portaleEsterno;
          }
        });
        window.scrollTo(0, 0);
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
  }

  inizializzaBreadcrumb(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Configura Portali Esterni', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Portale Esterno', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  controllaTipoFunzione(): void {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioPortaleEsterno':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiPortaleEsterno':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaPortaleEsterno':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  onClickSalva(): void {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.configuraPortaliEsterniService.inserimentoPortaleEsterno(this.datiPortaleEsterno, this.idFunzione).subscribe((portaleEsterno) => {
          if (portaleEsterno != null) {
            this.datiPortaleEsterno = new ConfiguraPortaleEsterno();
            this.inizializzaDatiPortaleEsterno();
            this.isFormValido = false;
            this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
          }
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.configuraPortaliEsterniService.modificaPortaleEsterno(this.portaleEsternoId, this.datiPortaleEsterno, this.idFunzione).subscribe((response) => {
          if (!(response instanceof HttpErrorResponse)) {
            this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
          }
          this.isFormValido = false;
        });
        break;
    }
  }

  inizializzaDatiPortaleEsterno(): void {
    this.datiPortaleEsterno.waitingPagePayer = false;
    this.datiPortaleEsterno.tipoPortaleEsterno = new TipoPortaleEsterno();
  }

  onChangeForm(isFormValido: boolean): void {
    this.isFormValido = isFormValido;
  }

  disabilitaBottone(): boolean {
    return !this.isFormValido;
  }

}
