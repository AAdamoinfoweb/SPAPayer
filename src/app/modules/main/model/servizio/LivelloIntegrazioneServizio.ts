export class LivelloIntegrazioneServizio {
  livelloIntegrazioneId: number = null;

  codiceEnte: number;
  tipoUfficio: string;
  codiceUfficio: string;
  codiceIdServizio: number = null;
  numeroTentativiNotifica = 0;
  notificaUtente = false;
  redirect: boolean;

  urlWebServiceBackoffice: string;
  portaleEsternoId: number;
}
