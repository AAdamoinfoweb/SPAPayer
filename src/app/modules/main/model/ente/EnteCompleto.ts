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
   pathLogo: string;
   nomeReferente: string;
   cognomeReferente: string;
   emailReferente: string;
   telefonoReferente: string;
   listaBeneficiari: Beneficiario[];
}
