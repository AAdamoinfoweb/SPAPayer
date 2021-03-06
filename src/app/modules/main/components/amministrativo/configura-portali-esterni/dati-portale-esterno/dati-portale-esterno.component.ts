import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ConfiguraPortaleEsterno} from '../../../../model/configuraportaliesterni/ConfiguraPortaleEsterno';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {NgForm, NgModel} from '@angular/forms';
import {ConfiguraPortaliEsterniService} from '../../../../../../services/configura-portali-esterni.service';
import * as _ from 'lodash';
import {TipoPortaleEsterno} from '../../../../model/configuraportaliesterni/TipoPortaleEsterno';
import {OverlayService} from '../../../../../../services/overlay.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Banner} from '../../../../model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../../../services/banner.service';

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

  listaTipoPortaleEsterno: any[] = [];
  codiceTipoPortale = null;

  constructor(private configuraPortaliEsterniService: ConfiguraPortaliEsterniService,
              private overlayService: OverlayService, private amministrativoService: AmministrativoService,
              private bannerService: BannerService) {
  }

  ngOnInit(): void {
    this.datiPortaleEsterno.tempoValiditaMessaggio = this.minValueTempoValiditaMessaggio;

    this.amministrativoService.salvaTipoPortaleEsternoEvent = new EventEmitter<any>();
    this.amministrativoService.salvaTipoPortaleEsternoEvent.subscribe((tipoPortaleEsterno: TipoPortaleEsterno) => {
      const tipoPortaleEsternoPresente = this.listaTipoPortaleEsterno.find(elemento => tipoPortaleEsterno.codice.toLowerCase() === elemento.value.toLowerCase());
      if (tipoPortaleEsternoPresente) {
        const banner: Banner = {
          titolo: 'ATTENZIONE',
          testo: 'Il tipo portale ?? gi?? presente nel sistema. Cambiare il codice o annullare l???operazione di inserimento',
          tipo: getBannerType(LivelloBanner.ERROR)
        };
        this.bannerService.bannerEvent.emit([banner]);
      } else {
        this.datiPortaleEsterno.tipoPortaleEsterno = tipoPortaleEsterno;
        this.codiceTipoPortale = tipoPortaleEsterno.codice;
        this.listaTipoPortaleEsterno.push({
          idItem: tipoPortaleEsterno.id,
          value: tipoPortaleEsterno.codice,
          label: tipoPortaleEsterno.codice
        });
        this.listaTipoPortaleEsterno = _.sortBy(this.listaTipoPortaleEsterno, ['label']);
        this.overlayService.mostraModaleTipoPortaleEsternoEvent.emit(null);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.funzione && this.funzione != null) {
      this.popolaSelectTipoPortale();
    }
    if (changes.datiPortaleEsterno) {
      this.codiceTipoPortale = this.datiPortaleEsterno.tipoPortaleEsterno?.codice;
    }
  }

  popolaSelectTipoPortale(): void {
    this.configuraPortaliEsterniService.configuraPortaliEsterniFiltroTipoPortaleEsterno(this.idFunzione).subscribe(listaTipoPortaleEsterno => {
      listaTipoPortaleEsterno.forEach(tipoPortaleEsterno => {
        this.listaTipoPortaleEsterno.push({
          idItem: tipoPortaleEsterno.id,
          value: tipoPortaleEsterno.nome,
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
        return 'Il campo ?? obbligatorio';
      } else {
        return 'campo non valido';
      }
    } else {
      if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (TipoCampoEnum.INPUT_NUMERICO === tipo) {
        return 'inserisci tempo validit?? messaggio (in minuti)';
      } else if (TipoCampoEnum.DATEDDMMYY === tipo) {
        return 'inserisci data';
      } else if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      }
    }
  }

  onChangeCodicePortaleEsterno(codicePortale: NgModel, datiForm: NgForm) {
    this.datiPortaleEsterno.codice = codicePortale.value.toUpperCase();
    this.onChangeForm(datiForm);
  }

  onChangeTipoPortale(tipoPortale: NgModel, datiForm: NgForm) {
    const index = this.listaTipoPortaleEsterno.findIndex(elemento => elemento.value === tipoPortale.value);
    this.datiPortaleEsterno.tipoPortaleEsterno.id = this.listaTipoPortaleEsterno[index]?.idItem;
    this.datiPortaleEsterno.tipoPortaleEsterno.codice = this.listaTipoPortaleEsterno[index]?.label;
    this.onChangeForm(datiForm);
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
