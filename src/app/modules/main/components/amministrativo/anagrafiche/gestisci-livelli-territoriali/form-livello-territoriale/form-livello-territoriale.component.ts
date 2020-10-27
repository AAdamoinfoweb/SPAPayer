import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb, SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {LivelloTerritorialeService} from '../../../../../../../services/livelloTerritoriale.service';
import {FormElementoParentComponent} from "../../../form-elemento-parent.component";
import {ConfirmationService} from 'primeng/api';
import {Utils} from '../../../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../../../enums/tipoModale.enum';

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

  breadcrumbList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private amministrativoService: AmministrativoService,
    private overlayService: OverlayService,
    private livelloTerritorialeService: LivelloTerritorialeService,
    private confirmationService: ConfirmationService
  ) { super(); }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumbs();
      this.titoloPagina = this.getTestoFunzione() + ' Livello Territoriale';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(false) + ' i dettagli di un livello territoriale';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.livelloTerritoriale.id = parseInt(this.activatedRoute.snapshot.paramMap.get('livelloterritorialeid'));
        this.livelloTerritorialeService.ricercaLivelliTerritoriali(this.livelloTerritoriale.id, this.amministrativoService.idFunzione).subscribe(listaLivelliTerritoriali => {
          this.livelloTerritoriale = listaLivelliTerritoriali[0];
        });
      }
    });
  }

  inizializzaBreadcrumbs() {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Livello Territoriale', 'livelliTerritoriali/' + this.amministrativoService.idFunzione));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione() + ' Livello Territoriale', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[0].path;
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

  getTestoFunzione(isTitolo: boolean = true) {
    switch (this.funzione) {
      case FunzioneGestioneEnum.DETTAGLIO:
        return isTitolo ? 'Dettaglio' : 'visualizzare';
        break;
      case FunzioneGestioneEnum.AGGIUNGI:
        return isTitolo ? 'Aggiungi' : 'aggiungere';
        break;
      case FunzioneGestioneEnum.MODIFICA:
        return isTitolo ? 'Modifica' : 'modificare';
        break;
      default:
        return '';
    }
  }

  onClickAnnulla() {
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      this.tornaIndietro();
    } else {
      this.confirmationService.confirm(
        Utils.getModale(() => {
            this.tornaIndietro();
          },
          TipoModaleEnum.ANNULLA
        )
      );
    }
  }

  tornaIndietro() {
    this.router.navigateByUrl('/livelliTerritoriali?funzione=' + btoa(this.amministrativoService.idFunzione));
  }

  onClickSalva() {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.livelloTerritorialeService.aggiuntaLivelloTerritoriale(this.livelloTerritoriale, this.amministrativoService.idFunzione).subscribe((livelloTerritoriale) => {
          this.livelloTerritoriale = new LivelloTerritoriale();
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.livelloTerritorialeService.modificaLivelloTerritoriale(this.livelloTerritoriale, this.amministrativoService.idFunzione).subscribe(() => {
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
