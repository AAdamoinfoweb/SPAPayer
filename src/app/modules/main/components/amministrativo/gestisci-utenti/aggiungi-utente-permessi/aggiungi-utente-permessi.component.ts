import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef, Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Breadcrumb} from '../../../../dto/Breadcrumb';
import {InserimentoModificaUtente} from '../../../../model/utente/InserimentoModificaUtente';
import {UtenteService} from '../../../../../../services/utente.service';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {DatiPermessoComponent} from '../dati-permesso/dati-permesso.component';
import {AsyncSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {PermessoCompleto} from '../../../../model/permesso/PermessoCompleto';
import {PermessoSingolo} from '../../../../model/permesso/PermessoSingolo';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {PermessoService} from '../../../../../../services/permesso.service';
import {PermessoFunzione} from "../../../../model/permesso/PermessoFunzione";

@Component({
  selector: 'app-aggiungi-utente-permessi',
  templateUrl: './aggiungi-utente-permessi.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './aggiungi-utente-permessi.component.scss']
})
export class AggiungiUtentePermessiComponent implements OnInit, AfterViewInit {

  breadcrumbList = [];

  tooltipTitle: string = `In questa pagina puoi aggiungere un utente e abilitarlo a specifici servizi`;
  titoloPagina: string = `Aggiungi Utente/Permessi`;

  codiceFiscale: string;
  codiceFiscaleModifica: string;

  datiUtente: InserimentoModificaUtente = new InserimentoModificaUtente();
  datiPermesso: PermessoCompleto;
  asyncSubject: AsyncSubject<string> = new AsyncSubject<string>();
  mapPermessi: Map<number, PermessoCompleto> = new Map();
  isFormDatiUtenteValido = false;
  isModifica = false;
  isDettaglio = false;

  @ViewChild('datiPermesso', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  getListaPermessi = (mapPermessi: Map<number, PermessoCompleto>) => Array.from(mapPermessi, ([name, value]) => value);


  constructor(private utenteService: UtenteService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef, private amministrativoService: AmministrativoService,
              private permessoService: PermessoService) {
    // codice fiscale da utente service per inserimento
    this.utenteService.codiceFiscaleEvent.subscribe(codiceFiscale => {
      this.codiceFiscale = codiceFiscale;
    });

  }


  inizializzaBreadcrumbList(): void {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', '/', null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Amministra Portale', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Gestisci Utenti', '/gestioneUtenti/' + this.amministrativoService.idFunzione, null));
    if (this.isModifica) {
      this.breadcrumbList.push(new Breadcrumb(3, 'Modifica Utente/Permessi', null, null));
    } else if (this.isDettaglio) {
      this.breadcrumbList.push(new Breadcrumb(3, 'Dettaglio Utente/Permessi', null, null));
    } else {
      this.breadcrumbList.push(new Breadcrumb(3, 'Aggiungi Utente/Permessi', null, null));
    }

  }

  ngOnInit(): void {
    // get route per logica inserimento o modifica
    this.activatedRoute.params.subscribe((params) => {
      if (this.activatedRoute.snapshot.url[0].path === 'modificaUtentePermessi') {
        this.isModifica = true;
        this.titoloPagina = `Modifica Utente/Permessi`;
        this.tooltipTitle = `In questa pagina puoi modificare un utente e abilitarlo a specifici servizi`;
        this.inizializzaBreadcrumbList();
        this.codiceFiscaleModifica = this.activatedRoute.snapshot.paramMap.get('userid');
        this.letturaPermessi(this.codiceFiscaleModifica);
      } else if (this.activatedRoute.snapshot.url[0].path === 'dettaglioUtentePermessi') {
        this.isDettaglio = true;
        this.titoloPagina = `Dettaglio Utente/Permessi`;
        this.tooltipTitle = `In questa pagina puoi visualizzare il dettaglio di un utente`;
        this.inizializzaBreadcrumbList();
        this.codiceFiscaleModifica = this.activatedRoute.snapshot.paramMap.get('userid');
        this.letturaPermessi(this.codiceFiscaleModifica);
      } else {
        this.inizializzaBreadcrumbList();
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
  }

  onChangeDatiUtenti(datiUtente: InserimentoModificaUtente): void {
    this.datiUtente = datiUtente;
  }

  aggiungiSezionePermesso(datiPermesso?: PermessoCompleto): number {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiPermessoComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const indexPermesso = this.target.length;
    this.componentRef.instance.indexSezionePermesso = indexPermesso;
    this.componentRef.instance.onDeletePermesso.subscribe(index => {
      // todo controllare cancellazione permesso su icona cestino e valorizzare permessoId
      const permessoCompleto = this.mapPermessi.get(index);
      const isPermessoDaModificare: boolean = permessoCompleto.listaFunzioni
        .some((permessoFunzione) => permessoFunzione.permessoId != null);
      if (!isPermessoDaModificare) {
        this.mapPermessi.delete(index);
      }
      this.target.remove(index - 1);
    });
    this.componentRef.instance.onChangeDatiPermesso.subscribe((currentPermesso: PermessoSingolo) => {
      if (this.mapPermessi.has(currentPermesso.index)) {
        const permessoCompleto: PermessoCompleto = this.mapPermessi.get(currentPermesso.index);
        if (permessoCompleto.enteId == null && permessoCompleto.listaFunzioni.length > 0) {
          // da amministrativo a gestionale
          if (currentPermesso.permessoCompleto.enteId != null) {
            // elimina logicamente permesso amministrativo precedente
            permessoCompleto.listaFunzioni[0].permessoCancellato = true;
            this.mapPermessi.set(Utils.uuidv4(), permessoCompleto);
          }
        } else if (permessoCompleto.enteId != null && permessoCompleto.listaFunzioni.length > 0) {
          // da gestionale ad amministrativo
          if (currentPermesso.permessoCompleto.enteId == null) {
            // elimina logicamente permessi gestionali precedenti
            const listaFunzioniAggiornata = permessoCompleto.listaFunzioni.map((permessoFunzione) => {
              permessoFunzione.permessoCancellato = true;
              return permessoFunzione;
            });
            permessoCompleto.listaFunzioni = listaFunzioniAggiornata;
            this.mapPermessi.set(Utils.uuidv4(), permessoCompleto);
          }
        }
      }
      this.mapPermessi.set(currentPermesso.index, currentPermesso.permessoCompleto);
    });
    if (datiPermesso) {
      this.datiPermesso = datiPermesso;
      this.componentRef.instance.datiPermesso = datiPermesso;
      if (this.isDettaglio) {
        this.componentRef.instance.isDettaglio = this.isDettaglio;
      }
    }
    this.componentRef.changeDetectorRef.detectChanges();
    return indexPermesso;
  }

  letturaPermessi(codiceFiscale) {
    this.permessoService.letturaPermessi(codiceFiscale, this.amministrativoService.idFunzione).subscribe((listaPermessi: PermessoCompleto[]) => {
      listaPermessi.forEach((permesso: PermessoCompleto) => {
        permesso.dataInizioValidita = permesso.dataInizioValidita ?
          moment(permesso.dataInizioValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
        permesso.dataFineValidita = permesso.dataFineValidita ?
          moment(permesso.dataFineValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
        const indexPermesso = this.aggiungiSezionePermesso(permesso);
        this.mapPermessi.set(indexPermesso, permesso);
      });
    });
  }

  disabilitaBottone(): boolean {
    let controlloCodiceFiscale = false;
    if(!this.isModifica && !this.isDettaglio) {
      controlloCodiceFiscale = this.codiceFiscale == null || this.codiceFiscale === '';
    }
    return controlloCodiceFiscale || !this.isFormDatiUtenteValido || this.controlloDate() || this.controlloDatiPermesso();
  }

  controlloDate(): boolean {
    const dataAttivazione = this.datiUtente.attivazione;
    const dataScadenza = this.datiUtente.scadenza;
    const dataSistema = moment().format(Utils.FORMAT_DATE_CALENDAR);
    const listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
    const datePermesso = listaPermessi && listaPermessi.length > 0
      ? listaPermessi.filter((permesso: PermessoCompleto) =>
        !permesso.listaFunzioni.some((permessoFunzione) => permessoFunzione.permessoId != null) &&
        (Utils.isBefore(permesso.dataInizioValidita, dataSistema) ||
          Utils.isBefore(permesso.dataFineValidita, dataSistema))) : [];
    const isDataAttivazioneBeforeDataSistema = this.isModifica ? false : Utils.isBefore(dataAttivazione, dataSistema);
    const isDataScadenzaBeforeDataSistema = this.datiUtente.scadenza ? Utils.isBefore(dataScadenza, dataSistema) : false;
    const ret = this.isDettaglio ? false : (isDataAttivazioneBeforeDataSistema || isDataScadenzaBeforeDataSistema || datePermesso.length > 0);
    return ret;
  }

  controlloDatiPermesso(): boolean {
    let ret = false;
    const listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
    listaPermessi.forEach(permesso => {
      if (permesso.enteId !== null) {
        if (permesso.servizioId == null) {
          ret = true;
        } else {
          if (permesso.listaFunzioni.length === 0) {
            ret = true;
          }
        }
      }
    });
    return ret;
  }

  inserimentoDatiUtentePermessi(): void {
    // inserimento utente
    let utente = new InserimentoModificaUtente();
    utente = {...this.datiUtente};
    utente.scadenza = utente.scadenza ?
      moment(utente.scadenza, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    utente.attivazione = utente.attivazione ?
      moment(utente.attivazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    const codiceFiscale = this.isModifica ? this.codiceFiscaleModifica : this.codiceFiscale
    this.utenteService.inserimentoAggiornamentoUtente(codiceFiscale, utente, this.amministrativoService.idFunzione)
      .pipe(map(datiUtente => {
        // se presenti inserimento permessi
        let listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
        if (listaPermessi.length > 0) {
          listaPermessi = listaPermessi.map(permesso => {
            if (permesso.enteId === null && permesso.listaFunzioni.length === 0) {
              // creazione funzione per permesso amministrativo al momento dell'inserimento
              const funzionePermessoAmministrativo = new PermessoFunzione();
              funzionePermessoAmministrativo.permessoId = null;
              funzionePermessoAmministrativo.permessoCancellato = false;
              funzionePermessoAmministrativo.funzioneId = null;
              const listaFunzioniAmministrative: PermessoFunzione[] = [funzionePermessoAmministrativo];
              permesso.listaFunzioni = listaFunzioniAmministrative;
            }
            permesso.dataFineValidita = permesso.dataFineValidita ?
              moment(permesso.dataFineValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
            permesso.dataInizioValidita = permesso.dataInizioValidita ?
              moment(permesso.dataInizioValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
            return permesso;
          });
          this.permessoService.inserimentoModificaPermessi(codiceFiscale, listaPermessi, this.amministrativoService.idFunzione)
            .pipe(map(res => {
              this.asyncSubject.next(codiceFiscale);
              this.asyncSubject.complete();
            }))
            .subscribe();
        } else {
          this.asyncSubject.next(codiceFiscale);
          this.asyncSubject.complete();
        }
      })).subscribe();
    this.asyncSubject.subscribe(cf => {
      this.codiceFiscaleModifica = cf;
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      }
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/modificaUtentePermessi', cf]);
    });
  }

  onClickAnnulla() {
    this.router.navigateByUrl('/gestioneUtenti?funzione=' + btoa(this.amministrativoService.idFunzione));
  }
}
