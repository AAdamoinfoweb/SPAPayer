import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb, SintesiBreadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Societa} from '../../../../../model/Societa';
import {SocietaService} from '../../../../../../../services/societa.service';
import {FormElementoParentComponent} from "../../../form-elemento-parent.component";
import {ConfirmationService} from 'primeng/api';
import {Utils} from '../../../../../../../utils/Utils';
import {TipoModaleEnum} from '../../../../../../../enums/tipoModale.enum';

@Component({
  selector: 'app-dettaglio-societa',
  templateUrl: './form-societa.component.html',
  styleUrls: ['./form-societa.component.scss']
})
export class FormSocietaComponent extends FormElementoParentComponent implements OnInit {

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;
  titoloPagina: string;
  tooltip: string;
  societa: Societa = new Societa();
  isFormValido: boolean;

  breadcrumbList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private amministrativoService: AmministrativoService,
    private overlayService: OverlayService,
    private societaService: SocietaService,
    private confirmationService: ConfirmationService
  ) { super();}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumb();
      this.titoloPagina = this.getTestoFunzione() + ' Società';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(false) + ' i dettagli di una società';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.societa.id = parseInt(this.activatedRoute.snapshot.paramMap.get('societaid'));
        this.societaService.ricercaSocieta(this.societa.id, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
          this.societa = listaSocieta[0];
        })
      } else {
      }
    });
  }

  inizializzaBreadcrumb(): void {
    const breadcrumbs: SintesiBreadcrumb[] = []
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Anagrafiche', null));
    breadcrumbs.push(new SintesiBreadcrumb( 'Gestisci Società', '/societa/' + this.amministrativoService.idFunzione));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione() + ' Società', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
    }

  controllaTipoFunzione() {
    const url = this.activatedRoute.snapshot.url[0].path;
    switch (url) {
      case 'dettaglioSocieta':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiSocieta':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaSocieta':
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
    this.router.navigateByUrl('/societa?funzione=' + btoa(this.amministrativoService.idFunzione));
  }

  onClickSalva() {
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.societaService.aggiuntaSocieta(this.societa, this.amministrativoService.idFunzione).subscribe((societa) => {
          this.societa = new Societa();
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.societaService.modificaSocieta(this.societa, this.amministrativoService.idFunzione).subscribe(() => {
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
