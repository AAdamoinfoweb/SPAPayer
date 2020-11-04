import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {NgForm, NgModel} from '@angular/forms';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';

@Component({
  selector: 'app-dati-livello-territoriale',
  templateUrl: './dati-livello-territoriale.component.html',
  styleUrls: ['./dati-livello-territoriale.component.scss']
})
export class DatiLivelloTerritorialeComponent implements OnInit {
  @Input()
  livelloTerritoriale: LivelloTerritoriale;

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
      this.livelloTerritoriale[campo] = null;
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
