import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Accesso} from '../../../../model/accesso/Accesso';
import {Utils} from '../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-accesso',
  templateUrl: './dati-accesso.component.html',
  styleUrls: ['./dati-accesso.component.scss']
})
export class DatiAccessoComponent implements OnInit, OnChanges {

  @Input()
  accesso: Accesso;

  codiceFiscale = null;
  nominativo = null;
  indirizzoIP = null;
  inizioSessione = null;
  fineSessione = null;
  durataSessione = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.accesso) {
      this.codiceFiscale = null; // TODO capire da dove leggere codice fiscale
      this.nominativo = (this.accesso.nome ? this.accesso.nome + ' ' : '') + (this.accesso.cognome || '');
      this.indirizzoIP = null; // TODO capire da dove leggere indirizzo IP
      this.inizioSessione = this.accesso.inizioSessione;
      this.fineSessione = this.accesso.fineSessione;
      this.durataSessione = Utils.getDurataSessioneFormattata(this.accesso.durata);
    }
  }
}
