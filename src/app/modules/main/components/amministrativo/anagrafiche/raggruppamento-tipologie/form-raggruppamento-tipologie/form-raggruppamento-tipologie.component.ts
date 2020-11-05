import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from 'src/app/enums/funzioneGestione.enum';
import {RaggruppamentoTipologiaServizio} from '../../../../../model/RaggruppamentoTipologiaServizio';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ConfirmationService} from 'primeng/api';
import {SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';

@Component({
  selector: 'app-form-raggruppamento-tipologie',
  templateUrl: './form-raggruppamento-tipologie.component.html',
  styleUrls: ['./form-raggruppamento-tipologie.component.scss']
})
export class FormRaggruppamentoTipologieComponent extends FormElementoParentComponent implements OnInit {

  breadcrumbList = [];

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;
  idFunzione;

  titoloPagina: string;
  tooltip: string;

  raggruppamentoTipologiaServizio: RaggruppamentoTipologiaServizio = new RaggruppamentoTipologiaServizio();

  isFormValido: boolean;

  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              confirmationService: ConfirmationService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumb();
      this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Raggruppamento Tipologie';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(this.funzione, false) + ' i dettagli dei raggruppamenti relativi alle tipologie di servizio';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        // TODO logica per recupero informazioni

        window.scrollTo(0, 0);
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(): void {
  }

  inizializzaBreadcrumb() {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb( 'Raggruppamento Tipologie', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Raggruppamento Tipologie', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[1].path;
    switch (url) {
      case 'dettaglioRaggruppamentoTipologie':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiRaggruppamentoTipologie':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaRaggruppamentoTipologie':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  onClickSalva(): void {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        // TODO richiamare operation inserimentoRaggruppamentoTipologiaServizio
        break;
      case FunzioneGestioneEnum.MODIFICA:
        // TODO richiamare operation modificaRaggruppamentoTipologiaServizio
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
