import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {NgForm, NgModel} from '@angular/forms';
import {BottoneEnum} from '../../../../../../../enums/bottone.enum';
import {NuovoPagamentoService} from '../../../../../../../services/nuovo-pagamento.service';
import {Societa} from '../../../../../model/Societa';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {ParametriRicercaEnte} from '../../../../../model/ente/ParametriRicercaEnte';
import {Comune} from '../../../../../model/Comune';
import {Provincia} from '../../../../../model/Provincia';
import {EnteService} from '../../../../../../../services/ente.service';
import {ActivatedRoute} from '@angular/router';
import {Utils} from '../../../../../../../utils/Utils';
import {SintesiEnte} from "../../../../../model/ente/SintesiEnte";
import * as _ from 'lodash';

@Component({
  selector: 'app-filtro-gestione-enti',
  templateUrl: './filtro-gestione-enti.component.html',
  styleUrls: ['./filtro-gestione-enti.component.scss']
})
export class FiltroGestioneEntiComponent extends FiltroGestioneElementiComponent implements OnInit {
  // filtri per la ricerca
  filtroRicercaEnte: ParametriRicercaEnte;
  // opzioni per select
  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriale: OpzioneSelect[] = [];
  opzioniFiltroComune: OpzioneSelect[] = [];
  opzioniFiltroProvincia: OpzioneSelect[] = [];
  opzioniFiltroEnte: OpzioneSelect[] = [];

  idFunzione;

  @Input() enteId = null;

  @Input() livelloTerritorialeId = null;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaEnte> = new EventEmitter<ParametriRicercaEnte>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private enteService: EnteService, protected amministrativoService: AmministrativoService,
              protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaFiltroRicercaEnte();

    this.letturaSocieta();
    this.letturaLivelloTerritoriale();
    this.letturaEnte();
    this.letturaComuni();
    this.letturaProvince();
  }

  private inizializzaFiltroRicercaEnte() {
    this.filtroRicercaEnte = new ParametriRicercaEnte();
    this.filtroRicercaEnte.enteId = null;
    this.filtroRicercaEnte.societaId = null;
    this.filtroRicercaEnte.livelloTerritorialeId = null;
    this.filtroRicercaEnte.comune = null;
    this.filtroRicercaEnte.provincia = null;
  }

  letturaSocieta(): void {
    this.societaService.ricercaSocieta(null, this.idFunzione)
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
    this.opzioniFiltroSocieta = _.sortBy(this.opzioniFiltroSocieta, ['label']);
  }

  letturaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale(false)
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
    this.opzioniFiltroLivelliTerritoriale = _.sortBy(this.opzioniFiltroLivelliTerritoriale, ['label']);

    if (this.livelloTerritorialeId) {
      const isFiltroLivelloTerritorialeValido = this.opzioniFiltroLivelliTerritoriale.some(item => item.value === this.livelloTerritorialeId);
      if (isFiltroLivelloTerritorialeValido) {
        this.filtroRicercaEnte.livelloTerritorialeId = this.livelloTerritorialeId;
        this.onChangeFiltri.emit(this.filtroRicercaEnte);
      } else {
        window.open('/nonautorizzato', '_self');
      }
    }
  }

  letturaEnte(): void {
    this.enteService.ricercaEnti(null, this.idFunzione).subscribe(sintesiEnte => {
      this.popolaOpzioniFiltroEnte(sintesiEnte);
    });
  }

  popolaOpzioniFiltroEnte(sintesiEnte: SintesiEnte[]): void {
    sintesiEnte.forEach(ente => {
      this.opzioniFiltroEnte.push({
        value: ente.id,
        label: ente.nomeEnte
      });
    });
    this.opzioniFiltroEnte = _.sortBy(this.opzioniFiltroEnte, ['label']);

    if (this.enteId) {
      const isEnteIdValido = this.opzioniFiltroEnte.some(item => item.value === this.enteId);
      if (isEnteIdValido) {
        this.filtroRicercaEnte.enteId = this.enteId;
        const parametriRicercaEnte = new ParametriRicercaEnte();
        parametriRicercaEnte.enteId = this.enteId;
        this.onChangeFiltri.emit(parametriRicercaEnte);
      } else {
        window.open('/nonautorizzato', '_self');
      }
    }
  }

  letturaComuni() {
    this.enteService.ricercaComuni( this.idFunzione).subscribe(comuni => {
      this.popolaOpzioniFiltroComune(comuni);
    });
  }

  private popolaOpzioniFiltroComune(comuni: Comune[]) {
    comuni.forEach(comune => {
      this.opzioniFiltroComune.push({
        value: comune.codiceIstat,
        label: comune.nome
      });
    });
    this.opzioniFiltroComune = _.sortBy(this.opzioniFiltroComune, ['label']);
  }

  letturaProvince() {
    this.enteService.ricercaProvince(this.idFunzione).subscribe(province => {
      this.popolaOpzioniFiltroProvincia(province);
    });
  }

  private popolaOpzioniFiltroProvincia(province: Provincia[]) {
    province.forEach(provincia => {
      this.opzioniFiltroProvincia.push({
        value: provincia.codice,
        label: provincia.sigla
      });
    });
    this.opzioniFiltroProvincia = _.sortBy(this.opzioniFiltroProvincia, ['label']);
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      return 'seleziona un elemento dalla lista';
    }
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.inizializzaFiltroRicercaEnte();
    this.onChangeFiltri.emit(null);
  }

  cercaElementi() {
    this.onChangeFiltri.emit(this.filtroRicercaEnte);
  }

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroForm.value).some(key => filtroForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroForm.valid || !isAtLeastOneFieldValued;
    }
  }
}
