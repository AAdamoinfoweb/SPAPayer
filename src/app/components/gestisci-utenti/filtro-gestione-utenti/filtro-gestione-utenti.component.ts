import { Component, OnInit } from '@angular/core';
import {OpzioneSelect} from '../../../modules/main/model/OpzioneSelect';
import {LivelloTerritoriale} from '../../../modules/main/model/LivelloTerritoriale';
import {Ente} from '../../../modules/main/model/Ente';
import {Servizio} from '../../../modules/main/model/Servizio';
import {NuovoPagamentoService} from '../../../services/nuovo-pagamento.service';
import {FiltroGestioneUtentiService} from './FiltroGestioneUtentiService';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-filtro-gestione-utenti',
  templateUrl: './filtro-gestione-utenti.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './filtro-gestione-utenti.component.scss']
})
export class FiltroGestioneUtentiComponent implements OnInit {

  isSubsectionFiltriVisible: boolean;

  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];

  // TODO operation mancante nel BE: letturaSocieta
  // TODO recuperare società tramite societaId recuperato al momento dell'invocazione del metodo recuperaFiltroLivelloTerritoriale
  listaSocieta: Array<OpzioneSelect> = [
    {value: 'mock societa1 val', label: 'mock societa1 label'},
    {value: 'mock societa2 val', label: 'mock societa2 label'}
  ];

  livelloTerritorialeSelezionato: LivelloTerritoriale = null;
  enteSelezionato: Ente = null;
  servizioSelezionato: Servizio = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private filtroGestioneUtentiService: FiltroGestioneUtentiService) { }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnti(this.livelloTerritorialeSelezionato.id);
    this.recuperaFiltroServizi(this.enteSelezionato.id);
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

}
