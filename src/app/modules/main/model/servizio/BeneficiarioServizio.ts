import {FiltroUfficio} from "./FiltroUfficio";
import {ContoCorrente} from "../ente/ContoCorrente";

export class BeneficiarioServizio {
  enteId: number = null;
  societaId: number = null;
  livelloTerritorialeId: number = null;
  ufficio: FiltroUfficio;
  listaContiCorrenti: ContoCorrente[];
}
