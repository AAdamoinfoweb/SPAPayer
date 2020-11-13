import {ControlloLogico} from './ControlloLogico';
import {OpzioneSelect} from './OpzioneSelect';

interface DipendeDa {
  id: number;
  titolo: string;
}

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
  controlloLogicoId: number;
  campoInput: boolean;

  jsonPath: string;
  tipologica: string;
  campoDettaglioTransazione: string;
  dipendeDa: any;
  tipoCampoId: number;
  tipologiaServizioId: number;

  opzioni: Array<OpzioneSelect>;
}
