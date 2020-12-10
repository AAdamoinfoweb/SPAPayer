import {DettaglioTransazione} from '../transazione/DettaglioTransazione';

export class DettaglioQuadratura {
  id: number;
  societaId: number;
  flussoId: string;
  pspId: number;
  listaDettaglioTransazione: DettaglioTransazione[];
}
