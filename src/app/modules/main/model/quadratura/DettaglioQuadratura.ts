import {DettaglioTransazione} from '../transazione/DettaglioTransazione';

export class DettaglioQuadratura {
  id: number;
  societaId: number;
  flussoId: number;
  pspId: number;
  listaDettaglioTransazione: DettaglioTransazione[];
}
