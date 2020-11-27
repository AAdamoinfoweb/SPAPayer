import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Transazione} from '../../../../../../model/transazione/Transazione';
import {Utils} from '../../../../../../../../utils/Utils';
import * as moment from 'moment';
import {ECalendarValue} from 'ng2-date-picker';
import {LivelloIntegrazioneEnum} from '../../../../../../../../enums/livelloIntegrazione.enum';

@Component({
  selector: 'app-dati-transazione',
  templateUrl: './dati-transazione.component.html',
  styleUrls: ['./dati-transazione.component.scss']
})
export class DatiTransazioneComponent implements OnInit, OnChanges {

  @Input() datiTransazione: Transazione;

  tipoData: ECalendarValue.String;
  readonly livelloIntegrazioneEnum = LivelloIntegrazioneEnum;

  id = null;
  integrazioneId = null;
  integrazioneNome = null;
  stato = null;
  data = null;
  versanteCodiceFiscale = null;
  versanteIndirizzoIP = null;
  versanteEmail = null;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiTransazione) {
      this.id = this.datiTransazione.id;
      this.integrazioneId = this.datiTransazione.integrazioneId;
      this.integrazioneNome = this.datiTransazione.integrazioneNome;
      this.stato = this.datiTransazione.stato;
      this.data = this.datiTransazione.data ? moment(this.datiTransazione.data).format(Utils.FORMAT_DATE_CALENDAR) : null;
      this.versanteCodiceFiscale = this.datiTransazione.versanteCodiceFiscale;
      this.versanteIndirizzoIP = this.datiTransazione.versanteIndirizzoIP;
      this.versanteEmail = this.datiTransazione.versanteEmail;
    }
    window.scrollTo(0, 0);
  }

}
