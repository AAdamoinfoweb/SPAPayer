export class CampoTipologiaServizio {
  id: number;
  titolo: string;
  tipologiaServizioId: number;
  obbligatorio: boolean;
  tipoCampoId: number;
  lunghezzaVariabile: boolean;
  lunghezza: number;
  campoFisso: boolean;
  disabilitato: boolean;
  posizione: number;
  chiave: boolean;
  campoInput: boolean;
  jsonPath: string;
  tipologica: string;
  dipendeDa: DipendeDa;
  controlloLogicoId: string;
  campoDettaglioTransazione: string;
}

interface DipendeDa {
  id: number;
  titolo: string;
}
