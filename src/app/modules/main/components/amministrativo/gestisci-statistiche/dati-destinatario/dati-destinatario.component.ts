import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {Destinatario} from "../../../../model/statistica/Destinatario";
import {Utils} from "../../../../../../utils/Utils";
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";
import {ComponenteDinamico} from "../../../../model/ComponenteDinamico";

@Component({
  selector: 'app-dati-destinatario',
  templateUrl: './dati-destinatario.component.html',
  styleUrls: ['./dati-destinatario.component.scss']
})
export class DatiDestinatarioComponent implements OnInit {

  constructor() { }

  // enums e consts
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  emailRegex: string = Utils.EMAIL_REGEX;

  @Input()
  uuid: string;
  @Input()
  index;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Input()
  destinatario: Destinatario;
  @Output()
  onChangeDatiDestinatario: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();
  @Output()
  onDeleteDatiDestinatario: EventEmitter<ComponenteDinamico> = new EventEmitter<ComponenteDinamico>();


  ngOnInit(): void {
    this.onChangeDatiDestinatario.emit(this.setComponenteDinamico(true));
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
    this.onChangeDatiDestinatario.emit(this.setComponenteDinamico(form.valid));
  }

  onClickDeleteIcon() {
    this.onDeleteDatiDestinatario.emit(this.setComponenteDinamico());
  }

  setComponenteDinamico(isFormValid?: boolean): ComponenteDinamico {
    const componenteDinamico: ComponenteDinamico = new ComponenteDinamico(this.uuid, this.index, this.destinatario, isFormValid);
    return componenteDinamico;
  }

}
