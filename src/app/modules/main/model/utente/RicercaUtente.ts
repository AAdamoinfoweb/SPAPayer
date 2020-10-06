import {Utente} from './Utente';

export class RicercaUtente extends Utente {
  dataFineValidita: Date;
  dataInizioValidita: Date;
  gruppo: string;
  ultimoAccesso: Date;
}
