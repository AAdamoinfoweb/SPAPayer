import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Breadcrumb} from '../../../../dto/Breadcrumb';
import {UtenteService} from '../../../../../../services/utente.service';
import {ActivatedRoute} from '@angular/router';
import {InserimentoModificaUtente} from '../../../../model/utente/InserimentoModificaUtente';

@Component({
  selector: 'app-modifica-utente-permessi',
  templateUrl: './modifica-utente-permessi.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './modifica-utente-permessi.component.scss']
})
export class ModificaUtentePermessiComponent implements OnInit, AfterViewInit {

  breadcrumbList = [];

  readonly tooltipModificaUtentePermessiTitle = 'In questa pagina puoi aggiornare i dati di un utente già censito e modificare o aggiungere i relativi permessi';

  codiceFiscale: string;
  datiUtente: InserimentoModificaUtente = new InserimentoModificaUtente();

  constructor(private utenteService: UtenteService, private route: ActivatedRoute, private renderer: Renderer2,
              private el: ElementRef) {
    this.inizializzaBreadcrumbList();
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', '/gestioneUtenti', null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Modifica Utente/Permessi', null, null));
  }

  ngOnInit(): void {
    this.codiceFiscale = this.route.snapshot.paramMap.get('userid');
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  onChangeDatiUtenti(datiUtente: InserimentoModificaUtente): void {
    this.datiUtente = datiUtente;
  }

  modificaDatiUtentePermessi(): void {
    this.utenteService.inserimentoAggiornamentoUtente(this.codiceFiscale, this.datiUtente).subscribe();
  }

}
