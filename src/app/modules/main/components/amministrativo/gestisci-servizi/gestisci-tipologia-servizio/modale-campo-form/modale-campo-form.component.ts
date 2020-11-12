import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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

  listaCampiDettaglioTransazione: any[];
  listaControlliLogici: any[];
  listaTipologiche: any[];
  listaJsonPath: any[];
  listaTipiCampo: any[];

  listaDipendeDa = [];

  @Input()
  livelloIntegrazione: number = 2;
  listaJsonPathFiltrata: any[];

  constructor(private overlayService: OverlayService,) {
    this.listaCampiDettaglioTransazione = JSON.parse(localStorage.getItem('listaCampiDettaglioTransazione'));
    this.listaControlliLogici = JSON.parse(localStorage.getItem('listaControlliLogici'));
    this.listaTipologiche = JSON.parse(localStorage.getItem('listaTipologiche'));
    this.listaJsonPath = JSON.parse(localStorage.getItem('listaJsonPath'));
    this.listaTipiCampo = JSON.parse(localStorage.getItem('listaTipiCampo'));

    this.form = new FormGroup({
      titolo: new FormControl(null, [Validators.required]),
      tipoCampo: new FormControl(null, [Validators.required]),
      informazioni: new FormControl(null),
      livelloIntegrazione: new FormControl(null),
      obbligatorio: new FormControl(null),
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
    if (this.livelloIntegrazione === 2) {
      this.campoForm.campo_input = true;
      this.campoForm.jsonPath = null;
    }
  }

  clickIndietro() {
    this.overlayService.mostraModaleDettaglioEvent.emit(null);
  }

  cambiaLivelloIntegrazione(event: any) {
    if(event == 2) {
      this.campoForm.campo_input = true;
      this.campoForm.jsonPath = null;
    }
    this.listaJsonPathFiltrata = this.listaJsonPath.filter(value => (value.livello_integrazione_id == event));
  }

  dipendeDaIsDisabled() {
    return !this.campoForm.tipologica ? true : null;
  }
}
