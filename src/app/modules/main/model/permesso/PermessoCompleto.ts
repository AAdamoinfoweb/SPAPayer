import {PermessoFunzione} from './PermessoFunzione';

export class PermessoCompleto {
  societaId?: number;
  enteId?: number | string;
  servizioId?: number;
  dataInizioValidita?: string;
  dataFineValidita?: string;
  listaFunzioni?: PermessoFunzione[];
}
