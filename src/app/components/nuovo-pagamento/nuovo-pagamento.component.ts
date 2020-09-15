import { Component, OnInit } from '@angular/core';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {PrezzoService} from './prezzoService';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  listaLivelliTerritoriali: Array<any> = []

  listaEnti: Array<any> = []

  listaServizi: Array<any> = []

  enteRicevente: string = 'mock ricevente';
  sommaDaRicevere: number = 1234; //mock

  livelloTerritorialeSelezionato: string = null;
  enteSelezionato: string = null;
  servizioSelezionato: string = null;


  constructor(private nuovoPagamentoService: NuovoPagamentoService, private prezzoService: PrezzoService) { }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();

    this.mockAggiornaPrezzoCarrello();
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        })
      })
    })).subscribe();
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.enteSelezionato = null
    this.listaEnti = []
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        })
      })
    })).subscribe();
  }

  recuperaFiltroServizi(idEnte): void {
    this.servizioSelezionato = null
    this.listaServizi = []
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        })
      })
    })).subscribe();
  }

  mockAggiornaPrezzoCarrello(): void {
    this.sommaDaRicevere = 999;
    this.aggiornaPrezzoCarrello();
  }

  aggiornaPrezzoCarrello(): void {
    this.prezzoService.prezzoEvent.emit(this.sommaDaRicevere);
  }
}
