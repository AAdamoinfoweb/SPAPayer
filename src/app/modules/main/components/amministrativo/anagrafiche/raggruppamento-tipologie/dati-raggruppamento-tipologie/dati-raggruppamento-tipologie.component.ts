import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RaggruppamentoTipologiaServizio} from '../../../../../model/RaggruppamentoTipologiaServizio';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-dati-raggruppamento-tipologie',
  templateUrl: './dati-raggruppamento-tipologie.component.html',
  styleUrls: ['./dati-raggruppamento-tipologie.component.scss']
})
export class DatiRaggruppamentoTipologieComponent implements OnInit {

  @Input() raggruppamentoTipologiaServizio: RaggruppamentoTipologiaServizio;

  @Input() funzione: FunzioneGestioneEnum;

  @Output()
  onValidaForm = new EventEmitter<boolean>();

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeForm(datiRaggruppamentoTipologieForm: NgForm) {
    const model = {...datiRaggruppamentoTipologieForm.value};

    if (datiRaggruppamentoTipologieForm.valid) {
      for (const nomeCampo in model) {
        if (model[nomeCampo] === '') {
          model[nomeCampo] = null;
        }
      }
      this.onValidaForm.emit(true);
    } else {
      this.onValidaForm.emit(false);
    }
  }

  isCampoInvalido(campo: NgModel): boolean {
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
