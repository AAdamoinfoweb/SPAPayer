import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../../../enums/funzioneGestione.enum';
import {EsitoNotifica} from '../../../../../../model/transazione/EsitoNotifica';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../../services/amministrativo.service';
import {MonitoraggioTransazioniService} from '../../../../../../../../services/monitoraggio-transazioni.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-dettaglio-esito-notifica',
  templateUrl: './dettaglio-esito-notifica.component.html',
  styleUrls: ['./dettaglio-esito-notifica.component.scss']
})
export class DettaglioEsitoNotificaComponent extends FormElementoParentComponent implements OnInit {

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;

  datiNotifica: EsitoNotifica = new EsitoNotifica();

  titoloPagina = 'Dettaglio Esito Notifica';
  tooltip = 'In questa pagina puoi visualizzare l\'esito delle notifiche inviate al portale esterno';

  breadcrumbList = [];

  constructor(confirmationService: ConfirmationService, protected router: Router, http: HttpClient,
              protected amministrativoService: AmministrativoService, protected activatedRoute: ActivatedRoute,
              private monitoraggioTransazioniService: MonitoraggioTransazioniService, private location: Location) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
  }

  ngOnInit(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitoraggio Transazioni', link: this.basePath},
      {label: 'Dettaglio Transazione', link: null},
      {label: 'Dettaglio Esito Notifica', link: null}
    ], true);

    const idSelezionato = parseInt(this.activatedRoute.snapshot.paramMap.get('transazioneId'));
    this.monitoraggioTransazioniService.dettaglioEsitoNotifica(idSelezionato, this.idFunzione).subscribe(datiNotifica => {
      this.datiNotifica = datiNotifica;
    });

    window.scrollTo(0, 0);
  }

  redirect(index, link): void {
    if (index === 3) {
      this.tornaIndietro();
    } else {
      this.router.navigateByUrl(link);
    }
  }

  tornaIndietro(): void {
    this.location.back();
  }

  onClickSalva(): void {
  }

}
