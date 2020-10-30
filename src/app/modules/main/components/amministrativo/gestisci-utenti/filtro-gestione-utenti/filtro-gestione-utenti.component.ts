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

  readonly minCharsToRetrieveCF = 1;

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1900';
  readonly tipoData = ECalendarValue.Moment;

  filtroGestioneUtentiApplicato: ParametriRicercaUtente;

  @Input()
  listaElementi: Array<RicercaUtente> = new Array<RicercaUtente>();

  @Input()
  filtroSocieta = null;

  @Output()
  onChangeListaElementi: EventEmitter<RicercaUtente[]> = new EventEmitter<RicercaUtente[]>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private funzioneService: FunzioneService, private utenteService: UtenteService, private overlayService: OverlayService,
              private amministrativoService: AmministrativoService) {
    super();
  }

  ngOnInit(): void {
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();

    this.recuperaFiltroSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnti(null);
    this.recuperaFiltroServizi(null);
    this.letturaFunzioni();
  }

  recuperaFiltroSocieta(): void {
    this.societaService.filtroSocieta().pipe(map(societa => {
      societa.forEach(s => {
        this.listaSocieta.push({
          value: s.id,
          label: s.nome
        });
      });

      if (this.filtroSocieta) {
        const isFiltroSocietaValido = this.listaSocieta.some(item => item.value === this.filtroSocieta);
        if (isFiltroSocietaValido) {
          this.filtroGestioneUtentiApplicato.societaId = this.filtroSocieta;
          const parametriRicercaUtente = new ParametriRicercaUtente();
          parametriRicercaUtente.societaId = this.filtroSocieta;
          this.utenteService.ricercaUtenti(parametriRicercaUtente, this.amministrativoService.idFunzione).subscribe(utenti => {
            this.onChangeListaElementi.emit(utenti);
          });
        } else {
          window.open('/nonautorizzato', '_self');
        }
      }
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
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale, null, null).pipe(map(enti => {
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
    this.funzioneService.letturaFunzioni().pipe(map(funzioniAbilitate => {
      funzioniAbilitate.forEach(funzione => {
        this.listaFunzioniAbilitate.push({
          value: funzione.id,
          label: funzione.nome
        });
      });
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
    } else if (inputCf.length === this.minCharsToRetrieveCF) {
      this.utenteService.letturaCodiceFiscale(inputCf, this.amministrativoService.idFunzione).subscribe(data => {
        this.listaCodiciFiscali = data;
      });
    } else {
      this.listaCodiciFiscali = this.listaCodiciFiscali.filter(cf => cf.toLowerCase().indexOf(inputCf.toLowerCase()) === 0);
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  setMinDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').add(1, 'day').format('DD/MM/YYYY') : this.minDateDDMMYYYY;
  }

  setMaxDate(datePicker: DatePickerComponent): string {
    return datePicker.inputElementValue
      ? moment(datePicker.inputElementValue, 'DD/MM/YYYY').subtract(1, 'day').format('DD/MM/YYYY') : null;
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.onChangeListaElementi.emit(this.listaElementi);
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();
  }

  cercaElementi(): void {
    const filtro = {...this.filtroGestioneUtentiApplicato};

    for (const [key, value] of Object.entries(this.filtroGestioneUtentiApplicato)) {
      if (value !== undefined && value) {
        if (typeof value === 'object') {
          filtro[key] = moment(value).format('YYYY-MM-DD[T]HH:mm:ss');
        } else {
          filtro[key] = value;
        }
      } else {
        filtro[key] = null;
      }
    }

    this.utenteService.ricercaUtenti(filtro, this.amministrativoService.idFunzione).pipe(map(listaUtenti => {
      // Non invio la lista in caso di bad request
      if (listaUtenti) {
        this.onChangeListaElementi.emit(listaUtenti);
      }
    })).subscribe(value => {});
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
