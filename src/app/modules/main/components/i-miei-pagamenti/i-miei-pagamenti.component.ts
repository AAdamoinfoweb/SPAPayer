import {Component, OnInit} from '@angular/core';
import {ToolEnum} from '../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {Utils} from '../../../../utils/Utils';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {DatiPagamento} from '../../model/DatiPagamento';
import {flatMap, map} from 'rxjs/operators';
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
import {DettaglioTransazioneEsito} from '../../model/bollettino/DettaglioTransazioneEsito';
import {of} from 'rxjs';
import {Bollettino} from '../../model/bollettino/Bollettino';
import {CampoDettaglioTransazione} from '../../model/bollettino/CampoDettaglioTransazione';
import {Util} from 'design-angular-kit/lib/util/util';

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
        id: pagamento.dettaglioTransazioneId,
        icona: Utils.creaIcona('assets/img/sprite.svg#it-pencil', '#ef8157', 'tooltip', null),
        numeroDocumento: pagamento.numeroDocumento,
        nomeServizio: pagamento.nomeServizio,
        nomeEnte: pagamento.nomeEnte,
        dataScadenza: pagamento.dataScadenza ? moment(pagamento.dataScadenza).format('DD/MM/YYYY') : null,
        importo: pagamento.importo,
        dataPagamento: pagamento.dataPagamento ? moment(pagamento.dataPagamento).format('DD/MM/YYYY') : null,
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
      const pagamentoSelezionato: DatiPagamento[] = this.listaPagamenti.filter(pagamento => pagamento.dettaglioTransazioneId === value.id);
      tempPagamentiSelezionati.push(...pagamentoSelezionato);
    });
    this.pagamentiSelezionati = tempPagamentiSelezionati;
  }

  inserimentoCarrello() {
    const messaggioInserimentoCarrello = this.controlloValiditaPagamentiInserimentoCarrello();
    const listaDettaglioTransazioneId: number[] = [];
    if (messaggioInserimentoCarrello == null) {
      this.pagamentiSelezionati.forEach(pagamento => {
        if (pagamento.dettaglioTransazioneId == null) {
          // lettura campi
          const listaCampoDettaglioTransazione: CampoDettaglioTransazione[] = this.letturaCampi(pagamento.codiceAvviso);
          // inserimento bollettino
          const dettagliTransazioneId: number[] = this.inserimentoBollettino(pagamento, listaCampoDettaglioTransazione);
          // recupera id
          listaDettaglioTransazioneId.push(...dettagliTransazioneId);
        } else {
          // recupera id
          listaDettaglioTransazioneId.push(pagamento.dettaglioTransazioneId);
        }
      });
      // setto nell'oggetto dettagli transazione la lista di dettaglio transazione id
      const dettagliTransazione: DettagliTransazione = new DettagliTransazione();
      dettagliTransazione.listaDettaglioTransazioneId = listaDettaglioTransazioneId;
      this.nuovoPagamentoService.inserimentoCarrello(dettagliTransazione).subscribe();
    } else {
      this.mostraBannerError(messaggioInserimentoCarrello);
    }
    // refresh table
    // todo prendere filtri se valorizzati
    this.inizializzaListaPagamenti();
  }

  eliminaPagamenti() {
    const possibilitaInserimentoCarrello = this.controlloValiditaPagamentiEliminaPagamenti();
    if (possibilitaInserimentoCarrello) {
      const dettagliTransazione: DettagliTransazione = new DettagliTransazione();
      dettagliTransazione.listaDettaglioTransazioneId = this.pagamentiSelezionati.map(pagamento => pagamento.dettaglioTransazioneId);
      this.iMieiPagamentiService.eliminaBollettino(dettagliTransazione).subscribe();
    } else {
      this.mostraBannerError(this.MESSAGGIO_ERRORE_AZIONE);
    }
    // refresh table
    // todo prendere filtri se valorizzati
    this.inizializzaListaPagamenti();
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
        messaggio = this.MESSAGGIO_ERRORE_AZIONE;
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

  private letturaCampi(codiceAvviso: string): CampoDettaglioTransazione[] {
    const listaCampoDettaglioTransazione: CampoDettaglioTransazione[] = [];
    this.iMieiPagamentiService.letturaCampi(codiceAvviso)
      .pipe(flatMap((result) => {
        result.forEach(campoDettaglioTransazione => listaCampoDettaglioTransazione.push(campoDettaglioTransazione));
        return result;
      })).subscribe();
    return listaCampoDettaglioTransazione;
  }

  private inserimentoBollettino(pagamento: DatiPagamento, listaCampoDettaglioTransazione: CampoDettaglioTransazione[]): number[] {
    const listaDettagliTransazioneId: number[] = [];
    this.nuovoPagamentoService.inserimentoBollettino(this.creaBollettino(pagamento, listaCampoDettaglioTransazione))
      .pipe(flatMap((result) => {
        result.forEach(dettaglioTransazioneEsito => listaDettagliTransazioneId.push(dettaglioTransazioneEsito.dettaglioTransazioneId));
        return result;
      })).subscribe();
    return listaDettagliTransazioneId;
  }

  creaBollettino(pagamento: DatiPagamento, listaCampoDettaglioTransazione: CampoDettaglioTransazione[]): Bollettino[] {
    const bollettini: Bollettino[] = [];
    const bollettino: Bollettino = new Bollettino();
    bollettino.servizioId = pagamento.servizioId;
    bollettino.enteId = pagamento.enteId;
    bollettino.numero = pagamento.numeroDocumento;
    bollettino.anno = pagamento.annoDocumento;
    bollettino.causale = pagamento.causale;
    const codiceAvvisoSplit = pagamento.codiceAvviso.split('001');
    bollettino.iuv = codiceAvvisoSplit.length > 1 ? codiceAvvisoSplit[1] : null;
    bollettino.cfpiva = localStorage.getItem('username');
    bollettino.importo = pagamento.importo;
    bollettino.listaCampoDettaglioTransazione = listaCampoDettaglioTransazione;
    bollettini.push(bollettino);
    return bollettini;
  }

  stampaAttestatiPagamento() {
    const messaggioValiditaPagamentiStampaAttestatoPagamenti = this.controlloValiditaPagamentiStampaAttestatoPagamenti();
    if (messaggioValiditaPagamentiStampaAttestatoPagamenti == null) {
      const listaDettaglioTransazione: number[] = this.pagamentiSelezionati
        .map(pagamentoSelezionato => pagamentoSelezionato.dettaglioTransazioneId);
      const listaPdf: string[] = [];
      this.iMieiPagamentiService.stampaAttestatiPagamento(listaDettaglioTransazione)
        .pipe(flatMap((result) => {
        listaPdf.push(...result);
        return result;
      })).subscribe();

      listaPdf.forEach(pdf => {
        Utils.aperturaFile(pdf);
      });
    } else {
      this.mostraBannerError(this.MESSAGGIO_ERRORE_AZIONE);
    }


  }

}
