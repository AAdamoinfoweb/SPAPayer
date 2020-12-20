export class ConfiguraPortaleEsterno {
  codice: string;
  descrizione?: string;
  idTipoPortale: number;
  tipoPortale: string;
  encryptIV?: string;
  encryptKey: string;
  tempoValiditaMessaggio?: number;
  waitingPagePayer?: boolean;
}
