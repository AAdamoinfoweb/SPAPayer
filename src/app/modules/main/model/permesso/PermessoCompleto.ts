import {PermessoFunzione} from './PermessoFunzione';

export class PermessoCompleto {
  societaId?: number;
  enteId?: number;
  servizioId?: number;
  dataInizioValidita?: string;
  dataFineValidita?: string;
  listaFunzioni?: PermessoFunzione[];
}
