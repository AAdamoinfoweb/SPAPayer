import { Component, OnInit } from '@angular/core';
import {Breadcrumb} from '../../../dto/Breadcrumb';
import {InserimentoModificaUtente} from '../../../model/utente/InserimentoModificaUtente';

@Component({
  selector: 'app-aggiungi-utente-permessi',
  templateUrl: './aggiungi-utente-permessi.component.html',
  styleUrls: ['./aggiungi-utente-permessi.component.scss']
})
export class AggiungiUtentePermessiComponent implements OnInit {

  breadcrumbList = [];

  readonly tooltipAggiungiUtentePermessiTitle = 'In questa pagina puoi aggiungere un utente amministratore e abilitarlo a specifici servizi';

  utentiPermessi: InserimentoModificaUtente = new InserimentoModificaUtente();

  constructor() {
    this.inizializzaBreadcrumbList();
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', '/gestisciutenti', null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Aggiungi Utente/Permessi', null, null));
  }

  ngOnInit(): void {
  }

  onChangeDatiUtenti(utentiPermessi: InserimentoModificaUtente): void {
    this.utentiPermessi = utentiPermessi;
  }

  disabilitaBottone(): boolean {
    return this.utentiPermessi?.codiceFiscale === '' || this.utentiPermessi?.codiceFiscale == null;
  }

}
