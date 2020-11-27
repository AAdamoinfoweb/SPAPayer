import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OverlayService} from '../../../../../../services/overlay.service';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {LivelloIntegrazioneEnum} from '../../../../../../enums/livelloIntegrazione.enum';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {CampoTipologiaServizio} from '../../../../model/CampoTipologiaServizio';
import {CampoServizio} from '../../../../model/servizio/CampoServizio';
import {TipoCampo} from '../../../../model/campo/TipoCampo';
import {ConfigurazioneJsonPath} from '../../../../model/campo/ConfigurazioneJsonPath';
import {ConfigurazioneTipologica} from '../../../../model/campo/ConfigurazioneTipologica';
import {ControlloLogico} from '../../../../model/ControlloLogico';
import {ConfigurazioneCampoDettaglioTransazione} from '../../../../model/campo/ConfigurazioneCampoDettaglioTransazione';
import {CampoTipologiaServizioService} from '../../../../../../services/campo-tipologia-servizio.service';
import * as _ from 'lodash';

export interface DatiModaleCampo {
  listaDipendeDa: any[];
  livelloIntegrazione: LivelloIntegrazioneEnum;
  campoForm: CampoTipologiaServizio | CampoServizio;
  funzione: FunzioneGestioneEnum;
  idFunzione: number;
  mostraLivelloIntegrazione: boolean;
}

@Component({
  selector: 'app-modale-campo-form',
  templateUrl: './modale-campo-form.component.html',
  styleUrls: ['./modale-campo-form.component.scss']
})
export class ModaleCampoFormComponent implements OnInit {

  form: FormGroup;

  @Input()
  datiModaleCampo: DatiModaleCampo;

  FunzioneGestioneEnum = FunzioneGestioneEnum;

  listaCampiDettaglioTransazione: ConfigurazioneCampoDettaglioTransazione[];
  listaControlliLogici: ControlloLogico[];
  listaTipologiche: ConfigurazioneTipologica[];
  listaJsonPath: ConfigurazioneJsonPath[];
  listaTipiCampo: TipoCampo[];

  listaJsonPathFiltrata: ConfigurazioneJsonPath[];

  livelloIntegrazioneEnum = LivelloIntegrazioneEnum;

  constructor(private overlayService: OverlayService, private amministrativoService: AmministrativoService, private campoTipologiaServizioService: CampoTipologiaServizioService) {
    this.leggiConfigurazioneCampi();

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

    this.campoTipologiaServizioService.aggiornaConfigurazioneCampiEvent.subscribe(() => {
      this.leggiConfigurazioneCampi();
    });
  }

  leggiConfigurazioneCampi(): void {
    this.listaCampiDettaglioTransazione = JSON.parse(localStorage.getItem('listaCampiDettaglioTransazione'));
    this.listaCampiDettaglioTransazione = _.sortBy(this.listaCampiDettaglioTransazione, ['nome']);
    this.listaControlliLogici = JSON.parse(localStorage.getItem('listaControlliLogici'));
    this.listaControlliLogici = _.sortBy(this.listaControlliLogici, ['nome']);
    this.listaTipologiche = JSON.parse(localStorage.getItem('listaTipologiche'));
    this.listaTipologiche = _.sortBy(this.listaTipologiche, ['nome']);
    this.listaJsonPath = JSON.parse(localStorage.getItem('listaJsonPath'));
    this.listaJsonPath = _.sortBy(this.listaJsonPath, ['nome_attributo']);
    this.listaTipiCampo = JSON.parse(localStorage.getItem('listaTipiCampo'));
    this.listaTipiCampo = _.sortBy(this.listaTipiCampo, ['nome', 'informazioni']);
  }

  ngOnInit(): void {
    if (this.datiModaleCampo.listaDipendeDa)
      this.datiModaleCampo.listaDipendeDa =
        this.datiModaleCampo.listaDipendeDa.filter((value => value.titolo !== this.datiModaleCampo.campoForm.titolo));

    this.datiModaleCampo.campoForm.dipendeDa =
      this.datiModaleCampo.listaDipendeDa.find((value => this.datiModaleCampo.campoForm.dipendeDa &&
        value.titolo == this.datiModaleCampo.campoForm.dipendeDa.titolo));

    if (!this.datiModaleCampo.livelloIntegrazione) {
      this.datiModaleCampo.livelloIntegrazione = LivelloIntegrazioneEnum.LV2;
    }

    if (this.datiModaleCampo.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      this.form.disable();
    } else {
      this.form.enable();
    }

    if (this.datiModaleCampo.livelloIntegrazione === LivelloIntegrazioneEnum.LV2) {
      this.datiModaleCampo.campoForm.campoInput = true;
      if (this.datiModaleCampo.campoForm instanceof CampoServizio) {
        this.datiModaleCampo.campoForm.jsonPathId = null;
      }
    }
  }

  clickIndietro() {
    this.overlayService.mostraModaleCampoEvent.emit(null);
  }

  cambiaLivelloIntegrazione(item: CampoTipologiaServizio, event: LivelloIntegrazioneEnum) {
    if (event === LivelloIntegrazioneEnum.LV2) {
      this.datiModaleCampo.campoForm.campoInput = true;
      if (this.datiModaleCampo.campoForm instanceof CampoServizio) {
        this.datiModaleCampo.campoForm.jsonPathId = null;
      }
    }
    this.listaJsonPathFiltrata = this.listaJsonPath.filter(value => {
      return value.livello_integrazione_id === event && value.campo_input === item.campoInput;
    });
  }

  dipendeDaIsDisabled() {
    return !this.datiModaleCampo.campoForm.tipologica ? true : null;
  }

  salvaCampoForm() {
    this.amministrativoService.salvaCampoFormEvent.emit(this.datiModaleCampo.campoForm);
  }

  clickChiave(event: any) {
    this.datiModaleCampo.campoForm.obbligatorio = event.target.value == 'on';
  }

  addTipoCampo() {
    this.overlayService.mostraModaleTipoCampoEvent.emit(this.datiModaleCampo.idFunzione);
  }
}
