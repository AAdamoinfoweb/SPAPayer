import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import * as moment from 'moment';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {EnteCompleto} from '../../../../../model/ente/EnteCompleto';
import {FunzioneGestioneEnum} from "../../../../../../../enums/funzioneGestione.enum";
import {InserimentoModificaUtente} from "../../../../../model/utente/InserimentoModificaUtente";

@Component({
  selector: 'app-dati-ente',
  templateUrl: './dati-ente.component.html',
  styleUrls: ['./dati-ente.component.scss']
})
export class DatiEnteComponent implements OnInit {
  // enums e consts class
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  displayModal: boolean;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiEnte: EventEmitter<EnteCompleto> = new EventEmitter<EnteCompleto>();
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  datiEnte: EnteCompleto;

  constructor() {
  }

  ngOnInit(): void {
    this.datiEnte = new EnteCompleto();
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  onChangeForm(datiUtenteForm: NgForm) {
    const model = {...datiUtenteForm.value};

    if (datiUtenteForm.valid) {
      for (const nomeCampo in model) {
        if (model[nomeCampo] !== undefined && model[nomeCampo]) {
          if (typeof model[nomeCampo] === 'object') {
            model[nomeCampo] = moment(model[nomeCampo]).format('YYYY-MM-DD[T]HH:mm:ss');
          }
        } else {
          model[nomeCampo] = null;
        }
      }
      this.onChangeDatiEnte.emit(model);
      this.isFormValid.emit(true);
    } else {
      this.isFormValid.emit(false);
    }
  }

  formattaInput(valore: string, campo: string) {
    if (valore === '') {
      this.datiEnte[campo] = null;
    }
  }

  showModalDialog() {
    this.displayModal = true;
  }
}
