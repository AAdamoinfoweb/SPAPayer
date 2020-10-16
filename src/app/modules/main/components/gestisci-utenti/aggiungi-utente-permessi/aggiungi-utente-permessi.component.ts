import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {Breadcrumb} from '../../../dto/Breadcrumb';
import {InserimentoModificaUtente} from '../../../model/utente/InserimentoModificaUtente';
import {UtenteService} from '../../../../../services/utente.service';
import {Router} from '@angular/router';
import {DatiPermessoComponent} from '../../dati-permesso/dati-permesso.component';
import {AsyncSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-aggiungi-utente-permessi',
  templateUrl: './aggiungi-utente-permessi.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './aggiungi-utente-permessi.component.scss']
})
export class AggiungiUtentePermessiComponent implements OnInit, AfterViewInit {

  breadcrumbList = [];

  readonly tooltipAggiungiUtentePermessiTitle = 'In questa pagina puoi aggiungere un utente amministratore e abilitarlo a specifici servizi';

  codiceFiscale: string;
  datiUtente: InserimentoModificaUtente = new InserimentoModificaUtente();
  asyncSubject: AsyncSubject<string> = new AsyncSubject<string>();

  isFormDatiUtenteValido = false;

  @ViewChild('datiPermesso', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  constructor(private utenteService: UtenteService, private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef) {
    this.utenteService.codiceFiscaleEvent.subscribe(codiceFiscale => {
      this.codiceFiscale = codiceFiscale;
    });

    this.inizializzaBreadcrumbList();
  }

  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', '/gestioneUtenti', null));
    this.breadcrumbList.push(new Breadcrumb(3, 'Aggiungi Utente/Permessi', null, null));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  onChangeDatiUtenti(datiUtente: InserimentoModificaUtente): void {
    this.datiUtente = datiUtente;
  }

  aggiungiSezionePermesso(): void {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiPermessoComponent);
    this.componentRef = this.target.createComponent(childComponent);
    this.componentRef.instance.indexSezionePermesso = this.target.length;
    this.componentRef.instance.onDeletePermesso.subscribe(index => this.target.remove(index - 1));
  }

  disabilitaBottone(): boolean {
    return this.codiceFiscale === null || !this.isFormDatiUtenteValido;
  }

  inserimentoDatiUtentePermessi(): void {
    this.utenteService.inserimentoAggiornamentoUtente(this.codiceFiscale, this.datiUtente).pipe(map(datiUtente => {
      this.asyncSubject.next(this.codiceFiscale);
      this.asyncSubject.complete();
    })).subscribe();
    this.asyncSubject.subscribe(codiceFiscale => this.router.navigate(['/modificaUtentePermessi', codiceFiscale]));
  }

}
