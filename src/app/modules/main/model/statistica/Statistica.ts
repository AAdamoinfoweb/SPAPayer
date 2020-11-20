import {Schedulazione} from '../schedulazione/Schedulazione';
import {Destinatario} from './Destinatario';

export class Statistica {
  id: number;
  titolo: string;
  query: string;
  descrizione: string;
  abilitato: boolean;
  destinatari: Destinatario[];
  schedulazione: Schedulazione;

  constructor() {
    this.destinatari = [];
    this.schedulazione = new Schedulazione();
  }
}
