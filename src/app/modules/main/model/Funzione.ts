import {GruppoEnum} from '../../../enums/gruppo.enum';

export class Funzione {
  id: number;
  nome: string;
  descrizione: string;
  applicabileAServizio: number;
  menuId: number;
  gruppo: GruppoEnum;
}
