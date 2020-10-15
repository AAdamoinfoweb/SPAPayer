import {PermessoFunzione} from './PermessoFunzione';

export class PermessoCompleto {
  societaId: number;
  enteId: number;
  servizioId: number;
  dataInizioValidita: moment.Moment;
  dataFineValidita: moment.Moment;
  listaFunzioni: PermessoFunzione[];
}
