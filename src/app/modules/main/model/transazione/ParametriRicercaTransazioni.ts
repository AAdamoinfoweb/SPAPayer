export class ParametriRicercaTransazioni {
  societaId: number;
  livelloTerritorialeId: number;
  enteId: number;
  servizioId: number;
  transazioneId: number;
  versanteIndirizzoIP: string;
  tipologiaServizioId: number;
  canaleId: number;
  iuv: string;
  emailNotifica: string;
  dataTransazioneDa: string;
  dataTransazioneA: string;
  statoTransazione: number;
  importoTransazioneDa: number;
  importoTransazioneA: number;
  pagatore: string;
  flussoQuadratura: number;
  flussoRendicontazione: number;

  constructor() {
    this.societaId = null;
    this.livelloTerritorialeId = null;
    this.enteId = null;
    this.tipologiaServizioId = null;
    this.servizioId = null;
    this.transazioneId = null;
    this.canaleId = null;
    this.versanteIndirizzoIP = null;
    this.statoTransazione = null;
  }

}
