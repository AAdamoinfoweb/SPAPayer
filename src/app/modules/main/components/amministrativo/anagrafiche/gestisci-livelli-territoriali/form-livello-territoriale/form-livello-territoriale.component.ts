import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {LivelloTerritorialeService} from '../../../../../../../services/livelloTerritoriale.service';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {ConfirmationService} from 'primeng/api';
import {Utils} from '../../../../../../../utils/Utils';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BannerService} from '../../../../../../../services/banner.service';

@Component({
  selector: 'app-dettaglio-livello-territoriale',
  templateUrl: './form-livello-territoriale.component.html',
  styleUrls: ['./form-livello-territoriale.component.scss']
})
export class FormLivelloTerritorialeComponent extends FormElementoParentComponent implements OnInit {

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;

  titoloPagina: string;
  tooltip: string;
  livelloTerritoriale: LivelloTerritoriale = new LivelloTerritoriale();
  isFormValido: boolean;

  urlPaginaGestione = '/gestisciLivelliTerritoriali';

  breadcrumbList = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected amministrativoService: AmministrativoService,
    private overlayService: OverlayService,
    private livelloTerritorialeService: LivelloTerritorialeService,
    confirmationService: ConfirmationService,
    protected http: HttpClient, private bannerService: BannerService
  ) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumbs();
      this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Livello Territoriale';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di un livello territoriale';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.livelloTerritoriale.id = parseInt(this.activatedRoute.snapshot.paramMap.get('livelloterritorialeid'));
        this.livelloTerritorialeService.ricercaLivelliTerritoriali(this.livelloTerritoriale.id, this.idFunzione).subscribe(listaLivelliTerritoriali => {
          this.livelloTerritoriale = listaLivelliTerritoriali[0];
        });
      }
    });
  }

  ngOnInit(): void {
  }

  inizializzaBreadcrumbs() {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Livello Territoriale', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Livello Territoriale', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioLivelloTerritoriale':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiLivelloTerritoriale':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaLivelloTerritoriale':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  onClickSalva(): void {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.livelloTerritorialeService.aggiuntaLivelloTerritoriale(this.livelloTerritoriale, this.idFunzione).subscribe((livelloTerritoriale) => {
          this.livelloTerritoriale = new LivelloTerritoriale();
          this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.livelloTerritorialeService.modificaLivelloTerritoriale(this.livelloTerritoriale, this.idFunzione).subscribe((response) => {
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
