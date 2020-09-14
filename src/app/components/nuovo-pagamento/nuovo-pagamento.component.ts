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

  listaEnti: Array<any> = [
    {value: 'mock ente1 val', label: 'mock ente1 label'},
    {value: 'mock ente2 val', label: 'mock ente2 label'}
  ]

  listaServizi: Array<any> = [
    {value: 'mock servizio1 val', label: 'mock servizio1 label'},
    {value: 'mock servizio2 val', label: 'mock servizio2 label'}
  ]

  enteRicevente: string = 'mock ricevente';
  sommaDaRicevere: number = 1234; //mock

  livelloTerritorialeSelezionato: string;
  enteSelezionato: string;
  servizioSelezionato: string;


  constructor(private nuovoPagamentoService: NuovoPagamentoService) { }

  ngOnInit(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerrotoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        })
      })
    })).subscribe();
  }

}
