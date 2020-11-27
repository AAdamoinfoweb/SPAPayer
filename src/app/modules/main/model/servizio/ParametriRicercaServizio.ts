import {TipologiaServizio} from "../tipologiaServizio/TipologiaServizio";
import {FiltroSelect} from './FiltroSelect';

export class ParametriRicercaServizio {
  servizioId: number = null;
  raggruppamentoId: number = null;
  nomeServizio: string = null;
  abilitaDa: string = null;
  abilitaA: string = null;
  attivo: boolean = false;
  tipologiaServizio: TipologiaServizio | FiltroSelect;
  tipologiaServizioId: number;
  enteImpositoreId: number;
  enteBeneficiarioId: number;
  livelloIntegrazioneId: number;
}
