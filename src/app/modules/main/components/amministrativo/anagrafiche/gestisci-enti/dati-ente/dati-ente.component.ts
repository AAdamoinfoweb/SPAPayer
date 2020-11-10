import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {EnteCompleto} from '../../../../../model/ente/EnteCompleto';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {Utils} from '../../../../../../../utils/Utils';
import {Societa} from '../../../../../model/Societa';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {Comune} from '../../../../../model/Comune';
import {Provincia} from '../../../../../model/Provincia';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {NuovoPagamentoService} from '../../../../../../../services/nuovo-pagamento.service';

@Component({
  selector: 'app-dati-ente',
  templateUrl: './dati-ente.component.html',
  styleUrls: ['./dati-ente.component.scss']
})
export class DatiEnteComponent implements OnInit {
  // enums e consts class
  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  telefonoRegex = Utils.TELEFONO_REGEX;
  emailRegex = Utils.EMAIL_REGEX;
  codiceFiscalPIvaRegex = Utils.CODICE_FISCALE_O_PARTITA_IVA_REGEX;

  @Input()
  idFunzione;
  @Input()
  datiEnte: EnteCompleto;
  @Input()
  funzione: FunzioneGestioneEnum;
  @Output()
  onChangeDatiEnte: EventEmitter<EnteCompleto> = new EventEmitter<EnteCompleto>();

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  // opzioni per select
  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriale: OpzioneSelect[] = [];
  opzioniFiltroComune: OpzioneSelect[] = [];
  opzioniFiltroProvincia: OpzioneSelect[] = [];

  province: Provincia[];

  constructor(private societaService: SocietaService, private nuovoPagamentoService: NuovoPagamentoService) {
  }

  ngOnInit(): void {
    this.letturaComuni();
    this.letturaProvince();
    this.letturaSocieta();
    this.letturaLivelloTerritoriale();
    if (this.funzione === FunzioneGestioneEnum.MODIFICA) {
      this.inizializzaFormModifica();
    }
  }

  private inizializzaFormModifica() {
    this.isFormValid.emit(true);
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  onChangeModel(form: NgForm, campo: NgModel) {
    if (campo.value == '') {
      this.datiEnte[campo.name] = null;
    }
    this.onChangeDatiEnte.emit(this.datiEnte);
    this.isFormValid.emit(form.valid);
  }

  letturaSocieta(): void {
    this.societaService.ricercaSocieta(null, this.idFunzione)
      .subscribe(societa => {
        this.popolaOpzioniFiltroSocieta(societa);
      });
  }

  private popolaOpzioniFiltroSocieta(societa: Societa[]) {
    if (societa != null) {
      societa.forEach(s => {
        this.opzioniFiltroSocieta.push({
          value: s.id,
          label: s.nome
        });
      });
    }
  }

  letturaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale(false, true)
      .subscribe(livelliTerritoriali => {
        this.popolaOpzioniFiltroLivelloTerritoriale(livelliTerritoriali);
      });
  }

  private popolaOpzioniFiltroLivelloTerritoriale(livelliTerritoriali: LivelloTerritoriale[]) {
    livelliTerritoriali.forEach(livello => {
      this.opzioniFiltroLivelliTerritoriale.push({
        value: livello.id,
        label: livello.nome
      });
    });
  }

  letturaComuni() {
    const comuni: Comune[] = JSON.parse(localStorage.getItem('comuni'));
    this.popolaOpzioniFiltroComune(comuni);
  }

  private popolaOpzioniFiltroComune(comuni: Comune[]) {
    comuni.forEach(comune => {
      this.opzioniFiltroComune.push({
        value: comune.codiceIstat,
        label: comune.nome
      });
    });
  }

  letturaProvince() {
    this.province = JSON.parse(localStorage.getItem('province'));
    this.popolaOpzioniFiltroProvincia(this.province);
  }

  private popolaOpzioniFiltroProvincia(province: Provincia[]) {
    province.forEach(provincia => {
      this.opzioniFiltroProvincia.push({
        value: provincia.sigla,
        label: provincia.sigla
      });
    });
  }

  selezionaComune() {
    this.datiEnte.provincia = this.province
      .find((prov) => prov.codice === this.datiEnte.comune.substring(0, 3))
      .sigla;
  }

  selezionaProvincia() {
    const provincia = this.province.find((prov) => prov.sigla === this.datiEnte.provincia);
    if (!(this.datiEnte.comune.includes(provincia.codice))) {
      this.datiEnte.comune = null;
    }
  }
}
