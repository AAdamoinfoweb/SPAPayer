import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DettaglioPendenza} from '../../../../../../../model/transazione/DettaglioPendenza';

@Component({
  selector: 'app-dati-pendenza',
  templateUrl: './dati-pendenza.component.html',
  styleUrls: ['./dati-pendenza.component.scss']
})
export class DatiPendenzaComponent implements OnInit, OnChanges {

  @Input() datiPendenza: DettaglioPendenza;

  id = null;
  enteImpositore = null;
  servizioNome = null;
  enteBeneficiario = null;
  numeroDocumento = null;
  annoDocumento = null;
  causale = null;
  importo = null;
  listaCampoDettaglioTransazioni = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiPendenza) {
      this.id = this.datiPendenza.id;
      this.enteImpositore = this.datiPendenza.enteImpositore;
      this.servizioNome = this.datiPendenza.servizioNome;
      this.enteBeneficiario = this.datiPendenza.enteBeneficiario;
      this.numeroDocumento = this.datiPendenza.numeroDocumento;
      this.annoDocumento = this.datiPendenza.annoDocumento;
      this.causale = this.datiPendenza.causale;
      this.importo = this.datiPendenza.importo;
      this.listaCampoDettaglioTransazioni = this.datiPendenza.listaCampoDettaglioTransazioni;
    }
    window.scrollTo(0, 0);
  }

}
