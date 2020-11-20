import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {ParametroAttivitaPianificata} from "../../../../model/attivitapianificata/ParametroAttivitaPianificata";
import {Utils} from "../../../../../../utils/Utils";
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";
import {ContoCorrenteSingolo} from "../../../../model/ente/ContoCorrenteSingolo";
import {ComponenteDinamico} from "../../../../model/ComponenteDinamico";

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
  uuid;
  @Input()
  index;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Input()
  parametro: ParametroAttivitaPianificata;
  @Output()
  onChangeDatiParametro: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();
  @Output()
  onDeleteDatiParametro: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();



  ngOnInit(): void {
    this.onChangeDatiParametro.emit(this.setComponenteDinamico(this.parametro.chiave != null));
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
    this.onChangeDatiParametro.emit(this.setComponenteDinamico(form.valid));
  }

  onClickDeleteIcon() {
    this.onDeleteDatiParametro.emit(this.setComponenteDinamico());
  }

  setComponenteDinamico(isFormValid?: boolean): ComponenteDinamico {
    const componenteDinamico: ComponenteDinamico = new ComponenteDinamico(this.uuid, this.index, this.parametro, isFormValid);
    return componenteDinamico;
  }
}
