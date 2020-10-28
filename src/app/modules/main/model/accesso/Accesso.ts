import {Funzione} from '../Funzione';

export class Accesso {
  idAccesso: number = null;
  nome: string = null;
  cognome: string = null;
  inizioSessione: Date = null;
  fineSessione: Date = null;
  durata: number = null;
  listaFunzioni: Funzione[] = null;
}
