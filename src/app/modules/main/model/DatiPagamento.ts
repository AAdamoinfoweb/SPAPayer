import {date} from "fp-ts";

export class DatiPagamento {
  dettaglioTransazioneId: number;
  annoDocumento: number;
  numeroDocumento: string;
  nomeServizio: string;
  servizioId: number;
  nomeEnte: string;
  enteId: number;
  dataScadenza: Date;
  importo: number;
  dataPagamento: Date;
  esitoPagamento: string;
  statoPagamento: string;
  codiceAvviso: string;
  causale: string;
  flagCarrello: boolean;
}
