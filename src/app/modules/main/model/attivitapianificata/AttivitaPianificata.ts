import {Schedulazione} from "../schedulazione/Schedulazione";
import {ParametroAttivitaPianificata} from "./ParametroAttivitaPianificata";

export class AttivitaPianificata {
  id: number;
  titolo: string;
  descrizione: string;
  abilitato: boolean;
  attivitaPianificataBeanId: number;
  schedulazione: Schedulazione;
  parametri: ParametroAttivitaPianificata[];

  constructor() {
    this.attivitaPianificataBeanId = null;
    this.parametri = [];
    this.schedulazione = new Schedulazione();
  }
}
