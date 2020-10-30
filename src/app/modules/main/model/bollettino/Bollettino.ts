import {CampoDettaglioTransazione} from './CampoDettaglioTransazione';

export class Bollettino {
  servizioId: number;
  servizio: string;
  enteId: number;
  anagraficaPagatore: string;
  ente: string;
  cfpiva: string;
  importo: number;
  numero: string;
  anno: number;
  causale: string;
  iuv: string;
  listaCampoDettaglioTransazione: CampoDettaglioTransazione[];
}
