import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Societa} from '../../../../../model/Societa';
import {SocietaService} from '../../../../../../../services/societa.service';

@Component({
  selector: 'app-dettaglio-societa',
  templateUrl: './dettaglio-societa.component.html',
  styleUrls: ['./dettaglio-societa.component.scss']
})
export class DettaglioSocietaComponent implements OnInit {

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum;
  titoloPagina: string;
  tooltip: string;
  societa: Societa = new Societa();

  breadcrumbList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private amministrativoService: AmministrativoService,
    private overlayService: OverlayService,
    private societaService: SocietaService
  ) { }

  ngOnInit(): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumbList();
      this.titoloPagina = this.getTestoFunzione() + ' Società';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(false) + ' i dettagli di una società';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.societa.id = parseInt(this.activatedRoute.snapshot.paramMap.get('societaid'));
        this.societaService.ricercaSocieta(this.societa.id, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
          this.societa = listaSocieta[0];
          this.overlayService.caricamentoEvent.emit(false);
        })
      } else {
        this.overlayService.caricamentoEvent.emit(false);
      }
    });
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList = [];
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Anagrafiche', null, null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Gestisci Società', null, null));
    this.breadcrumbList.push(new Breadcrumb(4, this.getTestoFunzione() + ' Società', null, null));
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
    this.router.navigateByUrl('/societa?funzione=' + btoa(this.amministrativoService.idFunzione));
  }

  onClickSalva() {
    // TODO
  }

  disabilitaBottone() {
    // TODO
  }

}
