import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {CampoForm} from "../../../../../model/CampoForm";
import {OverlayService} from "../../../../../../../services/overlay.service";

@Component({
  selector: 'app-modale-campo-form',
  templateUrl: './modale-campo-form.component.html',
  styleUrls: ['./modale-campo-form.component.scss']
})
export class ModaleCampoFormComponent implements OnInit {

  form: FormGroup;

  @Input()
  campoForm: CampoForm;

  constructor(private overlayService: OverlayService,) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      titolo: null,
      obbligatorio: null,
      tipoCampo: null,
      informazioni: null,
      lunghezzaVariabile: null,
      lunghezza: null,
      campoFisso: null,
      disabilitato: null,
      posizione: null,
      chiave: null,
      controllo_logico: null,
      campo_input: null,
      jsonPath: null,
      tipologica: null,
      campoDettaglioTransazione: null,
      dipendeDa: null,
      opzioni: null
    });

  }

  clickIndietro() {
    this.overlayService.mostraModaleDettaglioEvent.emit(null);
  }
}
