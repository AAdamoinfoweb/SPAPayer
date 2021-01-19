import {FlussiNotifiche} from "./FlussiNotifiche";
import {CampoServizio} from "./CampoServizio";
import {Contatti} from "./Contatti";
import {LivelloIntegrazioneServizio} from "./LivelloIntegrazioneServizio";
import {BeneficiarioServizio} from "./BeneficiarioServizio";
import {ImpositoreServizio} from "./ImpositoreServizio";

export class Servizio {

  id: number;

  flagPresenzaDettaglioTransazione: boolean;
  flagPresenzaRendicontazione: boolean;
  flagPresenzaDatiBonifico: boolean;
  flagPresenzaQuadraturaPagoPA: boolean;

  flussiNotifiche: FlussiNotifiche;
  listaCampiServizio: CampoServizio[];
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
