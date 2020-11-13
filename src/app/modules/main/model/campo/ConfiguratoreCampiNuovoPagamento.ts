import {ControlloLogico} from '../ControlloLogico';
import {TipoCampo} from './TipoCampo';

export class ConfiguratoreCampiNuovoPagamento {
  listaCampiDettaglioTransazione: ConfigurazioneCampoDettaglioTransazione[];
  listaControlliLogici: ControlloLogico[];
  listaTipologiche: ConfigurazioneTipologica[];
  listaJsonPath: ConfigurazioneJsonPath[];
  listaTipiCampo: TipoCampo[];
}

// todo definire le classi innestate del configuratore

export class ConfigurazioneCampoDettaglioTransazione {

}

export class ConfigurazioneTipologica {

}

export class ConfigurazioneJsonPath {

}
