import {CampoDettaglioTransazione} from '../bollettino/CampoDettaglioTransazione';

export class DettaglioPendenza {
  id: number;
  livelloIntegrazioneId: number;
  enteImpositore: string;
  servizioNome: string;
  enteBeneficiario: string;
  numeroDocumento: string;
  annoDocumento: number;
  causale: string;
  importo: number;
  listaCampoDettaglioTransazioni: CampoDettaglioTransazione[];
}
