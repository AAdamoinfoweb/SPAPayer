import {Beneficiario} from "./Beneficiario";
import {Logo} from "./Logo";
import {FlussoRiversamentoPagoPA} from "../servizio/FlussoRiversamentoPagoPA";

export class EnteCompleto {
  id: number;
  societaId: number;
  livelloTerritorialeId: number;
  comune: string;
  provincia: string;
  nomeEnte: string;
  cfPiva: string;
  descrizione: string;
  logo: Logo;
  nomeReferente: string;
  cognomeReferente: string;
  emailReferente: string;
  telefonoReferente: string;
  listaBeneficiari: Beneficiario[];
  flussoRiversamentoPagoPA: FlussoRiversamentoPagoPA;
}
