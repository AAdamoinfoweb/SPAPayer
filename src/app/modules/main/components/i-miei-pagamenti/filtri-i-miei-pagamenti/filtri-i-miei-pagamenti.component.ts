import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CampoForm} from "../../../model/CampoForm";
import {FormGroup, NgForm, NgModel} from "@angular/forms";
import {DatePickerComponent, ECalendarValue} from "ng2-date-picker";
import {ParametriRicercaPagamenti} from "../../../model/utente/ParametriRicercaPagamenti";
import {TipoCampoEnum} from "../../../../../enums/tipoCampo.enum";
import {OpzioneSelect} from "../../../model/OpzioneSelect";
import {ParametriRicercaUtente} from "../../../model/utente/ParametriRicercaUtente";
import {RicercaUtente} from "../../../model/utente/RicercaUtente";
import {NuovoPagamentoService} from "../../../../../services/nuovo-pagamento.service";
import {SocietaService} from "../../../../../services/societa.service";
import {FunzioneService} from "../../../../../services/funzione.service";
import {UtenteService} from "../../../../../services/utente.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-filtri-i-miei-pagamenti',
  templateUrl: './filtri-i-miei-pagamenti.component.html',
  styleUrls: ['./filtri-i-miei-pagamenti.component.scss']
})
export class FiltriIMieiPagamentiComponent implements OnInit {
  isSubsectionFiltriVisible = true;
  arrowType = 'assets/img/sprite.svg#it-collapse';

  listaSocieta: Array<OpzioneSelect> = [];
  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioniAbilitate: Array<OpzioneSelect> = [];

  isCalendarOpen = false;
  readonly minDateDDMMYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  filtroGestioneUtentiApplicato: ParametriRicercaUtente;
  filtroRicercaPagamenti: ParametriRicercaPagamenti;

  @Input()
  listaUtente: Array<RicercaUtente> = new Array<RicercaUtente>();

  @Output()
  listaUtentiFiltrati: EventEmitter<RicercaUtente[]> = new EventEmitter<RicercaUtente[]>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private funzioneService: FunzioneService, private utenteService: UtenteService) {
  }

  ngOnInit(): void {
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();
    this.filtroRicercaPagamenti = new  ParametriRicercaPagamenti();

  }

  letturaSocieta(): void {
    this.societaService.letturaSocieta().pipe(map(societa => {
      societa.forEach(s => {
        this.listaSocieta.push({
          value: s.id,
          label: s.nome
        });
      });
    })).subscribe();
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        });
      });
    })).subscribe();
  }

  selezionaLivelloTerritoriale(): void {
    this.filtroGestioneUtentiApplicato.enteId = null;
    this.listaEnti = [];

    this.recuperaFiltroEnti(this.filtroGestioneUtentiApplicato?.livelloTerritorialeId);
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        });
      });
    })).subscribe();
  }

  selezionaEnte(): void {
    this.filtroGestioneUtentiApplicato.servizioId = null;
    this.listaServizi = [];

    this.recuperaFiltroServizi(this.filtroGestioneUtentiApplicato?.enteId);
  }

  recuperaFiltroServizi(idEnte): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        });
      });
    })).subscribe();
  }

  letturaFunzioni(): void {
    this.funzioneService.letturaFunzioni().pipe(map(funzioneAbilitata => {
      funzioneAbilitata.forEach(funzione => {
        this.listaFunzioniAbilitate.push({
          value: funzione.id,
          label: funzione.nome
        });
      });
    })).subscribe();
  }

  setArrowType(): void {
    this.isSubsectionFiltriVisible = !this.isSubsectionFiltriVisible;
    this.arrowType = !this.isSubsectionFiltriVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      } else if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else {
        return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.listaUtentiFiltrati.emit(this.listaUtente);
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();
  }

  cercaUtenti(form: NgForm): void {
    Object.keys(form.value).forEach(key => {
      const value = form.value[key];
      if (value !== undefined) {
        this.filtroGestioneUtentiApplicato[key] = value;
      } else {
        this.filtroGestioneUtentiApplicato[key] = null;
      }
    });

    const filtro = this.filtroGestioneUtentiApplicato;
    this.utenteService.ricercaUtenti(filtro.livelloTerritorialeId, filtro.societaId, filtro.enteId, filtro.servizioId, filtro.funzioneId,
      filtro.codiceFiscale, filtro.dataScadenzaDa, filtro.dataScadenzaA, filtro.ultimoAccessoDa,
      filtro.ultimoAccessoA).pipe(map(listaUtenti => {
      this.listaUtentiFiltrati.emit(listaUtenti);
    })).subscribe();
  }

  disabilitaBottone(filtroGestioneUtentiForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneUtentiForm.value).some(key => filtroGestioneUtentiForm.value[key]);
    if (nomeBottone === 'Pulisci') {
      return !isAtLeastOneFieldValued;
    } else {
      return !filtroGestioneUtentiForm.valid || !isAtLeastOneFieldValued;
    }
  }
}
