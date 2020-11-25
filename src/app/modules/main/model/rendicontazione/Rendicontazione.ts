import {TransazioneFlusso} from '../transazione/TransazioneFlusso';

export class Rendicontazione {
  id: number;
  societa: string;
  ente: string;
  servizio: string;
  listaTransazioniFlusso: TransazioneFlusso[];
}
