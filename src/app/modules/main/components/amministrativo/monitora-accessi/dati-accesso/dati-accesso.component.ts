import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Accesso} from '../../../../model/accesso/Accesso';
import {Utils} from '../../../../../../utils/Utils';
import * as moment from 'moment';
import * as _ from 'lodash';
import {FunzioneService} from '../../../../../../services/funzione.service';

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
  listaFunzioniAbilitate = [];

  listaFunzioni: Array<any> = [];

  constructor(private funzioneService: FunzioneService) { }

  ngOnInit(): void {
    this.letturaFunzioni();
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.accesso) {
      this.codiceFiscale = this.accesso.codiceFiscale;
      this.nominativo = (this.accesso.nome ? this.accesso.nome + ' ' : '') + (this.accesso.cognome || '');
      this.indirizzoIP = this.accesso.indirizzoIP;
      this.inizioSessione = this.getDataSessioneFormattata(this.accesso.inizioSessione);
      this.fineSessione = this.getDataSessioneFormattata(this.accesso.fineSessione);
      this.durataSessione = Utils.getDurataSessioneFormattata(this.accesso.durata);
      this.listaFunzioniAbilitate = this.accesso.listaFunzioni;
    }
  }

  letturaFunzioni() {
    this.listaFunzioni = [];
    this.funzioneService.letturaFunzioni().subscribe(listaFunzioni => {
      listaFunzioni.forEach(funzione => {
        this.listaFunzioni.push({
          value: funzione,
          label: funzione.descrizione,
          checked: false,
          disabled: true
        });
      });
      this.listaFunzioni = _.sortBy(this.listaFunzioni, ['label']);
    });
  }

  getDataSessioneFormattata(dataSessione: Date): string {
    return dataSessione ? moment(dataSessione).format('DD/MM/YYYY HH:mm:ss') : null;
  }

  isChecked(funzione: any): boolean {
    let esito = false;
    this.listaFunzioniAbilitate.forEach(funzioneAbilitata => {
      if (funzione.value.descrizione === funzioneAbilitata.descrizione) {
        esito = true;
      }
    });
    return esito;
  }
}
