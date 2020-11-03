import {Component, OnInit} from '@angular/core';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {ConfirmationService} from 'primeng/api';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Accesso} from '../../../../model/accesso/Accesso';
import {AccessoService} from '../../../../../../services/accesso.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dettaglio-accesso',
  templateUrl: './dettaglio-accesso.component.html',
  styleUrls: ['./dettaglio-accesso.component.scss']
})
export class DettaglioAccessoComponent extends FormElementoParentComponent implements OnInit {

  FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;
  accesso: Accesso = new Accesso();
  titoloPagina = 'Dettaglio Accesso';
  tooltip = 'In questa pagina puoi visualizzare i dettagli di un accesso';
  breadcrumbList = [];

  constructor(confirmationService: ConfirmationService,
              private router: Router,
              http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private accessoService: AccessoService,
              protected activatedRoute: ActivatedRoute
              ) {
    super(confirmationService, activatedRoute, amministrativoService, http);
  }

  ngOnInit(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitora Accessi', link: '/monitoraAccessi/funzione?' + this.amministrativoService.idFunzione},
      {label: 'Dettaglio Accesso', link: null}
    ])

    const idSelezionato = parseInt(this.activatedRoute.snapshot.paramMap.get('accessoid'));
    this.accessoService.recuperaDettaglioAccesso(idSelezionato, this.amministrativoService.idFunzione).subscribe(accesso => {
      this.accesso = accesso;
    });
  }

  onClickSalva(): void {
  }

  tornaIndietro(): void {
    this.router.navigateByUrl('/monitoraAccessi?funzione=' + btoa(this.amministrativoService.idFunzione));
  }
}
