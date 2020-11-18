import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {ParametroAttivitaPianificata} from "../../../../model/attivitapianificata/ParametroAttivitaPianificata";
import {Utils} from "../../../../../../utils/Utils";
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";
import {ContoCorrenteSingolo} from "../../../../model/ente/ContoCorrenteSingolo";

@Component({
  selector: 'app-dati-parametro',
  templateUrl: './dati-parametro.component.html',
  styleUrls: ['./dati-parametro.component.scss']
})
export class DatiParametroComponent implements OnInit {

  constructor() { }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  @Input()
  index;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Input()
  parametro: ParametroAttivitaPianificata;
  @Output()
  onChangeDatiParametro: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onDeleteDatiParametro: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();


  ngOnInit(): void {
    this.onChangeDatiParametro.emit({parametro: this.parametro, index: this.index, isFormValid: this.parametro.chiave != null});
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    this.onChangeDatiParametro.emit({parametro: this.parametro, index: this.index, isFormValid: form.valid});
  }

  onClickDeleteIcon() {
    this.onDeleteDatiParametro.emit(this.index);
  }
}
