import {ContoCorrente} from "./ContoCorrente";

export class Beneficiario {
  id: number;
  servizioId: number;
  enteId: number;
  descrizione: string;
  codiceEnte: string;
  tipoUfficio: string;
  codiceUfficio: string;
  listaContiCorrenti: ContoCorrente[];
}
