import {TipologiaServizio} from "../tipologiaServizio/TipologiaServizio";

export class ParametriRicercaServizio {
  raggruppamentoId: number = null;
  nomeServizio: string = null;
  abilitaDa: Date = null;
  abilitaA: Date = null;
  attivo: boolean = false;
  tipologiaServizio: TipologiaServizio;
}
