import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Breadcrumb} from '../../../../dto/Breadcrumb';
import {InserimentoModificaUtente} from '../../../../model/utente/InserimentoModificaUtente';
import {UtenteService} from '../../../../../../services/utente.service';
import {Router} from '@angular/router';
import {DatiPermessoComponent} from '../dati-permesso/dati-permesso.component';
import {AsyncSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {PermessoCompleto} from '../../../../model/permesso/PermessoCompleto';
import {PermessoSingolo} from '../../../../model/permesso/PermessoSingolo';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {PermessoService} from '../../../../../../services/permesso.service';

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
  mapPermessi: Map<number, PermessoCompleto> = new Map();
  isFormDatiUtenteValido = false;

  @ViewChild('datiPermesso', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  getListaPermessi = (mapPermessi: Map<number, PermessoCompleto>) => Array.from(mapPermessi, ([name, value]) => value);


  constructor(private utenteService: UtenteService, private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef, private amministrativoService: AmministrativoService,
              private permessoService: PermessoService) {
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
    this.componentRef.instance.onDeletePermesso.subscribe(index => {
      this.mapPermessi.delete(index);
      this.target.remove(index - 1);
    });
    this.componentRef.instance.onChangeDatiPermesso.subscribe((permesso: PermessoSingolo) => {
      this.mapPermessi.set(permesso.index, permesso.permessoCompleto);
    });
    this.componentRef.changeDetectorRef.detectChanges();
  }

  disabilitaBottone(): boolean {
    return this.codiceFiscale === null || !this.isFormDatiUtenteValido || this.controlloDate();
  }

  controlloDate(): boolean {
    const dataAttivazione = this.datiUtente.attivazione;
    const dataScadenza = this.datiUtente.scadenza;
    const dataSistema = moment().format(Utils.FORMAT_DATE_CALENDAR);
    const listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
    const datePermesso = listaPermessi && listaPermessi.length > 0
      ? listaPermessi.filter((permesso: PermessoCompleto) => Utils.isBefore(permesso.dataInizioValidita, dataSistema) ||
        Utils.isBefore(permesso.dataFineValidita, dataSistema)) : [];
    const ret = Utils.isBefore(dataAttivazione, dataSistema) ||
      (this.datiUtente.scadenza ? Utils.isBefore(dataScadenza, dataSistema) : false) || datePermesso.length > 0;
    return ret;
  }

  inserimentoDatiUtentePermessi(): void {
    // inserimento utente
    let utente = new InserimentoModificaUtente();
    utente = this.datiUtente;
    utente.scadenza = utente.scadenza ?
      moment(utente.scadenza, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    utente.attivazione = utente.attivazione ?
      moment(utente.attivazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    this.utenteService.inserimentoAggiornamentoUtente(this.codiceFiscale, utente, this.amministrativoService.idFunzione)
      .pipe(map(datiUtente => {
        // se presenti inserimento permessi
        let listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
        if (listaPermessi.length > 0) {
          listaPermessi = listaPermessi.map(permesso => {
            permesso.dataFineValidita = permesso.dataFineValidita ?
              moment(permesso.dataFineValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
            permesso.dataInizioValidita = permesso.dataInizioValidita ?
              moment(permesso.dataInizioValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
            return permesso;
          });
          this.permessoService.inserimentoModificaPermessi(this.codiceFiscale, listaPermessi, this.amministrativoService.idFunzione)
            .pipe(map(res => {
            this.asyncSubject.next(this.codiceFiscale);
            this.asyncSubject.complete();
          }))
            .subscribe();
        } else {
          this.asyncSubject.next(this.codiceFiscale);
          this.asyncSubject.complete();
        }
      })).subscribe();
    this.asyncSubject.subscribe(codiceFiscale => this.router.navigate(['/modificaUtentePermessi', codiceFiscale]));
  }

  onClickAnnulla() {
    this.router.navigateByUrl('/gestioneUtenti?funzione=' + btoa(this.amministrativoService.idFunzione));
  }
}
