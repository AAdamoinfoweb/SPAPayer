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

@Component({
  selector: 'app-filtro-gestione-utenti',
  templateUrl: './filtro-gestione-utenti.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './filtro-gestione-utenti.component.scss']
})
export class FiltroGestioneUtentiComponent implements OnInit {

  isSubsectionFiltriVisible: boolean = true;
  arrowType: string = 'assets/img/sprite.svg#it-collapse';

  isCalendarOpen: boolean = false;

  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];
  listaSocieta: Array<OpzioneSelect> = [];

  // TODO recuperare funzioni tramite operation mancante nel BE: letturaFunzioni
  listaFunzioniAbilitate: Array<OpzioneSelect> = [
    {value: '', label: ''},
    {value: 'mock funzione1 val', label: 'mock funzione1 label'},
    {value: 'mock funzione2 val', label: 'mock funzione2 label'}
  ];

  societaSelezionata: Societa = null;
  livelloTerritorialeSelezionato: LivelloTerritoriale = null;
  enteSelezionato: Ente = null;
  servizioSelezionato: Servizio = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private filtroGestioneUtentiService: FiltroGestioneUtentiService, private societaService: SocietaService) { }

  ngOnInit(): void {
    this.letturaSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnti(this.livelloTerritorialeSelezionato.id);
    this.recuperaFiltroServizi(this.enteSelezionato.id);
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
    this.societaSelezionata = null;
    this.listaLivelliTerritoriali = [];
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

  setArrowType(): void {
    this.isSubsectionFiltriVisible = !this.isSubsectionFiltriVisible;
    this.arrowType = !this.isSubsectionFiltriVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

}
