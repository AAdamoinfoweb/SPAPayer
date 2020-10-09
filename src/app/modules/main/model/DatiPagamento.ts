import {date} from "fp-ts";

export class DatiPagamento {
  dettaglioTransazioneId: number;
  annoDocumento: string;
  numeroDocumento: string;
  nomeServizio: string;
  nomeEnte: string;
  dataScadenza: Date;
  importo: number;
  dataPagamento: Date;
  esitoPagamento: string;
  statoPagamento: string;
  codiceAvviso: string;
  causale: string;
}
