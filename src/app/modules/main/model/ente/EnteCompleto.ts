import {Beneficiario} from "./Beneficiario";

export class EnteCompleto {
   id: number;
   societaId: number;
   livelloTerritorialeId: number;
   comune: string;
   provincia: string;
   nomeEnte: string;
   cfPiva: string;
   descrizione: string;
   logo: string;
   nomeReferente: string;
   cognomeReferente: string;
   emailReferente: string;
   telefonoReferente: string;
   listaBeneficiari: Beneficiario[];
}
