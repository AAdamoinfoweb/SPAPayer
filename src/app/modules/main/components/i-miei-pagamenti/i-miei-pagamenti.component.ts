import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-i-miei-pagamenti',
  templateUrl: './i-miei-pagamenti.component.html',
  styleUrls: ['./i-miei-pagamenti.component.scss']
})
export class IMieiPagamentiComponent implements OnInit {

  tooltipOnPageTitle = 'In questa pagina puoi consultare la lista completa dei pagamenti e filtrarli';
  tooltipPendenzaNotInsertedFromEnte = 'Attenzione: questo non è un pagamento inserito automaticamente dall\'Ente';
  tooltipNewPagamento = 'Nuovo Pagamento';
  tooltipDeletePagamento = 'Elimina Pagamento';
  tooltipVisualizeDownloadPagamento = 'Visualizza/Scarica gli attestati del pagamento';
  tooltipAddToCarrello = 'Aggiungi al carrelloL1';

  isSubsectionFiltriVisible: boolean;
  isSubsectionListaPagamentiVisible: boolean;

  listaLivelliTerritoriali: Array<any> = [
    {value: 'mock livello1 val', label: 'mock livello1 label'},
    {value: 'mock livello2 val', label: 'mock livello2 label'}
  ];

  listaEnti: Array<any> = [
    {value: 'mock ente1 val', label: 'mock ente1 label'},
    {value: 'mock ente2 val', label: 'mock ente2 label'}
  ];

  listaServizi: Array<any> = [
    {value: 'mock servizio1 val', label: 'mock servizio1 label'},
    {value: 'mock servizio2 val', label: 'mock servizio2 label'}
  ];

  livelloTerritorialeSelezionato: string;
  enteSelezionato: string;
  servizioSelezionato: string;

  constructor() { }

  ngOnInit(): void {
    this.isSubsectionFiltriVisible = true;
    this.isSubsectionListaPagamentiVisible = true;
  }

  showHideSubsection(nameSubsection) {
    switch (nameSubsection) {
      case 'filtri':
        this.isSubsectionFiltriVisible = !this.isSubsectionFiltriVisible;
        break;
      case 'listaPagamenti':
        this.isSubsectionListaPagamentiVisible = !this.isSubsectionListaPagamentiVisible;
        break;
    }
  }

  displayArrow(flagSubsectionVisible) {
    return !flagSubsectionVisible ? 'assets/img/sprite.svg#it-expand' : 'assets/img/sprite.svg#it-collapse';
  }

}
