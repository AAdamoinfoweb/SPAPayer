import {FlussoRiversamentoPagoPA} from "../servizio/FlussoRiversamentoPagoPA";

export class ContoCorrente {
  id: number;
  iban: string;
  intestazione: string;
  ibanCCPostale: string;
  intestazioneCCPostale: string;
  inizioValidita: string; //date
  fineValidita: string; //date
  flussoRiversamentoPagoPA: FlussoRiversamentoPagoPA = new FlussoRiversamentoPagoPA();
}
