import {Component, OnInit} from '@angular/core';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {FiltroGestioneUtentiService} from './FiltroGestioneUtentiService';
import {map} from 'rxjs/operators';
import {DatePickerComponent} from 'ng2-date-picker';
import {SocietaService} from '../../../../../services/societa.service';
import {FunzioneService} from '../../../../../services/funzione.service';
import {ParametriRicercaUtente} from '../../../model/utente/ParametriRicercaUtente';
import {NgForm, NgModel} from '@angular/forms';

@Component({
  selector: 'app-filtro-gestione-utenti',
  templateUrl: './filtro-gestione-utenti.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './filtro-gestione-utenti.component.scss']
})
export class FiltroGestioneUtentiComponent implements OnInit {

  isSubsectionFiltriVisible = true;
  arrowType = 'assets/img/sprite.svg#it-collapse';

  listaSocieta: Array<OpzioneSelect> = [];
  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioniAbilitate: Array<OpzioneSelect> = [];

  placeholderCf = 'inserisci testo';

  isCalendarOpen = false;
  minDateDDMMYY = '01/01/1900';

  filtroGestioneUtentiApplicato: ParametriRicercaUtente;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private filtroGestioneUtentiService: FiltroGestioneUtentiService, private societaService: SocietaService,
              private funzioneService: FunzioneService) { }

  ngOnInit(): void {
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();

    this.letturaSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.letturaFunzioni();
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

  selezionaSocieta(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.filtroGestioneUtentiApplicato);
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
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.filtroGestioneUtentiApplicato);
    this.filtroGestioneUtentiApplicato.enteId = null;
    this.listaEnti = [];

    const livelloTerritorialeId = this.filtroGestioneUtentiApplicato?.livelloTerritorialeId;
    if (livelloTerritorialeId != null) {
      this.recuperaFiltroEnti(livelloTerritorialeId);
    }
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
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.filtroGestioneUtentiApplicato);
    this.filtroGestioneUtentiApplicato.servizioId = null;
    this.listaServizi = [];

    const enteId = this.filtroGestioneUtentiApplicato?.enteId;
    if (enteId != null) {
      this.recuperaFiltroServizi(enteId);
    }
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

  selezionaServizio(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.filtroGestioneUtentiApplicato);
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

  selezionaFunzione(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.filtroGestioneUtentiApplicato);
  }

  setArrowType(): void {
    this.isSubsectionFiltriVisible = !this.isSubsectionFiltriVisible;
    this.arrowType = !this.isSubsectionFiltriVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

  setPlaceholderCodiceFiscaleField(codicefiscaleinput: NgModel): void {
    this.placeholderCf = codicefiscaleinput?.errors ? 'campo non valido' : 'inserisci testo';
  }

  setPlaceholderData(dataInserita: NgModel): string {
    return dataInserita?.errors ? 'campo non valido' : 'inserisci data';
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  selezionaData(datePickerComponent: DatePickerComponent, nomeCampo: string): void {
    // TODO convertire data recuperata dal campo datepicker in formato da inviare all'oggetto del backend
    // this.filtroGestioneUtentiApplicato[nomeCampo] = datePickerComponent.inputElementValue;
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.filtroGestioneUtentiApplicato = new ParametriRicercaUtente();
  }

  cercaUtenti({value}: {value: ParametriRicercaUtente}): void {
    // TODO logica collegamento operation ricercaUtenti per recupero Lista Utenti
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
