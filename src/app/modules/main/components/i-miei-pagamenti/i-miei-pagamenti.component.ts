import {Component, OnInit} from '@angular/core';
import {ToolEnum} from '../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {Utils} from '../../../../utils/Utils';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {map} from 'rxjs/operators';
import {IMieiPagamentiService} from '../../../../services/i-miei-pagamenti.service';
import {ParametriRicercaPagamenti} from '../../model/utente/ParametriRicercaPagamenti';
import {TipoPagamentoEnum} from '../../../../enums/tipoPagamento.enum';
import {EsitoEnum} from '../../../../enums/esito.enum';
import {StatoPagamentoEnum} from '../../../../enums/statoPagamento.enum';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {NuovoPagamentoService} from '../../../../services/nuovo-pagamento.service';
import {Banner} from '../../model/Banner';
import {getBannerType, LivelloBanner} from '../../../../enums/livelloBanner.enum';
import {BannerService} from '../../../../services/banner.service';
import {DettagliTransazione} from '../../model/bollettino/DettagliTransazione';
import {AsyncSubject} from 'rxjs';
import {DatiPagamento} from '../../model/bollettino/DatiPagamento';

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
  tooltipAddToCarrello = 'Aggiungi al carrello';

  MESSAGGIO_ERRORE_AZIONE = 'Operazione non consentita! Uno o più bollettini sono già stati pagati o in corso di pagamento. Per maggiori informazioni contattare l’help desk';
  MESSAGGIO_ERRORE_AZIONE_INSERIMENTO_CARRELLO = 'Operazione non consentita! Uno o più bollettini sono già presenti nel tuo carrello';
  MESSAGGIO_ERRORE_AZIONE_STAMPA_ATTESTATO = 'Operazione non consentita! Uno o più bollettini non sono stati pagati o in corso di pagamento. Per maggiori informazioni contattare l’help desk';

  // breadcrumb
  breadcrumbList = [];


  // tabs
  tabs = [{value: TipoPagamentoEnum.TUTTI},
    {value: TipoPagamentoEnum.IN_ATTESA},
    {value: TipoPagamentoEnum.PAGATI}];

  // toolbar
  toolbarIcons = [
    {type: ToolEnum.INSERT},
    {type: ToolEnum.INSERT_CARRELLO},
    {type: ToolEnum.DELETE},
    {type: ToolEnum.EXPORT_PDF}
  ];

  // table
  tableData = {
    rows: [],
    cols: [
      {field: 'icona', header: '', type: tipoColonna.ICONA},
      {field: 'numeroDocumento', header: 'N.ro Documento', type: tipoColonna.TESTO},
      {field: 'nomeServizio', header: 'Descrizione', type: tipoColonna.TESTO},
      {field: 'nomeEnte', header: 'Ente', type: tipoColonna.TESTO},
      {field: 'dataScadenza', header: 'Scadenza', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'dataPagamento', header: 'Data Pagamento', type: tipoColonna.TESTO}
    ],
    dataKey: 'numeroDocumento',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;
  private listaPagamenti: DatiPagamento[];
  private pagamentiSelezionati: DatiPagamento[];

  constructor(private iMieiPagamentiService: IMieiPagamentiService, private router: Router,
              private nuovoPagamentoService: NuovoPagamentoService, private bannerService: BannerService) {
    // init breadcrumb
    this.inizializzaBreadcrumb();
  }

  private inizializzaBreadcrumb() {
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', null, null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Pagamenti', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'I Miei Pagamenti', null, null));
  }

  ngOnInit(): void {
    this.inizializzaListaPagamenti();
  }

  private inizializzaListaPagamenti() {
    const filtri = new ParametriRicercaPagamenti();
    this.iMieiPagamentiService.ricercaPagamenti(filtri).pipe(map(listaPagamenti => {
      this.riempiListaPagamenti(listaPagamenti);
    })).subscribe();
  }


  onChangeTab(value) {
    let tempListaPagamenti;
    if (value === TipoPagamentoEnum.TUTTI) {
      tempListaPagamenti = this.listaPagamenti;
    } else if (value === TipoPagamentoEnum.IN_ATTESA) {
      tempListaPagamenti = this.listaPagamenti.filter(pagamento =>
        pagamento.esitoPagamento !== EsitoEnum.OK && (
          pagamento.statoPagamento != null ? pagamento.statoPagamento === StatoPagamentoEnum.IN_ATTESA : true
        )
      );
    } else if (value === TipoPagamentoEnum.PAGATI) {
      tempListaPagamenti = this.listaPagamenti.filter(pagamento =>
        pagamento.esitoPagamento === EsitoEnum.OK);
    }

    this.riempiTabella(tempListaPagamenti);
  }

  // todo logica azioni tool
  eseguiAzioni(tool) {
    if (tool === ToolEnum.INSERT) {
      // redirect nuovo pagamento page
      this.router.navigateByUrl('/nuovoPagamento');
    } else if (tool === ToolEnum.INSERT_CARRELLO) {
      // inserisce pagamento nel carrello
      this.inserimentoCarrello();
    } else if (tool === ToolEnum.DELETE) {
      // elimina pagamenti
      this.eliminaPagamenti();
    } else if (tool === ToolEnum.EXPORT_PDF) {
      // esporta in excel
      this.stampaAttestatiPagamento();
    }
  }

  getTestoConNumeroUtentiAttiviDisabilitati(): string {
    return '';
  }

  riempiListaPagamenti(lista: DatiPagamento[]) {
    this.listaPagamenti = lista;
    this.riempiTabella(lista);
  }

  riempiTabella(listaPagamenti: DatiPagamento[]) {
    const pagamenti = listaPagamenti.map(pagamento => {
      const row = {
        icona: Utils.creaIcona('assets/img/sprite.svg#it-pencil', '#ef8157', 'tooltip', null),
        numeroDocumento: pagamento.numeroDocumento,
        nomeServizio: pagamento.nomeServizio,
        nomeEnte: pagamento.nomeEnte,
        dataScadenza: pagamento.dataScadenza ? moment(pagamento.dataScadenza).format('DD/MM/YYYY') : null,
        importo: pagamento.importo,
        dataPagamento: pagamento.dataPagamento ? moment(pagamento.dataPagamento).format('DD/MM/YYYY') : null
      };
      return row;
    });
    this.tableData.rows = pagamenti;
    // oggetto contenente le rows recuperate dalla ricerca
    // this.tempTableData.rows = Object.assign({}, this.tableData.rows);
  }

  selezionaPagamenti(rows: any[]) {
    // tslint:disable-next-line:prefer-const
    let tempPagamentiSelezionati: DatiPagamento[] = [];
    rows.forEach(value => {
      const pagamentoSelezionato: DatiPagamento[] = this.listaPagamenti
        .filter(pagamento => pagamento.numeroDocumento === value.numeroDocumento);
      tempPagamentiSelezionati.push(...pagamentoSelezionato);
    });
    this.pagamentiSelezionati = tempPagamentiSelezionati;
  }

  inserimentoCarrello() {
    const messaggioInserimentoCarrello = this.controlloValiditaPagamentiInserimentoCarrello();
    if (messaggioInserimentoCarrello == null) {
      this.iMieiPagamentiService.inserimentoPagamentiCarrello(this.pagamentiSelezionati).pipe(map(res => {
        // refresh table
        // todo prendere filtri se valorizzati
        this.inizializzaListaPagamenti();
      })).subscribe();
    } else {
      this.mostraBannerError(messaggioInserimentoCarrello);
    }
  }

  eliminaPagamenti() {
    const possibilitaInserimentoCarrello = this.controlloValiditaPagamentiEliminaPagamenti();
    if (possibilitaInserimentoCarrello) {
      const dettagliTransazione: DettagliTransazione = new DettagliTransazione();
      dettagliTransazione.listaDettaglioTransazioneId = this.pagamentiSelezionati.map(pagamento => pagamento.dettaglioTransazioneId);
      this.iMieiPagamentiService.eliminaBollettino(dettagliTransazione).pipe(map(value => {
        this.inizializzaListaPagamenti();
      })).subscribe();
    } else {
      this.mostraBannerError(this.MESSAGGIO_ERRORE_AZIONE);
    }
  }

  stampaAttestatiPagamento() {
    const messaggioValiditaPagamentiStampaAttestatoPagamenti = this.controlloValiditaPagamentiStampaAttestatoPagamenti();
    if (messaggioValiditaPagamentiStampaAttestatoPagamenti == null) {
      const listaDettaglioTransazione: number[] = this.pagamentiSelezionati
        .map(pagamentoSelezionato => pagamentoSelezionato.dettaglioTransazioneId);
      const listaPdf: string[] = [];
      this.iMieiPagamentiService.stampaAttestatiPagamento(listaDettaglioTransazione)
        .pipe(map((result) => {
          listaPdf.push(...result);
          listaPdf.forEach(pdf => {
            Utils.aperturaFile(pdf);
          });
        })).subscribe();
    } else {
      this.mostraBannerError(this.MESSAGGIO_ERRORE_AZIONE);
    }
  }

  controlloValiditaPagamentiInserimentoCarrello() {
    let messaggio = null;
    this.pagamentiSelezionati.forEach(pagamento => {
      if (pagamento.esitoPagamento === EsitoEnum.OK || pagamento.esitoPagamento === EsitoEnum.PENDING) {
        // aggiorno flag per inserimento carrello
        messaggio = this.MESSAGGIO_ERRORE_AZIONE;
      } else if (pagamento.flagCarrello === true) {
        messaggio = this.MESSAGGIO_ERRORE_AZIONE_INSERIMENTO_CARRELLO;
      }
    });
    return messaggio;
  }

  controlloValiditaPagamentiEliminaPagamenti() {
    let ret = true;
    this.pagamentiSelezionati.forEach(pagamento => {
      if ((pagamento.esitoPagamento === EsitoEnum.OK || pagamento.esitoPagamento === EsitoEnum.PENDING)
        || pagamento.statoPagamento === StatoPagamentoEnum.IN_ATTESA) {
        // aggiorno flag per inserimento carrello
        ret = false;
      }
    });
    return ret;
  }

  controlloValiditaPagamentiStampaAttestatoPagamenti() {
    let messaggio = null;
    this.pagamentiSelezionati.forEach(pagamento => {
      if (pagamento.esitoPagamento !== EsitoEnum.OK) {
        // aggiorno flag per inserimento carrello
        messaggio = this.MESSAGGIO_ERRORE_AZIONE_STAMPA_ATTESTATO;
      }
    });
    return messaggio;
  }

  mostraBannerError(messaggio: string) {
    // mostro banner errore
    const banner: Banner = {
      titolo: 'ERROR',
      testo: messaggio,
      tipo: getBannerType(LivelloBanner.ERROR)
    };
    this.bannerService.bannerEvent.emit([banner]);
  }


}
