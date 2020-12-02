import {Schedulazione} from "../schedulazione/Schedulazione";
import {ParametroAttivitaPianificata} from "./ParametroAttivitaPianificata";

export class AttivitaPianificata {
  id: number;
  titolo: string;
  descrizione: string;
  abilitato: boolean;
  bean: string;
  schedulazione: Schedulazione;
  parametri: ParametroAttivitaPianificata[];

  constructor() {
    this.parametri = [];
    this.schedulazione = new Schedulazione();
  }
}
