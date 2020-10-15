import {Component, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../dto/Breadcrumb';

@Component({
  selector: 'app-modifica-utente-permessi',
  templateUrl: './modifica-utente-permessi.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './modifica-utente-permessi.component.scss']
})
export class ModificaUtentePermessiComponent implements OnInit {

  breadcrumbList = [];

  readonly tooltipModificaUtentePermessiTitle = 'In questa pagina puoi aggiornare i dati di un utente già censito e modificare o aggiungere i relativi permessi';

  constructor() {
    this.inizializzaBreadcrumbList();
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', '/gestioneUtenti', null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Modifica Utente/Permessi', null, null));
  }

  ngOnInit(): void {
  }

}
