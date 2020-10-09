import {Component, OnInit} from '@angular/core';
import {tool} from '../../../../enums/Tool.enum';
import {tipoColonna} from '../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';
import {Utils} from '../../../../utils/Utils';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {DatiPagamento} from '../../model/DatiPagamento';
import {map} from 'rxjs/operators';
import {IMieiPagamentiService} from '../../../../services/i-miei-pagamenti.service';
import {ParametriRicercaPagamenti} from '../../model/utente/ParametriRicercaPagamenti';
import {TipoPagamentoEnum} from '../../../../enums/tipoPagamento.enum';
import {EsitoEnum} from '../../../../enums/esito.enum';
import {StatoPagamentoEnum} from '../../../../enums/statoPagamento.enum';
import * as moment from "moment";

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

  // breadcrumb
  breadcrumbList = [];


  // tabs
  tabs = [{value: TipoPagamentoEnum.TUTTI},
    {value: TipoPagamentoEnum.IN_ATTESA},
    {value: TipoPagamentoEnum.PAGATI}];

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
    dataKey: 'numero',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  tempTableData;
  private listaPagamenti: DatiPagamento[];


  constructor(private iMieiPagamentiService: IMieiPagamentiService) {
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
  eseguiAzioni(azioneTool) {
    if (azioneTool.value === tool.INSERT.value) {
      // inserisci utente
    } else if (azioneTool.value === tool.UPDATE.value) {
      // aggiorna utente
    } else if (azioneTool.value === tool.EXPORT_PDF.value) {
      // esporta in pdf
    } else if (azioneTool.value === tool.EXPORT_XLS.value) {
      // esporta in excel
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
        dataPagamento: pagamento.dataPagamento ? moment(pagamento.dataPagamento).format('DD/MM/YYYY') : null,
      };
      return row;
    });
    this.tableData.rows = pagamenti;
    // oggetto contenente le rows recuperate dalla ricerca
    this.tempTableData.rows = Object.assign({}, this.tableData.rows);
  }
}
