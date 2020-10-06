import {CampoDettaglioTransazione} from './CampoDettaglioTransazione';

export class Bollettino {
  servizioId: number;
  enteId: number;
  cfpiva: string;
  importo: number;
  numero: string;
  anno: number;
  causale: string;
  iuv: string;
  listaCampoDettaglioTransazione: CampoDettaglioTransazione[];
}
