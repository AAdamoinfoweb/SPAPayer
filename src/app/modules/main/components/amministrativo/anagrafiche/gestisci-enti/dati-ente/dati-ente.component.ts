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
  codiceFiscalPIvaRegex = Utils.CODICE_FISCALE_O_PARTITA_IVA_REGEX;

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

  constructor(private societaService: SocietaService, private nuovoPagamentoService: NuovoPagamentoService) {
  }

  ngOnInit(): void {
    this.letturaComuni();
    this.letturaProvince();
    this.letturaSocieta();
    this.letturaLivelloTerritoriale();
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
    this.societaService.filtroSocieta()
      .subscribe(societa => {
        this.popolaOpzioniFiltroSocieta(societa);
      });
  }

  private popolaOpzioniFiltroSocieta(societa: Societa[]) {
    societa.forEach(s => {
      this.opzioniFiltroSocieta.push({
        value: s.id,
        label: s.nome
      });
    });
  }

  letturaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale()
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
    const province: Provincia[] = JSON.parse(localStorage.getItem('province'));
    this.popolaOpzioniFiltroProvincia(province);
  }

  private popolaOpzioniFiltroProvincia(province: Provincia[]) {
    province.forEach(provincia => {
      this.opzioniFiltroProvincia.push({
        value: provincia.codice,
        label: provincia.nome
      });
    });
  }

  selezionaComune() {
    this.datiEnte.provincia = this.datiEnte.comune.substring(0, 3);
  }

  selezionaProvincia() {
    if (!(this.datiEnte.comune.includes(this.datiEnte.provincia))) {
      this.datiEnte.comune = null;
    }
  }
}
