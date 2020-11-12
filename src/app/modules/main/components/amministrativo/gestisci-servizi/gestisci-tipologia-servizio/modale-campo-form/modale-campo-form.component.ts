import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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

  listaCampiDettaglioTransazione: any;
  listaControlliLogici: any;
  listaTipologiche: any;
  listaJsonPath: any;
  listaTipiCampo: any;
  livelloIntegrazione: number;
  listaDipendeDa = [];

  constructor(private overlayService: OverlayService,) {
    this.listaCampiDettaglioTransazione = JSON.parse(localStorage.getItem('listaCampiDettaglioTransazione'));
    this.listaControlliLogici = JSON.parse(localStorage.getItem('listaControlliLogici'));
    this.listaTipologiche = JSON.parse(localStorage.getItem('listaTipologiche'));
    this.listaJsonPath = JSON.parse(localStorage.getItem('listaJsonPath'));
    this.listaTipiCampo = JSON.parse(localStorage.getItem('listaTipiCampo'));

    this.form = new FormGroup({
      titolo: new FormControl(null),
      obbligatorio: new FormControl(null),
      tipoCampo: new FormControl(null),
      informazioni: new FormControl(null),
      lunghezzaVariabile: new FormControl(null),
      lunghezza: new FormControl(null),
      campoFisso: new FormControl(null),
      disabilitato: new FormControl(null),
      posizione: new FormControl(null),
      chiave: new FormControl(null),
      controllo_logico: new FormControl(null),
      campo_input: new FormControl(null),
      jsonPath: new FormControl(null),
      tipologica: new FormControl(null),
      campoDettaglioTransazione: new FormControl(null),
      dipendeDa: new FormControl(null),
      opzioni: new FormControl(null)
    });
  }

  ngOnInit(): void {
  }

  clickIndietro() {
    this.overlayService.mostraModaleDettaglioEvent.emit(null);
  }
}
