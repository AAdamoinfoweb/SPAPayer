import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {Rendicontazione} from '../../../../../model/rendicontazione/Rendicontazione';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ConfirmationService} from 'primeng/api';
import {RendicontazioneService} from '../../../../../../../services/rendicontazione.service';

@Component({
  selector: 'app-dettaglio-rendicontazione',
  templateUrl: './dettaglio-rendicontazione.component.html',
  styleUrls: ['./dettaglio-rendicontazione.component.scss']
})
export class DettaglioRendicontazioneComponent extends FormElementoParentComponent implements OnInit {

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;

  datiRendicontazione: Rendicontazione = new Rendicontazione();
  titoloPagina = 'Dettaglio Rendicontazione';
  tooltip = 'In questa pagina puoi visualizzare il dettaglio dei flussi di rendicontazione';

  breadcrumbList = [];

  constructor(confirmationService: ConfirmationService, protected router: Router, http: HttpClient,
              protected amministrativoService: AmministrativoService, protected activatedRoute: ActivatedRoute,
              private rendicontazioneService: RendicontazioneService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
  }

  ngOnInit(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Rendicontazione', link: this.basePath},
      {label: 'Dettaglio Rendicontazione', link: null}
    ], true);

    const idSelezionato = parseInt(this.activatedRoute.snapshot.paramMap.get('rendicontazioneId'));
    this.rendicontazioneService.dettaglioRendicontazione(idSelezionato, this.idFunzione).subscribe(datiRendicontazione => {
      this.datiRendicontazione = datiRendicontazione;
    });
  }

  onClickSalva(): void {
  }

}
