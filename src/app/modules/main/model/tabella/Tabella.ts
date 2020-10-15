import {Colonna} from './Colonna';
import {tipoTabella} from '../../../../enums/TipoTabella.enum';

export class Tabella {
  rows: any[];
  cols: Colonna[];
  dataKey: string;
  tipoTabella: tipoTabella;
}
