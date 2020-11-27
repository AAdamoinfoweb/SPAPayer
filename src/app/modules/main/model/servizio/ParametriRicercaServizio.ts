import {TipologiaServizio} from "../tipologiaServizio/TipologiaServizio";
import {FiltroSelect} from './FiltroSelect';

export class ParametriRicercaServizio {
  servizioId: number = null;
  raggruppamentoId: number = null;
  nomeServizio: string = null;
  abilitaDa: string = null;
  abilitaA: string = null;
  attivo: boolean = null;
  tipologiaServizio: TipologiaServizio | FiltroSelect;
  tipologiaServizioId: number = null;
  enteImpositoreId: number = null;
  enteBeneficiarioId: number = null;
  livelloIntegrazioneId: number = null;
}
