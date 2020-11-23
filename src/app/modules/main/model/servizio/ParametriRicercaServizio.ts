import {TipologiaServizio} from "../tipologiaServizio/TipologiaServizio";
import {FiltroSelect} from './FiltroSelect';

export class ParametriRicercaServizio {
  raggruppamentoId: number = null;
  nomeServizio: string = null;
  abilitaDa: Date = null;
  abilitaA: Date = null;
  attivo: boolean = false;
  tipologiaServizio: TipologiaServizio | FiltroSelect;
}
