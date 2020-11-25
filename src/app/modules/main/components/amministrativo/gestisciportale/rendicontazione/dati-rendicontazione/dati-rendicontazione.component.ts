import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Rendicontazione} from '../../../../../model/rendicontazione/Rendicontazione';

@Component({
  selector: 'app-dati-rendicontazione',
  templateUrl: './dati-rendicontazione.component.html',
  styleUrls: ['./dati-rendicontazione.component.scss']
})
export class DatiRendicontazioneComponent implements OnInit, OnChanges{

  @Input() datiRendicontazione: Rendicontazione;

  id = null;
  societa = null;
  ente = null;
  servizio = null;
  listaTransazioniFlusso = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiRendicontazione) {
      this.id = this.datiRendicontazione.id;
      this.societa = this.datiRendicontazione.societa;
      this.ente = this.datiRendicontazione.ente;
      this.servizio = this.datiRendicontazione.servizio;
      this.listaTransazioniFlusso = this.datiRendicontazione.listaTransazioniFlusso;
    }
  }

}
