export class CampoTipologiaServizio {
  uuid: string;
  id: number;
  titolo: string;
  tipologiaServizioId: number;
  obbligatorio: boolean = false;
  tipoCampoId: number;
  lunghezzaVariabile: boolean = false;
  lunghezza: number;
  campoFisso: boolean = false;
  disabilitato: boolean = false;
  posizione: number;
  chiave: boolean = false;
  campoInput: boolean = false;
  tipologica: string;
  dipendeDa: DipendeDa;
  controlloLogicoId: string;
  campoDettaglioTransazione: string;
}

interface DipendeDa {
  id: number;
  titolo: string;
}
