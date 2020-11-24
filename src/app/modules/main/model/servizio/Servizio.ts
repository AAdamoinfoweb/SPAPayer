import {FlussiNotifiche} from "./FlussiNotifiche";
import {CampoServizio} from "./CampoServizio";
import {ContoCorrente} from "../ente/ContoCorrente";
import {Contatti} from "./Contatti";
import {LivelloIntegrazioneServizio} from "./LivelloIntegrazioneServizio";
import {BeneficiarioServizio} from "./BeneficiarioServizio";
import {ImpositoreServizio} from "./ImpositoreServizio";

export class Servizio {
  flussiNotifiche: FlussiNotifiche;
  listaCampiServizio: CampoServizio[];
  listaContiCorrenti: ContoCorrente[];
  contatti: Contatti;
  integrazione: LivelloIntegrazioneServizio;
  impositore: ImpositoreServizio;
  beneficiario: BeneficiarioServizio;
  tipologiaServizioId: number;
  raggruppamentoId: number;
  nomeServizio: string;
  abilitaDa: string;
  abilitaA: string;
  flagAttiva: boolean;

}
