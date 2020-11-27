import {Component, OnInit} from '@angular/core';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';
import {GestisciElementoComponent} from '../../../gestisci-elemento.component';
import {Transazione} from '../../../../../model/transazione/Transazione';
import {DettaglioTransazione} from '../../../../../model/transazione/DettaglioTransazione';
import {ToolEnum} from '../../../../../../../enums/Tool.enum';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {Colonna} from '../../../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../../../model/tabella/ImmaginePdf';
import {Observable} from 'rxjs';
import {MonitoraggioTransazioniService} from '../../../../../../../services/monitoraggio-transazioni.service';
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-dettaglio-transazione',
  templateUrl: './dettaglio-transazione.component.html',
  styleUrls: ['./dettaglio-transazione.component.scss']
})
export class DettaglioTransazioneComponent extends GestisciElementoComponent implements OnInit {

  readonly FunzioneGestioneEnum = FunzioneGestioneEnum;
  funzione: FunzioneGestioneEnum = FunzioneGestioneEnum.DETTAGLIO;

  readonly titoloPagina = 'Dettaglio Transazione';
  readonly tooltipTitolo = 'In questa pagina puoi visualizzare i dettagli di una transazione';

  breadcrumbList = [];

  datiTransazione: Transazione = new Transazione();
  listaElementi: Array<DettaglioTransazione> = new Array<DettaglioTransazione>();
  righeSelezionate: any[];

  filtriRicerca = null;

  toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF, tooltip: 'Stampa Pdf'},
    {type: ToolEnum.EXPORT_XLS, tooltip: 'Download'},
    {type: ToolEnum.PRINT_RPT, tooltip: 'Stampa RPT (Ricevuta di Pagamento Telematica)'},
    {type: ToolEnum.PRINT_RT, tooltip: 'Stampa RT (Ricevuta Telematica)'}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'id', header: 'Id Bollettino', type: tipoColonna.TESTO},
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'ente', header: 'Ente', type: tipoColonna.LINK},
      {field: 'servizio', header: 'Servizio', type: tipoColonna.TESTO},
      {field: 'pagatore', header: 'Pagatore (Cod. Fiscale)', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'idRendicontazione', header: 'Id rendicontazione', type: tipoColonna.TESTO},
      {field: 'idQuadratura', header: 'Id quadratura', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(protected router: Router, protected route: ActivatedRoute, protected http: HttpClient,
              protected amministrativoService: AmministrativoService,
              private monitoraggioTransazioniService: MonitoraggioTransazioniService) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitoraggio Transazioni', link: this.basePath},
      {label: 'Dettaglio Transazione', link: null}
    ], true);

    this.popolaTransazione();
  }

  popolaTransazione(): void {
    this.listaElementi = [];
    this.tableData.rows = [];
    this.getObservableFunzioneRicerca().subscribe(elemento => {
      if (elemento != null) {
        this.listaElementi = elemento.listaDettaglioTransazione;
        delete elemento.listaDettaglioTransazione;
        this.datiTransazione = elemento;
        this.impostaTabella(this.listaElementi);
      }
      this.waiting = false;
    });
  }

  callbackPopolaLista() {
  }

  getObservableFunzioneRicerca(): Observable<Transazione> {
    const idSelezionato = parseInt(this.route.snapshot.paramMap.get('transazioneId'));
    return this.monitoraggioTransazioniService.dettaglioTransazione(idSelezionato, this.idFunzione);
  }

  creaRigaTabella(dettaglioTransazione: DettaglioTransazione) {
    const iconaGruppoUtenti = 'assets/img/users-solid.svg#users-group';
    const linkGestisciEnti = '/gestisciEnti?enteId=' + dettaglioTransazione.enteId;

    return {
      id: {value: dettaglioTransazione.dettaglioTransazioneId},
      iuv: {value: dettaglioTransazione.iuv},
      ente: Utils.creaLink(dettaglioTransazione.enteNome, linkGestisciEnti, iconaGruppoUtenti),
      servizio: {value: dettaglioTransazione.servizioNome},
      pagatore: {value: dettaglioTransazione.pagatoreCodiceFiscale},
      importo: {value: dettaglioTransazione.importo},
      idRendicontazione: {value: dettaglioTransazione.rendicontazioneId},
      idQuadratura: {value: dettaglioTransazione.quadraturaId}
    };
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Pendenze');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Pendenze');
        break;
      case ToolEnum.PRINT_RPT:
        // TODO this.stampaRicevutaPagamentoTelematicaInTxtFile(this.getListaIdElementiSelezionati());
        break;
      case ToolEnum.PRINT_RT:
        // TODO this.stampaRicevutaTelematicaInTxtFile(this.getListaIdElementiSelezionati());
        break;
    }
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]): any[] {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    const iconaGruppoUtenti = new ImmaginePdf();
    iconaGruppoUtenti.indiceColonna = 2;
    iconaGruppoUtenti.srcIcona = 'assets/img/users-solid-pdf-img.png';
    iconaGruppoUtenti.posizioneX = 30;
    iconaGruppoUtenti.posizioneY = 15;
    iconaGruppoUtenti.larghezza = 18;
    iconaGruppoUtenti.altezza = 15;

    return [iconaGruppoUtenti];
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]): any[] {
    return righe.map(riga => {
      const rigaFormattata = riga;
      rigaFormattata.id = riga.id.value;
      rigaFormattata.iuv = riga.iuv.value;
      rigaFormattata.ente = riga.ente.value;
      rigaFormattata.servizio = riga.servizio.value;
      rigaFormattata.pagatore = riga.pagatore.value;
      rigaFormattata.importo = riga.importo.value;
      rigaFormattata.idRendicontazione = riga.idRendicontazione.value;
      rigaFormattata.idQuadratura = riga.idQuadratura;
      return rigaFormattata;
    });
  }

  getNumeroRecord(): string {
    return 'Totale ' + this.tableData.rows.length + ' pendenze';
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  mostraDettaglioPendenza(rigaCliccata: any): void {
    this.mostraDettaglioElemento(this.route.snapshot.url[1].path + '/dettaglioPendenza', rigaCliccata.id.value);
  }

  onClickAnnulla(): void {
    this.router.navigateByUrl(this.route.snapshot.url[0].path);
  }

}
