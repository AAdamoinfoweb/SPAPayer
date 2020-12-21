import {TipoPortaleEsterno} from './TipoPortaleEsterno';

export class ConfiguraPortaleEsterno {
  codice: string;
  descrizione?: string;
  tipoPortaleEsterno: TipoPortaleEsterno;
  encryptIV?: string;
  encryptKey: string;
  tempoValiditaMessaggio?: number;
  waitingPagePayer?: boolean;
}
