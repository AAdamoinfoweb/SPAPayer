import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {NuovoPagamentoService} from '../../../../../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {SocietaService} from '../../../../../../services/societa.service';
import {FunzioneService} from '../../../../../../services/funzione.service';
import {ParametriRicercaUtente} from '../../../../model/utente/ParametriRicercaUtente';
import {NgForm, NgModel} from '@angular/forms';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {RicercaUtente} from '../../../../model/utente/RicercaUtente';
import {UtenteService} from '../../../../../../services/utente.service';
import * as moment from 'moment';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';
import {OverlayService} from '../../../../../../services/overlay.service';
import {AmministrativoService} from "../../../../../../services/amministrativo.service";
import {FiltroGestioneElementiComponent} from "../../filtro-gestione-elementi.component";
import {Utils} from '../../../../../../utils/Utils';
import {ActivatedRoute} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-filtro-gestione-utenti',
  templateUrl: './filtro-gestione-utenti.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './filtro-gestione-utenti.component.scss']
})
export class FiltroGestioneUtentiComponent extends FiltroGestioneElementiComponent implements OnInit {
  listaSocieta: Array<OpzioneSelect> = [];
  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioniAbilitate: Array<OpzioneSelect> = [];
  listaCodiciFiscali: string[] = [];
  listaCodiciFiscaliFiltrati: string[] = [];

  readonly minCharsToRetrieveCF = 1;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1900';
  readonly tipoData = ECalendarValue.Moment;

  filtroGestioneUtentiApplicato: ParametriRicercaUtente;

  @Input()
  filtroSocieta = null;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaUtente> = new EventEmitter<ParametriRicercaUtente>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private funzioneService: FunzioneService, private utenteService: UtenteService, private overlayService: OverlayService,
              protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaFiltroGestioneUtenti()
    this.recuperaFiltroSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnti(null);
    this.recuperaFiltroServizi(null);
    this.letturaFunzioni();
  }

  inizializzaFiltroGestioneUtenti() {
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();
    this.filtroGestioneUtentiApplicato.societaId = null;
    this.filtroGestioneUtentiApplicato.servizioId = null;
    this.filtroGestioneUtentiApplicato.enteId = null;
    this.filtroGestioneUtentiApplicato.livelloTerritorialeId = null;
    this.filtroGestioneUtentiApplicato.funzioneId = null;
  }

  recuperaFiltroSocieta(): void {
    this.societaService.filtroSocieta().pipe(map(societa => {
      societa.forEach(s => {
        this.listaSocieta.push({
          value: s.id,
          label: s.nome
        });
      });

      this.listaSocieta = _.sortBy(this.listaSocieta, ['label']);

      if (this.filtroSocieta) {
        const isFiltroSocietaValido = this.listaSocieta.some(item => item.value === this.filtroSocieta);
        if (isFiltroSocietaValido) {
          this.filtroGestioneUtentiApplicato.societaId = this.filtroSocieta;
          const parametriRicercaUtente = new ParametriRicercaUtente();
          parametriRicercaUtente.societaId = this.filtroSocieta;
          this.onChangeFiltri.emit(parametriRicercaUtente);
        } else {
          window.open('/nonautorizzato', '_self');
        }
      }
    })).subscribe();
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale(null, true).pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        });
      });
      this.listaLivelliTerritoriali = _.sortBy(this.listaLivelliTerritoriali, ['label']);
    })).subscribe();
  }

  selezionaLivelloTerritoriale(): void {
    this.filtroGestioneUtentiApplicato.enteId = null;
    this.listaEnti = [];

    this.recuperaFiltroEnti(this.filtroGestioneUtentiApplicato?.livelloTerritorialeId);
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale, null, null, true).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        });
      });
      this.listaEnti = _.sortBy(this.listaEnti, ['label']);
    })).subscribe();
  }

  selezionaEnte(): void {
    this.filtroGestioneUtentiApplicato.servizioId = null;
    this.listaServizi = [];

    this.recuperaFiltroServizi(this.filtroGestioneUtentiApplicato?.enteId);
  }

  recuperaFiltroServizi(idEnte): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte, null, true).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        });
      });
      this.listaServizi = _.sortBy(this.listaServizi, ['label']);
    })).subscribe();
  }

  letturaFunzioni(): void {
    this.funzioneService.letturaFunzioni().pipe(map(funzioniAbilitate => {
      funzioniAbilitate.forEach(funzione => {
        this.listaFunzioniAbilitate.push({
          value: funzione.id,
          label: funzione.descrizione
        });
      });
      this.listaFunzioniAbilitate = _.sortBy(this.listaFunzioniAbilitate, ['label']);
    })).subscribe();
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

  loadSuggestions(event): void {
    const inputCf = event.query;

    if (inputCf.length < this.minCharsToRetrieveCF) {
        this.listaCodiciFiscali = [];
        this.listaCodiciFiscaliFiltrati = [];
    } else if (inputCf.length === this.minCharsToRetrieveCF) {
      this.utenteService.letturaCodiciFiscali(inputCf, this.idFunzione).subscribe(data => {
        this.listaCodiciFiscali = data;
        this.listaCodiciFiscaliFiltrati = data;
      });
    } else {
      this.listaCodiciFiscaliFiltrati = this.listaCodiciFiscali.filter(cf => cf.toLowerCase().indexOf(inputCf.toLowerCase()) === 0);
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
    this.inizializzaFiltroGestioneUtenti();
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    const filtro = {...this.filtroGestioneUtentiApplicato};

    for (const [key, value] of Object.entries(this.filtroGestioneUtentiApplicato)) {
      if (value !== undefined && value) {
        if (['dataScadenzaDa', 'ultimoAccessoDa'].includes(key)) {
          filtro[key] = moment(value).format(Utils.FORMAT_LOCAL_DATE_TIME);
        } else if (['dataScadenzaA', 'ultimoAccessoA'].includes(key)) {
          filtro[key] = moment(value).format(Utils.FORMAT_LOCAL_DATE_TIME_TO);
        } else {
          filtro[key] = value;
        }
      } else {
        filtro[key] = null;
      }
    }

    this.onChangeFiltri.emit(filtro);
  }

  disabilitaBottone(filtroGestioneUtentiForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneUtentiForm.value).some(key => filtroGestioneUtentiForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneUtentiForm.valid || !isAtLeastOneFieldValued;
    }
  }

}
