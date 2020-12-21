import {Component, Input, OnInit} from '@angular/core';
import {TipoPortaleEsterno} from '../../../../model/configuraportaliesterni/TipoPortaleEsterno';
import {NgModel} from '@angular/forms';
import {OverlayService} from '../../../../../../services/overlay.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';

@Component({
  selector: 'app-modale-tipo-portale-esterno',
  templateUrl: './modale-tipo-portale-esterno.component.html',
  styleUrls: ['./modale-tipo-portale-esterno.component.scss']
})
export class ModaleTipoPortaleEsternoComponent implements OnInit {

  @Input() datiTipoPortale: TipoPortaleEsterno;

  readonly maxLengthCodice = 3;
  readonly maxLengthDescrizione = 20;

  constructor(private overlayService: OverlayService, private amministrativoService: AmministrativoService) {
  }

  ngOnInit(): void {
  }

  isCampoInvalido(campo: NgModel): boolean {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  onClickAnnulla(): void {
    this.overlayService.mostraModaleTipoPortaleEsternoEvent.emit(null);
  }

  onClickOk(): void {
    this.amministrativoService.salvaTipoPortaleEsternoEvent.emit(this.datiTipoPortale);
  }

}
