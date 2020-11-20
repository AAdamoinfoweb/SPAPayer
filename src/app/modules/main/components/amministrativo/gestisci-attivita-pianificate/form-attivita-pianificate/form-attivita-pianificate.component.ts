import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {HttpClient} from '@angular/common/http';
import {SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {Statistica} from '../../../../model/statistica/Statistica';
import {StatisticaService} from '../../../../../../services/statistica.service';
import {Utils} from '../../../../../../utils/Utils';
import {BannerService} from '../../../../../../services/banner.service';
import * as moment from 'moment';
import {AttivitaPianificata} from "../../../../model/attivitapianificata/AttivitaPianificata";
import {AttivitaPianificataService} from "../../../../../../services/attivita-pianificata.service";
import {ParametroAttivitaPianificata} from "../../../../model/attivitapianificata/ParametroAttivitaPianificata";
import {parseArguments} from "@angular/cli/models/parser";

@Component({
  selector: 'app-form-attivita-pianificate',
  templateUrl: './form-attivita-pianificate.component.html',
  styleUrls: ['./form-attivita-pianificate.component.scss']
})
export class FormAttivitaPianificateComponent extends FormElementoParentComponent implements OnInit {

  constructor(confirmationService: ConfirmationService,
              protected activatedRoute: ActivatedRoute,
              protected amministrativoService: AmministrativoService,
              protected http: HttpClient, private attivitaPianificataService: AttivitaPianificataService,
              protected router: Router, private bannerService: BannerService) {
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
  datiAttivitaPianificata: AttivitaPianificata = new AttivitaPianificata();
  isFormValid: boolean;

  ngOnInit(): void {
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    // get route per logica inserimento o modifica
    this.controllaTipoFunzione(snapshot);
    this.inizializzaBreadcrumbs();
    this.inizializzaTitolo();
    this.inizializzaDatiAttivitaPianificata();
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      // inizializzazione form modifica o dettaglio
      const attivitaId = snapshot.params.attivitaId;
      this.letturaAttivitaPianificata(attivitaId);
    } else {
      // inizializzazione form inserimento
    }
  }

  controllaTipoFunzione(snapshot) {
    const url = snapshot.url[1].path;
    switch (url) {
      case 'dettaglioAttivitaPianificata':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiAttivitaPianificata':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaAttivitaPianificata':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  inizializzaBreadcrumbs(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Attività Pianificate', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Attività Pianificata', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  private inizializzaTitolo() {
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Attività Pianificata';
    this.tooltipTitolo = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli di una attività pianificata';
  }

  inizializzaDatiAttivitaPianificata() {
    this.datiAttivitaPianificata.schedulazione.timeZone = Utils.TIME_ZONE;
    this.datiAttivitaPianificata.abilitato = false;
    // inizializzo campo da compilare
    const parametri: ParametroAttivitaPianificata = new ParametroAttivitaPianificata();
    parametri.chiave = null;
    parametri.valore = null;
    parametri.uuid = Utils.uuidv4();
    this.datiAttivitaPianificata.parametri.push(parametri);
  }

  onClickSalva(): void {
    const attivitaPianificata: AttivitaPianificata = this.formattaDati(this.datiAttivitaPianificata);
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      this.inserimentoAttivitaPianificata(attivitaPianificata);
    } else if (this.funzione === FunzioneGestioneEnum.MODIFICA) {
      this.modificaAttivitaPianificata(attivitaPianificata);
    }
  }

  private formattaDati(attivitaPianificata: AttivitaPianificata, lettura = false): AttivitaPianificata {
    const attivitaPianificataCopy: AttivitaPianificata = JSON.parse(JSON.stringify(attivitaPianificata));
    if (attivitaPianificataCopy.schedulazione.inizio) {
      attivitaPianificataCopy.schedulazione.inizio = !lettura ?
        moment(attivitaPianificataCopy.schedulazione.inizio, Utils.FORMAT_DATE_CALENDAR)
          .format(Utils.FORMAT_LOCAL_DATE_TIME) :
        moment(attivitaPianificataCopy.schedulazione.inizio, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
          .format(Utils.FORMAT_DATE_CALENDAR);
    }
    if (attivitaPianificataCopy.schedulazione.fine) {
      attivitaPianificataCopy.schedulazione.fine = !lettura ?
        moment(attivitaPianificataCopy.schedulazione.fine, Utils.FORMAT_DATE_CALENDAR)
          .format(Utils.FORMAT_LOCAL_DATE_TIME_TO) :
        moment(attivitaPianificataCopy.schedulazione.fine, Utils.FORMAT_LOCAL_DATE_TIME_ISO)
          .format(Utils.FORMAT_DATE_CALENDAR);
    }
    return attivitaPianificataCopy;
  }

  private inserimentoAttivitaPianificata(attivitaPianificata: AttivitaPianificata) {
    this.attivitaPianificataService.inserimentoAttivitaPianificata(attivitaPianificata, this.idFunzione).subscribe((attivitaPianificataId) =>
      this.configuraRouterAndNavigate('/aggiungiAttivitaPianificata/'));
  }

  private modificaAttivitaPianificata(attivitaPianificata: AttivitaPianificata) {
    this.attivitaPianificataService.modificaAttivitaPianificata(attivitaPianificata, this.idFunzione).subscribe((attivitaPianificataId) =>
      this.configuraRouterAndNavigate('/modificaAttivitaPianificata/' + attivitaPianificataId));
  }

  private configuraRouterAndNavigate(pathFunzione: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.basePath + pathFunzione]);
  }

  disabilitaBottone(): boolean {
    return !this.isFormValid;
  }

  letturaAttivitaPianificata(attivitaPianificataId) {
    this.attivitaPianificataService.dettaglioAttivitaPianificata(attivitaPianificataId, this.idFunzione).subscribe((attivitaPianificata) => {
      // inizializza dati ente per modifica
      attivitaPianificata = this.formattaDati(attivitaPianificata, true);
      this.datiAttivitaPianificata = attivitaPianificata;
      this.isFormValid = true;
    });
  }
}
