import {ControlloLogico} from '../ControlloLogico';
import {TipoCampo} from './TipoCampo';
import {ConfigurazioneCampoDettaglioTransazione} from './ConfigurazioneCampoDettaglioTransazione';
import {ConfigurazioneTipologica} from './ConfigurazioneTipologica';
import {ConfigurazioneJsonPath} from './ConfigurazioneJsonPath';

export class ConfiguratoreCampiNuovoPagamento {
  listaCampiDettaglioTransazione: ConfigurazioneCampoDettaglioTransazione[];
  listaControlliLogici: ControlloLogico[];
  listaTipologiche: ConfigurazioneTipologica[];
  listaJsonPath: ConfigurazioneJsonPath[];
  listaTipiCampo: TipoCampo[];
}
