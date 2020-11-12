import {ContoCorrente} from "./ContoCorrente";

export class Beneficiario {
  id: number;
  nomeServizio: string;
  enteId: number;
  descrizione: string;
  codiceEnte: string;
  tipoUfficio: string;
  codiceUfficio: string;
  listaContiCorrenti: ContoCorrente[];
}
