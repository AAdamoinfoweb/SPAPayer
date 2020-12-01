import {FiltroUfficio} from "./FiltroUfficio";

export class LivelloIntegrazioneServizio {
  livelloIntegrazioneId: number = null;

  ufficio: FiltroUfficio = new FiltroUfficio();

  codiceIdServizio: number = null;
  numeroTentativiNotifica = 0;
  notificaUtente = false;
  redirect: boolean;

  urlWebServiceBackoffice: string;
  portaleEsternoId: number;
}
