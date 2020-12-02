import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from 'src/app/enums/funzioneGestione.enum';
import {DettaglioPendenza} from '../../../../../../model/transazione/DettaglioPendenza';
import {FormElementoParentComponent} from '../../../../form-elemento-parent.component';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../../services/amministrativo.service';
import {MonitoraggioTransazioniService} from '../../../../../../../../services/monitoraggio-transazioni.service';

@Component({
  selector: 'app-dettaglio-pendenza',
  templateUrl: './dettaglio-pendenza.component.html',
  styleUrls: ['./dettaglio-pendenza.component.scss']
})
export class DettaglioPendenzaComponent extends FormElementoParentComponent implements OnInit {

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;

  datiPendenza: DettaglioPendenza = new DettaglioPendenza();
  titoloPagina = 'Dettaglio Pendenza';
  tooltip = 'In questa pagina puoi visualizzare il dettaglio di una singola pendenza selezionata dal dettaglio della transazione';

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
      {label: 'Dettaglio Pendenza', link: null}
    ], true);

    const idSelezionato = parseInt(this.activatedRoute.snapshot.paramMap.get('dettaglioTransazioneId'));
    this.monitoraggioTransazioniService.dettaglioPendenza(idSelezionato, this.idFunzione).subscribe(datiPendenza => {
      this.datiPendenza = datiPendenza;
    });
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
