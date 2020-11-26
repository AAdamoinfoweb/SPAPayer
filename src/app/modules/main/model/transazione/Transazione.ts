import {DettaglioTransazione} from './DettaglioTransazione';

export class Transazione {
  id: number;
  integrazione: string;
  stato: string;
  data: string;
  versanteCodiceFiscale: string;
  versanteIndirizzoIP: string;
  versanteEmail: string;
  listaDettaglioTransazione: DettaglioTransazione[];
}
