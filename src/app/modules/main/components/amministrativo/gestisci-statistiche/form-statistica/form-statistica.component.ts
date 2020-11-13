import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {Statistica} from '../../../../model/statistica/Statistica';
import {Schedulazione} from "../../../../model/statistica/Schedulazione";

@Component({
  selector: 'app-form-statistica',
  templateUrl: './form-statistica.component.html',
  styleUrls: ['./form-statistica.component.scss']
})
export class FormStatisticaComponent extends FormElementoParentComponent implements OnInit {

  constructor(confirmationService: ConfirmationService,
              protected activatedRoute: ActivatedRoute,
              protected amministrativoService: AmministrativoService,
              protected http: HttpClient,
              protected router: Router) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  // enums e consts class
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  // page
  breadcrumbList = [];
  tooltipTitolo: string;
  titoloPagina: string;
  // dati
  idFunzione;
  funzione: FunzioneGestioneEnum;
  datiStatistica: Statistica = new Statistica();

  ngOnInit(): void {
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    // get route per logica inserimento o modifica
    this.controllaTipoFunzione(snapshot);
    this.inizializzaBreadcrumbs();
    this.inizializzaTitolo();
    this.inizializzaDatiStatistica();
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      // inizializzazione form modifica o dettaglio
      const statisticaId = snapshot.params.statisticaId;
      this.letturaStatistica(statisticaId);
    } else {
      // inizializzazione form inserimento
    }
  }

  controllaTipoFunzione(snapshot) {
    const url = snapshot.url[1].path;
    switch (url) {
      case 'dettaglioStatistica':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiStatistica':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaStatistica':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  inizializzaBreadcrumbs(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Statistiche', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Statistica', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  private inizializzaTitolo() {
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Statistica';
    this.tooltipTitolo = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una statistica ed eseguire una query';
  }

  inizializzaDatiStatistica() {
  }

  onClickSalva(): void {
  }

  disabilitaBottone(): boolean {
    return false;
  }

  eseguiScaricaFile() {

  }

  letturaStatistica(statisticaId) {
  }
}
