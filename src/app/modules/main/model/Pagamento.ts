export class Pagamento {
  emissione: Date;
  numDocumento: string;
  descrizione: string;
  ente: string;
  scadenza: Date;
  importo: number;


  constructor(emissione: Date, numDocumento: string, descrizione: string, ente: string, scadenza: Date, importo: number) {
    this.emissione = emissione;
    this.numDocumento = numDocumento;
    this.descrizione = descrizione;
    this.ente = ente;
    this.scadenza = scadenza;
    this.importo = importo;
  }
}
