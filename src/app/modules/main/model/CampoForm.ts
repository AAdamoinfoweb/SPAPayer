import {ControlloLogico} from './ControlloLogico';
import {OpzioneSelect} from './OpzioneSelect';
export class CampoForm {
  id: number;
  titolo: string;
  obbligatorio: boolean;
  tipoCampo: string;
  informazioni: string;
  lunghezzaVariabile: boolean;
  lunghezza: number;
  campoFisso: boolean;
  disabilitato: boolean;
  posizione: number;
  chiave: boolean;
  controllo_logico: ControlloLogico;
  campoInput: boolean;
  jsonPath: string;
  tipologica: string;
  campoDettaglioTransazione: string;
  dipendeDa: number;
  opzioni: Array<OpzioneSelect>;
}
