import {Component, OnInit} from '@angular/core';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {FiltroGestioneUtentiService} from './FiltroGestioneUtentiService';
import {map} from 'rxjs/operators';
import {DatePickerComponent} from 'ng2-date-picker';
import {SocietaService} from '../../../../../services/societa.service';
import {FunzioneService} from '../../../../../services/funzione.service';
import {ParametriRicercaUtente} from '../../../model/utente/ParametriRicercaUtente';

@Component({
  selector: 'app-filtro-gestione-utenti',
  templateUrl: './filtro-gestione-utenti.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './filtro-gestione-utenti.component.scss']
})
export class FiltroGestioneUtentiComponent implements OnInit {

  isSubsectionFiltriVisible: boolean = true;
  arrowType: string = 'assets/img/sprite.svg#it-collapse';

  isCalendarOpen: boolean = false;

  listaSocieta: Array<OpzioneSelect> = [];
  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaFunzioniAbilitate: Array<OpzioneSelect> = [];

  filtroGestioneUtentiApplicato: ParametriRicercaUtente;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private filtroGestioneUtentiService: FiltroGestioneUtentiService, private societaService: SocietaService,
              private funzioneService: FunzioneService) { }

  ngOnInit(): void {
    this.filtroGestioneUtentiApplicato = {} as ParametriRicercaUtente;

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

    this.recuperaFiltroEnti(this.filtroGestioneUtentiApplicato.livelloTerritorialeId);
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

    this.recuperaFiltroServizi(this.filtroGestioneUtentiApplicato.enteId);
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

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

}
