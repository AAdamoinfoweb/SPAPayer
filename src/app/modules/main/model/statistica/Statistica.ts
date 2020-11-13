import {Schedulazione} from './Schedulazione';
import {Destinatario} from './Destinatario';

export class Statistica {
  titolo: string;
  querySql: string;
  descrizione: string;
  destinatari: Destinatario[];
  schedulazione: Schedulazione;
  schedulazioneExtra: any;
  festivita: any;

  constructor() {
    this.destinatari = [];
    this.schedulazione = new Schedulazione();
  }
}
