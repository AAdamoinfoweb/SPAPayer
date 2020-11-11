import {Beneficiario} from "./Beneficiario";
import {Logo} from "./Logo";

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
}
