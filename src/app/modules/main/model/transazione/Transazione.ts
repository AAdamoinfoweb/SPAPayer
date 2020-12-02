import {DettaglioTransazione} from './DettaglioTransazione';

export class Transazione {
  id: number;
  integrazioneId: number;
  integrazioneNome: string;
  stato: string;
  data: string;
  versanteCodiceFiscale: string;
  versanteIndirizzoIP: string;
  versanteEmail: string;
  listaDettaglioTransazione: DettaglioTransazione[];
}
