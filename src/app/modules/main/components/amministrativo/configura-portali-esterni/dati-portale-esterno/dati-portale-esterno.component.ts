import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ConfiguraPortaleEsterno} from '../../../../model/configuraportaliesterni/ConfiguraPortaleEsterno';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {ConfiguraPortaliEsterniService} from '../../../../../../services/configura-portali-esterni.service';
import * as _ from 'lodash';
import {TipoPortaleEsterno} from '../../../../model/configuraportaliesterni/TipoPortaleEsterno';
import {OverlayService} from '../../../../../../services/overlay.service';

@Component({
  selector: 'app-dati-portale-esterno',
  templateUrl: './dati-portale-esterno.component.html',
  styleUrls: ['./dati-portale-esterno.component.scss']
})
export class DatiPortaleEsternoComponent implements OnInit, OnChanges {

  @Input() datiPortaleEsterno: ConfiguraPortaleEsterno;
  @Input() idFunzione: string;
  @Input() funzione: FunzioneGestioneEnum;

  @Output() onValidaForm = new EventEmitter<boolean>();

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  readonly tipoCampo = TipoCampoEnum;
  readonly maxLengthCodice = 11;
  readonly maxLengthEncryptKey = 24;
  readonly maxLengthEncryptIV = 8;
  readonly minValueTempoValiditaMessaggio = 10;

  listaTipoPortaleEsterno: OpzioneSelect[] = [];
  idTipoPortale = null;

  constructor(private configuraPortaliEsterniService: ConfiguraPortaliEsterniService,
              private overlayService: OverlayService) {
  }

  ngOnInit(): void {
    this.datiPortaleEsterno.tempoValiditaMessaggio = this.minValueTempoValiditaMessaggio;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.funzione && this.funzione != null) {
      this.popolaSelectTipoPortale();
    }
    if (changes.datiPortaleEsterno) {
      this.idTipoPortale = this.datiPortaleEsterno.tipoPortaleEsterno?.id;
    }
  }

  popolaSelectTipoPortale(): void {
    this.configuraPortaliEsterniService.configuraPortaliEsterniFiltroTipoPortaleEsterno(this.idFunzione).subscribe(listaTipoPortaleEsterno => {
      listaTipoPortaleEsterno.forEach(tipoPortaleEsterno => {
        this.listaTipoPortaleEsterno.push({
          value: tipoPortaleEsterno.id,
          label: tipoPortaleEsterno.nome
        });
      });
      this.listaTipoPortaleEsterno = _.sortBy(this.listaTipoPortaleEsterno, ['label']);
    });
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  setPlaceholder(campo: NgModel, tipo: TipoCampoEnum): string {
    if (this.isCampoInvalido(campo)) {
      if (campo.errors?.required) {
        return 'Il campo è obbligatorio';
      } else {
        return 'campo non valido';
      }
    } else {
      if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (TipoCampoEnum.INPUT_NUMERICO === tipo) {
        return 'inserisci tempo validità messaggio (in minuti)';
      } else if (TipoCampoEnum.DATEDDMMYY === tipo) {
        return 'inserisci data';
      } else if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      }
    }
  }

  onChangeTipoPortale(tipoPortale: NgModel) {
    const index = this.listaTipoPortaleEsterno.findIndex(elemento => elemento.value === tipoPortale.value);
    this.datiPortaleEsterno.tipoPortaleEsterno.id = this.listaTipoPortaleEsterno[index]?.value;
    this.datiPortaleEsterno.tipoPortaleEsterno.codice = this.listaTipoPortaleEsterno[index]?.label;
  }

  aggiungiNuovoTipoPortale() {
    const tipoPortaleEsterno = new TipoPortaleEsterno();
    this.mostraModale(tipoPortaleEsterno);
  }

  mostraModale(item: TipoPortaleEsterno) {
    this.overlayService.mostraModaleTipoPortaleEsternoEvent.emit(_.cloneDeep(item));
  }

  onChangeForm(datiPortaleEsternoForm: NgForm) {
    if (datiPortaleEsternoForm.valid) {
      Object.keys(datiPortaleEsternoForm.value).forEach(value => {
        if (value === undefined || !value) {
          value = null;
        }
      });
      this.onValidaForm.emit(true);
    } else {
      this.onValidaForm.emit(false);
    }
  }

}
