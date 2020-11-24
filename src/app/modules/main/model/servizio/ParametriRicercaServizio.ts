import {TipologiaServizio} from "../tipologiaServizio/TipologiaServizio";
import {FiltroSelect} from './FiltroSelect';

export class ParametriRicercaServizio {
  raggruppamentoId: number = null;
  nomeServizio: string = null;
  abilitaDa: string = null;
  abilitaA: string = null;
  attivo: boolean = false;
  tipologiaServizio: TipologiaServizio | FiltroSelect;
  tipologiaServizioId: number;
}
