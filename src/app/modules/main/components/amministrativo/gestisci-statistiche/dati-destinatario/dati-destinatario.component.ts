import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {Destinatario} from "../../../../model/statistica/Destinatario";
import {Utils} from "../../../../../../utils/Utils";
import {FunzioneGestioneEnum} from "../../../../../../enums/funzioneGestione.enum";

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
  index;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Input()
  destinatario: Destinatario;
  @Output()
  onChangeDatiDestinatario: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onDeleteDatiDestinatario: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
    this.onChangeDatiDestinatario.emit({destinatario: this.destinatario, index: this.index, isFormValid: true});
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
    this.onChangeDatiDestinatario.emit({destinatario: this.destinatario, index: this.index, isFormValid: form.valid});
  }

  onClickDeleteIcon() {
    this.onDeleteDatiDestinatario.emit(this.index);
  }

}
