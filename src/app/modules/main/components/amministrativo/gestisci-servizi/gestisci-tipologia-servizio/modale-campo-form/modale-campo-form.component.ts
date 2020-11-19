import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CampoForm} from "../../../../../model/CampoForm";
import {OverlayService} from "../../../../../../../services/overlay.service";
import {FunzioneGestioneEnum} from "../../../../../../../enums/funzioneGestione.enum";
import {LivelloIntegrazioneEnum} from "../../../../../../../enums/livelloIntegrazione.enum";
import {AmministrativoService} from "../../../../../../../services/amministrativo.service";
import {CampoTipologiaServizio} from "../../../../../model/CampoTipologiaServizio";

export interface DatiModaleCampo {
  listaDipendeDa: any[];
  livelloIntegrazione: LivelloIntegrazioneEnum;
  campoForm: CampoTipologiaServizio;
  funzione: FunzioneGestioneEnum;
}

@Component({
  selector: 'app-modale-campo-form',
  templateUrl: './modale-campo-form.component.html',
  styleUrls: ['./modale-campo-form.component.scss']
})
export class ModaleCampoFormComponent implements OnInit {

  form: FormGroup;

  @Input()
  tipologiaServizio: DatiModaleCampo;

  FunzioneGestioneEnum = FunzioneGestioneEnum;

  listaCampiDettaglioTransazione: any[];
  listaControlliLogici: any[];
  listaTipologiche: any[];
  listaJsonPath: any[];
  listaTipiCampo: any[];

  listaJsonPathFiltrata: any[];

  livelloIntegrazioneEnum = LivelloIntegrazioneEnum;

  constructor(private overlayService: OverlayService, private amministrativoService: AmministrativoService) {
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
    this.tipologiaServizio.listaDipendeDa =
      this.tipologiaServizio.listaDipendeDa.filter((value => value.titolo !== this.tipologiaServizio.campoForm.titolo));

    this.tipologiaServizio.campoForm.dipendeDa =
      this.tipologiaServizio.listaDipendeDa.find((value => this.tipologiaServizio.campoForm.dipendeDa &&
        value.titolo == this.tipologiaServizio.campoForm.dipendeDa.titolo));

    if (!this.tipologiaServizio.livelloIntegrazione)
      this.tipologiaServizio.livelloIntegrazione = LivelloIntegrazioneEnum.LV2;

    if (this.tipologiaServizio.funzione === FunzioneGestioneEnum.DETTAGLIO)
      this.form.disable();
    else
      this.form.enable();

    if (this.tipologiaServizio.livelloIntegrazione === LivelloIntegrazioneEnum.LV2) {
      this.tipologiaServizio.campoForm.campoInput = true;
      this.tipologiaServizio.campoForm.jsonPathId = null;
    }
  }

  clickIndietro() {
    this.overlayService.mostraModaleTipoCampoEvent.emit(null);
  }

  cambiaLivelloIntegrazione(item: CampoTipologiaServizio, event: LivelloIntegrazioneEnum) {
    if (event === LivelloIntegrazioneEnum.LV2) {
      this.tipologiaServizio.campoForm.campoInput = true;
      this.tipologiaServizio.campoForm.jsonPathId = null;
    }
    this.listaJsonPathFiltrata = this.listaJsonPath.filter(value => {
      return value.livello_integrazione_id === event && value.campo_input === item.campoInput;
    });
  }

  dipendeDaIsDisabled() {
    return !this.tipologiaServizio.campoForm.tipologica ? true : null;
  }

  salvaCampoForm() {
    this.amministrativoService.salvaCampoFormEvent.emit(this.tipologiaServizio.campoForm);
  }

  clickChiave(event: any) {
    this.tipologiaServizio.campoForm.obbligatorio = event.target.value == "on";
  }

  addTipoCampo() {
    this.overlayService.mostraModaleTipoCampoEvent.emit({idFunzione: this.tipologiaServizio.funzione});
  }
}
