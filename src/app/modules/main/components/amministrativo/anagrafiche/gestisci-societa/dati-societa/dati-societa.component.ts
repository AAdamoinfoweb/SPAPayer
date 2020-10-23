import {Component, Input, OnInit} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {Societa} from '../../../../../model/Societa';

@Component({
  selector: 'app-dati-societa',
  templateUrl: './dati-societa.component.html',
  styleUrls: ['./dati-societa.component.scss']
})
export class DatiSocietaComponent implements OnInit {
  @Input()
  societa: Societa;

  @Input()
  funzione: FunzioneGestioneEnum;

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeForm(form: NgForm) {
    // TODO onChangeForm
  }

  isCampoInvalido(campo: NgModel) {
    return campo.control?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }
}
