export enum StatoTransazioneEnum {
  CREATA,
  PENDING,
  COMPLETATA_CON_SUCCESSO,
  FALLITA
}

export function getStatoTransazioneValue(key: StatoTransazioneEnum): string {
  let value = null;
  switch (key) {
    case StatoTransazioneEnum.CREATA:
      value = 'CREATA';
      break;
    case StatoTransazioneEnum.PENDING:
      value = 'PENDING';
      break;
    case StatoTransazioneEnum.COMPLETATA_CON_SUCCESSO:
      value = 'COMPLETATA CON SUCCESSO';
      break;
    case StatoTransazioneEnum.FALLITA:
      value = 'FALLITA';
      break;
  }
  return value;
}
