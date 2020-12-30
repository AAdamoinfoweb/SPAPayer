import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../../form-elemento-parent.component';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {QuadraturaService} from '../../../../../../../services/quadratura.service';
import {DettaglioQuadratura} from '../../../../../model/quadratura/DettaglioQuadratura';

@Component({
  selector: 'app-dettaglio-quadratura',
  templateUrl: './dettaglio-quadratura.component.html',
  styleUrls: ['./dettaglio-quadratura.component.scss']
})
export class DettaglioQuadraturaComponent extends FormElementoParentComponent implements OnInit {

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;

  datiQuadratura: DettaglioQuadratura = new DettaglioQuadratura();
  titoloPagina = 'Dettaglio Flusso Di Quadratura';
  tooltip = 'In questa pagina puoi visualizzare i dettagli dei flussi di quadratura';
  breadcrumbList = [];

  constructor(confirmationService: ConfirmationService, protected router: Router, http: HttpClient,
              protected amministrativoService: AmministrativoService, protected activatedRoute: ActivatedRoute,
              private quadraturaService: QuadraturaService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
  }

  ngOnInit(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Quadratura', link: this.basePath},
      {label: 'Dettaglio Flusso Di Quadratura', link: null}
    ], true);

    const idSelezionato = parseInt(this.activatedRoute.snapshot.paramMap.get('quadraturaId'));
    this.quadraturaService.recuperaDettaglioQuadratura(idSelezionato, this.idFunzione).subscribe(quadratura => {
      this.datiQuadratura = quadratura;
    });
  }

  onClickSalva(): void {
  }

}
