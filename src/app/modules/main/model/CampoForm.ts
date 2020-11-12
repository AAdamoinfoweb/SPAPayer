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
  controllo_logico_id: number;
  campo_input: boolean;

  dipendeDaInput: string;

  jsonPath: string;
  tipologica: string;
  campoDettaglioTransazione: string;
  dipendeDa: number;
  tipo_campo_id: number;
  tipologia_servizio_id: number;

  opzioni: Array<OpzioneSelect>;
}
