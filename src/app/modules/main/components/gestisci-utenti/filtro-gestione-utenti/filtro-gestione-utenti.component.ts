import {Component, OnInit} from '@angular/core';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {LivelloTerritoriale} from '../../../model/LivelloTerritoriale';
import {Ente} from '../../../model/Ente';
import {Servizio} from '../../../model/Servizio';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {FiltroGestioneUtentiService} from './FiltroGestioneUtentiService';
import {map} from 'rxjs/operators';
import {DatePickerComponent} from 'ng2-date-picker';
import {Societa} from '../../../model/Societa';
import {SocietaService} from '../../../../../services/societa.service';
import {Funzione} from '../../../model/Funzione';
import {FunzioneService} from '../../../../../services/funzione.service';

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

  societaSelezionata: Societa = null;
  livelloTerritorialeSelezionato: LivelloTerritoriale = null;
  enteSelezionato: Ente = null;
  servizioSelezionato: Servizio = null;
  funzioneAbilitataSelezionata: Funzione = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private filtroGestioneUtentiService: FiltroGestioneUtentiService, private societaService: SocietaService,
              private funzioneService: FunzioneService) { }

  ngOnInit(): void {
    this.letturaSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.letturaFunzioni();
  }

  letturaSocieta(): void {
    this.societaService.letturaSocieta().pipe(map(societa => {
      societa.forEach(s => {
        this.listaSocieta.push({
          value: s,
          label: s.nome
        });
      });
    })).subscribe();
  }

  selezionaSocieta(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(null);
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello,
          label: livello.nome
        });
      });
    })).subscribe();
  }

  selezionaLivelloTerritoriale(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(null);
    this.enteSelezionato = null;
    this.listaEnti = [];

    this.recuperaFiltroEnti(this.livelloTerritorialeSelezionato.id);
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente,
          label: ente.nome
        });
      });
    })).subscribe();
  }

  selezionaEnte(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(null);
    this.servizioSelezionato = null;
    this.listaServizi = [];

    this.recuperaFiltroServizi(this.enteSelezionato.id);
  }

  recuperaFiltroServizi(idEnte): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio,
          label: servizio.nome
        });
      });
    })).subscribe();
  }

  selezionaServizio(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(this.servizioSelezionato);
  }

  letturaFunzioni(): void {
    this.funzioneService.letturaFunzioni().pipe(map(funzioneAbilitata => {
      funzioneAbilitata.forEach(funzione => {
        this.listaFunzioniAbilitate.push({
          value: funzione,
          label: funzione.nome
        });
      });
    })).subscribe();
  }

  selezionaFunzione(): void {
    this.filtroGestioneUtentiService.filtroGestioneUtentiEvent.emit(null);
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
