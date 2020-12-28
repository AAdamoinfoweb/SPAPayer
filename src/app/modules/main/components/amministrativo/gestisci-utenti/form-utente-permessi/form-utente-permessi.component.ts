import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import {SintesiBreadcrumb} from '../../../../dto/Breadcrumb';
import {InserimentoModificaUtente} from '../../../../model/utente/InserimentoModificaUtente';
import {UtenteService} from '../../../../../../services/utente.service';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {DatiPermessoComponent} from '../dati-permesso/dati-permesso.component';
import {AsyncSubject} from 'rxjs';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {PermessoCompleto} from '../../../../model/permesso/PermessoCompleto';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {PermessoService} from '../../../../../../services/permesso.service';
import {PermessoFunzione} from '../../../../model/permesso/PermessoFunzione';
import {OverlayService} from '../../../../../../services/overlay.service';
import {BannerService} from '../../../../../../services/banner.service';
import {Banner} from '../../../../model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../../../../../enums/livelloBanner.enum';
import {FormElementoParentComponent} from '../../form-elemento-parent.component';
import {ConfirmationService} from 'primeng/api';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {HttpClient} from '@angular/common/http';
import {ParametriRicercaUtente} from '../../../../model/utente/ParametriRicercaUtente';
import {map} from 'rxjs/operators';
import {ComponenteDinamico} from '../../../../model/ComponenteDinamico';
import {RoutingService} from '../../../../../../services/routing.service';

@Component({
  selector: 'app-aggiungi-utente-permessi',
  templateUrl: './form-utente-permessi.component.html',
  styleUrls: ['../gestisci-utenti.component.scss', './form-utente-permessi.component.scss']
})
export class FormUtentePermessiComponent extends FormElementoParentComponent implements OnInit {
  // enums consts
  FunzioneGestioneEnum = FunzioneGestioneEnum;
  messaggioUtentePresente = 'Il codice fiscale dell’utente è già presente nel sistema';
  breadcrumbList = [];

  tooltipTitle;
  titoloPagina;

  codiceFiscale: string;
  codiceFiscaleRecuperato: string;

  datiUtente: InserimentoModificaUtente = new InserimentoModificaUtente();
  datiPermesso: PermessoCompleto;
  asyncSubject: AsyncSubject<string> = new AsyncSubject<string>();
  mapPermessi: Map<string, PermessoCompleto> = new Map();
  isFormDatiUtenteValido = false;
  funzione: FunzioneGestioneEnum;

  @ViewChild('datiPermesso', {static: false, read: ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  targetMap: Map<string, ViewRef> = new Map<string, ViewRef>();

  getListaPermessi = (mapPermessi: Map<string, PermessoCompleto>) => Array.from(mapPermessi, ([name, value]) => value);


  constructor(private utenteService: UtenteService, protected router: Router,
              protected http: HttpClient,
              protected activatedRoute: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver, private renderer: Renderer2,
              private el: ElementRef, protected amministrativoService: AmministrativoService,
              private permessoService: PermessoService,
              private overlayService: OverlayService,
              confirmationService: ConfirmationService,
              private bannerService: BannerService, private routingService: RoutingService) {
    super(confirmationService, activatedRoute, amministrativoService, http, router);
    // codice fiscale del form da utente service
    this.utenteService.codiceFiscaleEvent.subscribe(codiceFiscale => {
      this.codiceFiscale = codiceFiscale;
    });
  }

  ngOnInit(): void {
  }

  initFormPage(snapshot: ActivatedRouteSnapshot) {
    this.controllaTipoFunzione(snapshot);
    this.inizializzaTitoloPagina();
    this.inizializzaBreadcrumbs();
    if (this.funzione !== FunzioneGestioneEnum.AGGIUNGI) {
      this.codiceFiscaleRecuperato = snapshot.paramMap.get('userid');
      if (this.codiceFiscaleRecuperato) {
        // inizializza form modifica o dettaglio
        this.datiUtente = new InserimentoModificaUtente();
        const parametriRicerca = new ParametriRicercaUtente();
        parametriRicerca.codiceFiscale = this.codiceFiscaleRecuperato;
        this.ricercaUtente(parametriRicerca);
        this.letturaPermessi(this.codiceFiscaleRecuperato);
      }
    } else {
      // inizializza form inserimento
      this.codiceFiscale = null;
      this.datiUtente.attivazione = moment().format(Utils.FORMAT_DATE_CALENDAR);
    }
  }

  controllaTipoFunzione(snapshot: ActivatedRouteSnapshot) {
    const url = snapshot.url[1].path;
    switch (url) {
      case 'dettaglioUtentePermessi':
        this.funzione = FunzioneGestioneEnum.DETTAGLIO;
        break;
      case 'aggiungiUtentePermessi':
        this.funzione = FunzioneGestioneEnum.AGGIUNGI;
        break;
      case 'modificaUtentePermessi':
        this.funzione = FunzioneGestioneEnum.MODIFICA;
        break;
    }
  }

  inizializzaTitoloPagina() {
    this.titoloPagina = this.getTestoFunzione(this.funzione) + ' Utenti/Permessi';
    this.tooltipTitle = 'In questa pagina puoi ' +
      this.getTestoFunzione(this.funzione, false) + ' i dettagli di un utente e i suoi permessi';
  }

  inizializzaBreadcrumbs(): void {
    const breadcrumbs: SintesiBreadcrumb[] = [];
    breadcrumbs.push(new SintesiBreadcrumb('Gestisci Utenti', this.basePath));
    breadcrumbs.push(new SintesiBreadcrumb(this.getTestoFunzione(this.funzione) + ' Utente/Permessi', null));
    this.breadcrumbList = this.inizializzaBreadcrumbList(breadcrumbs);
  }

  ricercaUtente(parametriRicerca: ParametriRicercaUtente): void {
    this.utenteService.ricercaUtenti(parametriRicerca, this.idFunzione).pipe(map(utenti => {
      const utente = utenti[0];
      this.datiUtente.nome = utente?.nome;
      this.datiUtente.cognome = utente?.cognome;
      this.datiUtente.email = utente?.email;
      this.datiUtente.telefono = utente?.telefono;
      this.datiUtente.attivazione = utente?.dataInizioValidita ?
        moment(utente?.dataInizioValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
      this.datiUtente.scadenza = utente?.dataFineValidita ?
        moment(utente?.dataFineValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
    })).subscribe();
  }

  onChangeDatiUtenti(datiUtente: InserimentoModificaUtente): void {
    this.datiUtente = datiUtente;
  }

  aggiungiSezionePermesso(datiPermesso?: PermessoCompleto): string {
    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DatiPermessoComponent);
    this.componentRef = this.target.createComponent(childComponent);
    const indexPermesso = this.target.length;
    this.componentRef.instance.indexSezionePermesso = indexPermesso;
    const uuidComponente = Utils.uuidv4();
    this.componentRef.instance.uuid = uuidComponente;
    this.targetMap.set(uuidComponente, this.componentRef.hostView);
    this.componentRef.instance.onDeletePermesso.subscribe((componenteDinamico: ComponenteDinamico) => {
      const permessoCompleto = this.mapPermessi.get(componenteDinamico.uuid);
      const isPermessoDaModificare: boolean = permessoCompleto.listaFunzioni
        .some((permessoFunzione) => permessoFunzione.permessoId != null);
      if (!isPermessoDaModificare) {
        this.mapPermessi.delete(componenteDinamico.uuid);
      }
      // controllo se esiste un view ref e target ha solo un elemento, se vero uso remove altrimenti clear
      const viewRef = this.targetMap.get(componenteDinamico.uuid);
      const indexViewRef = this.target.indexOf(viewRef);
      if (this.target.length === 1) {
        this.target.clear();
        this.targetMap.clear();
      } else {
        this.target.remove(indexViewRef);
        this.targetMap.delete(componenteDinamico.uuid);
      }
    });
    this.componentRef.instance.onChangeDatiPermesso.subscribe((componenteDinamico: ComponenteDinamico) => {
      if (this.mapPermessi.has(componenteDinamico.uuid)) {
        const permessoCompleto: PermessoCompleto = this.mapPermessi.get(componenteDinamico.uuid);
        if (permessoCompleto.enteId == null && permessoCompleto.listaFunzioni.length > 0) {
          // da amministrativo a gestionale
          if (componenteDinamico.oggetto.enteId != null) {
            // elimina logicamente permesso amministrativo precedente
            permessoCompleto.listaFunzioni[0].permessoCancellato = true;
            this.mapPermessi.set(Utils.uuidv4(), permessoCompleto);
          }
        } else if (permessoCompleto.enteId != null && permessoCompleto.listaFunzioni.length > 0) {
          // da gestionale ad amministrativo
          if (componenteDinamico.oggetto.enteId == null) {
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
      this.mapPermessi.set(componenteDinamico.uuid, componenteDinamico.oggetto);
    });
    if (datiPermesso) {
      this.datiPermesso = datiPermesso;
      this.componentRef.instance.datiPermesso = datiPermesso;
    }
    this.componentRef.instance.funzione = this.funzione;
    this.componentRef.instance.idFunzione = this.idFunzione;
    this.componentRef.changeDetectorRef.detectChanges();
    return uuidComponente;
  }

  letturaPermessi(codiceFiscale) {
    this.permessoService.letturaPermessi(codiceFiscale, this.idFunzione).subscribe((listaPermessi: PermessoCompleto[]) => {
      listaPermessi.forEach((permesso: PermessoCompleto) => {
        permesso.dataInizioValidita = permesso.dataInizioValidita ?
          moment(permesso.dataInizioValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
        permesso.dataFineValidita = permesso.dataFineValidita ?
          moment(permesso.dataFineValidita, Utils.FORMAT_LOCAL_DATE_TIME).format(Utils.FORMAT_DATE_CALENDAR) : null;
        const uuidComponente = this.aggiungiSezionePermesso(permesso);
        this.mapPermessi.set(uuidComponente, permesso);
      });
    });
  }

  disabilitaBottone(): boolean {
    let controlloCodiceFiscale = false;
    const listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);

    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      controlloCodiceFiscale = this.codiceFiscale == null || this.codiceFiscale === '';
    }

    return controlloCodiceFiscale || !this.isFormDatiUtenteValido
      || (listaPermessi.length > 0 && listaPermessi.some(value => !('enteId' in value)));
  }


  onClickSalva(): void {
    // inserimento utente
    let utente = new InserimentoModificaUtente();
    utente.listaPermessi = new Array<PermessoCompleto>();
    utente = JSON.parse(JSON.stringify(this.datiUtente));
    utente.scadenza = utente.scadenza ?
      moment(utente.scadenza, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    utente.attivazione = utente.attivazione ?
      moment(utente.attivazione, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    const codiceFiscale = this.funzione === FunzioneGestioneEnum.MODIFICA ? this.codiceFiscaleRecuperato : this.codiceFiscale;
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      // controllo su codice fiscale
      this.utenteService.letturaCodiciFiscali(this.codiceFiscale, this.idFunzione).subscribe((data) => {
        const codiciFiscaleUpperCase = data.map(value => value.toUpperCase());
        const iscodiceFiscaleEsistente = codiciFiscaleUpperCase.includes(this.codiceFiscale.toUpperCase());
        if (iscodiceFiscaleEsistente) {
          const banner: Banner = {
            titolo: 'ATTENZIONE',
            testo: this.messaggioUtentePresente,
            tipo: getBannerType(LivelloBanner.ERROR)
          };
          this.bannerService.bannerEvent.emit([banner]);
        } else {
          this.inserimentoModificaUtentePermessi(codiceFiscale, utente);
        }
      });
    } else {
      // nessun controllo codice fiscale
      this.inserimentoModificaUtentePermessi(codiceFiscale, utente);
    }
    this.asyncSubject.subscribe(cf => {
      this.codiceFiscaleRecuperato = cf;
      this.routingService
        .configuraRouterAndNavigate(this.basePath + '/modificaUtentePermessi/' + cf,
          null);
      this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
    });
  }


  private inserimentoModificaUtentePermessi(codiceFiscale: string, utente: InserimentoModificaUtente) {
    let listaPermessi: PermessoCompleto[] = this.getListaPermessi(this.mapPermessi);
    if (listaPermessi.length > 0) {
      listaPermessi = this.formattaPermessi(listaPermessi);
    }
    utente.listaPermessi = listaPermessi;

    this.utenteService.inserimentoModificaUtentePermessi(codiceFiscale, utente, this.idFunzione).subscribe((err) => {
      if (err == null) {
        this.asyncSubject.next(codiceFiscale);
        this.asyncSubject.complete();
      }
    });
  }

  formattaPermessi(listaPermessi: PermessoCompleto[]): PermessoCompleto[] {
    // creo permessi da inserire
    return listaPermessi.map(permesso => {
      const permessoDaInserire = JSON.parse(JSON.stringify(permesso));
      if (permesso.enteId === null && permesso.listaFunzioni.length === 0) {
        // creazione funzione per permesso amministrativo al momento dell'inserimento
        const funzionePermessoAmministrativo = new PermessoFunzione();
        funzionePermessoAmministrativo.permessoId = null;
        funzionePermessoAmministrativo.permessoCancellato = false;
        funzionePermessoAmministrativo.funzioneId = null;
        const listaFunzioniAmministrative: PermessoFunzione[] = [funzionePermessoAmministrativo];
        permessoDaInserire.listaFunzioni = listaFunzioniAmministrative;
      }
      permessoDaInserire.dataFineValidita = permesso.dataFineValidita ?
        moment(permesso.dataFineValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
      permessoDaInserire.dataInizioValidita = permesso.dataInizioValidita ?
        moment(permesso.dataInizioValidita, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
      return permessoDaInserire;
    });
  }

  onClickAnnullaButton() {
    this.onClickAnnulla(this.funzione);
  }
}
