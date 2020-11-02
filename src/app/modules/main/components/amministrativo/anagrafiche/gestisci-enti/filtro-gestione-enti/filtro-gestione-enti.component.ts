import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {NgForm, NgModel} from '@angular/forms';
import {ParametriRicercaUtente} from '../../../../../model/utente/ParametriRicercaUtente';
import {BottoneEnum} from '../../../../../../../enums/bottone.enum';
import {NuovoPagamentoService} from '../../../../../../../services/nuovo-pagamento.service';
import {FunzioneService} from '../../../../../../../services/funzione.service';
import {UtenteService} from '../../../../../../../services/utente.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Societa} from '../../../../../model/Societa';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {ParametriRicercaEnte} from '../../../../../model/ente/ParametriRicercaEnte';
import {Comune} from '../../../../../model/Comune';
import {Provincia} from '../../../../../model/Provincia';
import {EnteService} from '../../../../../../../services/ente.service';

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

  @Input()
  listaElementi: Array<any> = new Array<any>();

  @Output()
  onChangeListaElementi: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private enteService: EnteService, private amministrativoService: AmministrativoService) {
    super();
  }

  ngOnInit(): void {
    this.inizializzaFiltroRicercaEnte();

    this.letturaSocieta();
    this.letturaLivelloTerritoriale();
    this.letturaComuni();
    this.letturaProvince();
  }

  private inizializzaFiltroRicercaEnte() {
    this.filtroRicercaEnte = new ParametriRicercaEnte();
    this.filtroRicercaEnte.societaId = null;
    this.filtroRicercaEnte.livelloTerritorialeId = null;
    this.filtroRicercaEnte.comune = null;
    this.filtroRicercaEnte.provincia = null;
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
    this.cercaElementi();
  }

  cercaElementi() {
    this.enteService.ricercaEnti(this.filtroRicercaEnte, this.amministrativoService.idFunzione)
      .subscribe((listaEnti) => {
        this.onChangeListaElementi.emit(listaEnti);
      });
  }

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroForm.value).some(key => filtroForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroForm.valid || !isAtLeastOneFieldValued;
    }
  }

  selezionaComune() {
    this.filtroRicercaEnte.provincia = this.filtroRicercaEnte.comune.substring(0, 3);
  }

  selezionaProvincia() {
    if (!(this.filtroRicercaEnte.comune.includes(this.filtroRicercaEnte.provincia))) {
      this.filtroRicercaEnte.comune = null;
    }
  }
}
