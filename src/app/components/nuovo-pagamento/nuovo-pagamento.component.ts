import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  listaLivelliTerritoriali: Array<any> = [
    {value: 'mock livello1 val', label: 'mock livello1 label'},
    {value: 'mock livello2 val', label: 'mock livello2 label'}
  ]

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


  constructor() { }

  ngOnInit(): void {
  }

}
