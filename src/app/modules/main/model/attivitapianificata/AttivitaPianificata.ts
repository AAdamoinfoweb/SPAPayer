import {Schedulazione} from "../schedulazione/Schedulazione";

export class AttivitaPianificata{
  id: number;
  titolo: string;
  descrizione: string;
  abilitato: boolean;
  schedulazione: Schedulazione;
}
