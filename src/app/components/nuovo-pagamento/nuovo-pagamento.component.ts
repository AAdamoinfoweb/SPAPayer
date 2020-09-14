import { Component, OnInit } from '@angular/core';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';

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

  livelloTerritorialeSelezionato: string;
  enteSelezionato: string;
  servizioSelezionato: string;


  constructor(private nuovoPagamentoService: NuovoPagamentoService) { }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnti();
    this.recuperaFiltroServizi();
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

  recuperaFiltroEnti(): void {
    this.nuovoPagamentoService.recuperaFiltroEnti().pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        })
      })
    })).subscribe();
  }

  recuperaFiltroServizi(): void {
    this.nuovoPagamentoService.recuperaFiltroServizi().pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        })
      })
    })).subscribe();
  }

}
