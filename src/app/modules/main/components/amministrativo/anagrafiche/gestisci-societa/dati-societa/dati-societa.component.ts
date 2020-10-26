import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {Societa} from '../../../../../model/Societa';
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-societa',
  templateUrl: './dati-societa.component.html',
  styleUrls: ['./dati-societa.component.scss']
})
export class DatiSocietaComponent implements OnInit {
  @Input()
  societa: Societa;

  readonly emailRegex = Utils.EMAIL_REGEX;
  readonly telefonoRegex = Utils.TELEFONO_REGEX;

  @Input()
  funzione: FunzioneGestioneEnum;

  @Output()
  isFormValido = new EventEmitter<boolean>();

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeForm(form: NgForm) {
    this.isFormValido.emit(form.form.status === 'VALID');
  }

  formattaInput(valore: string, campo: string) {
    if (valore === '') {
      this.societa[campo] = null;
    }
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
