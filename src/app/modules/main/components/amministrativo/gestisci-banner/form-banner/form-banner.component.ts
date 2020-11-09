import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from 'src/app/enums/funzioneGestione.enum';
import {Banner} from '../../../../model/banner/Banner';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ConfirmationService} from 'primeng/api';
import {BannerService} from '../../../../../../services/banner.service';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {Utils} from '../../../../../../utils/Utils';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dettaglio-banner',
  templateUrl: './form-banner.component.html',
  styleUrls: ['./form-banner.component.scss']
})
export class FormBannerComponent extends FormElementoParentComponent implements OnInit {

  breadcrumbList = [];

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;

  titoloPagina: string;
  tooltip: string;

  datiBanner: Banner = new Banner();

  isFormValido: boolean;

  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              confirmationService: ConfirmationService, private bannerService: BannerService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumb();
      this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Banner';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di un banner';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.datiBanner.id = Number(this.activatedRoute.snapshot.paramMap.get('bannerid'));
        this.bannerService.dettaglioBanner(this.datiBanner.id, this.idFunzione).subscribe(banner => {
          if (banner != null) {
            this.datiBanner = banner;
            this.datiBanner.inizio = this.datiBanner?.inizio ? moment(this.datiBanner.inizio).format(Utils.FORMAT_DATE_CALENDAR) : null;
            this.datiBanner.fine = this.datiBanner?.fine ? moment(this.datiBanner.fine).format(Utils.FORMAT_DATE_CALENDAR) : null;
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
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Banner', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Banner', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  controllaTipoFunzione(): void {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioBanner':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiBanner':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaBanner':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  onClickSalva(): void {
    const datiBanner = {...this.datiBanner};
    datiBanner.inizio = this.datiBanner.inizio
      ? moment(datiBanner.inizio, Utils.FORMAT_DATE_CALENDAR).format('YYYY-MM-DD[T]HH:mm')
      : null;
    datiBanner.fine = this.datiBanner.fine
      ? moment(datiBanner.fine, Utils.FORMAT_DATE_CALENDAR).format('YYYY-MM-DD[T]HH:mm')
      : null;
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.bannerService.inserimentoBanner(datiBanner, this.idFunzione).subscribe((banner) => {
          if (banner != null) {
            this.datiBanner = new Banner();
            this.isFormValido = false;
          }
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.bannerService.modificaBanner(datiBanner, this.idFunzione).subscribe(() => {
          this.isFormValido = false;
        });
        break;
    }
  }

  onChangeForm(isFormValido: boolean): void {
    this.isFormValido = isFormValido;
  }

  disabilitaBottone(): boolean {
    return !this.isFormValido;
  }

}
