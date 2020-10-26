import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb} from '../../../../../dto/Breadcrumb';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {LivelloTerritorialeService} from '../../../../../../../services/livelloTerritoriale.service';

@Component({
  selector: 'app-dettaglio-livello-territoriale',
  templateUrl: './dettaglio-livello-territoriale.component.html',
  styleUrls: ['./dettaglio-livello-territoriale.component.scss']
})
export class DettaglioLivelloTerritorialeComponent implements OnInit {

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
    private livelloTerritorialeService: LivelloTerritorialeService
  ) { }

  ngOnInit(): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.activatedRoute.params.subscribe(() => {
      this.controllaTipoFunzione();
      this.inizializzaBreadcrumbList();
      this.titoloPagina = this.getTestoFunzione() + ' Livello Territoriale';
      this.tooltip = 'In questa pagina puoi ' + this.getTestoFunzione(false) + ' i dettagli di un livello territoriale';
      if (this.funzione === FunzioneGestioneEnum.DETTAGLIO || this.funzione === FunzioneGestioneEnum.MODIFICA) {
        this.livelloTerritoriale.id = parseInt(this.activatedRoute.snapshot.paramMap.get('livelloterritorialeid'));
        this.livelloTerritorialeService.ricercaLivelliTerritoriali(this.livelloTerritoriale.id, this.amministrativoService.idFunzione).subscribe(listaLivelliTerritoriali => {
          this.livelloTerritoriale = listaLivelliTerritoriali[0];
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
    this.breadcrumbList.push(new Breadcrumb(3, 'Gestisci Livello Territoriale', null, null));
    this.breadcrumbList.push(new Breadcrumb(4, this.getTestoFunzione() + ' Livello Territoriale', null, null));
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
    this.overlayService.caricamentoEvent.emit(true);
    this.router.navigateByUrl('/livelliTerritoriali?funzione=' + btoa(this.amministrativoService.idFunzione));
  }

  onClickSalva() {
    this.overlayService.caricamentoEvent.emit(true);
    switch (this.funzione) {
      case FunzioneGestioneEnum.AGGIUNGI:
        this.livelloTerritorialeService.aggiuntaLivelloTerritoriale(this.livelloTerritoriale, this.amministrativoService.idFunzione).subscribe((livelloTerritoriale) => {
          this.overlayService.caricamentoEvent.emit(false);
          this.livelloTerritoriale = new LivelloTerritoriale();
        });
        break;
      case FunzioneGestioneEnum.MODIFICA:
        this.livelloTerritorialeService.modificaLivelloTerritoriale(this.livelloTerritoriale, this.amministrativoService.idFunzione).subscribe(() => {
          this.overlayService.caricamentoEvent.emit(false);
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
