export class DatiPagamento {
  dettaglioTransazioneId: number;
  annoDocumento: number;
  numeroDocumento: string;
  nomeServizio: string;
  servizioId: number;
  nomeEnte: string;
  enteId: number;
  dataScadenza: string;
  importo: number;
  dataPagamento: string;
  esitoPagamento: string;
  statoPagamento: string;
  codiceAvviso: string;
  causale: string;
  flagCarrello: boolean;
  anagraficaPagatore: string;
  livelloIntegrazione: number;
}
