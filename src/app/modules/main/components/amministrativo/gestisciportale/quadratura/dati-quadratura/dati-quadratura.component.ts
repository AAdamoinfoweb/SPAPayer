import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DettaglioQuadratura} from '../../../../../model/quadratura/DettaglioQuadratura';
import {Tabella} from '../../../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../../../enums/TipoTabella.enum';
import {DettaglioTransazione} from '../../../../../model/transazione/DettaglioTransazione';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-dati-quadratura',
  templateUrl: './dati-quadratura.component.html',
  styleUrls: ['./dati-quadratura.component.scss']
})
export class DatiQuadraturaComponent implements OnInit, OnChanges {

  @Input() datiQuadratura: DettaglioQuadratura;

  societaId = null;
  flussoId = null;
  pspId = null;
  listaDettaglioTransazione = null;

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'dataTransazione', header: 'Data transazione', type: tipoColonna.TESTO},
      {field: 'iuv', header: 'IUV', type: tipoColonna.TESTO},
      {field: 'pagatore', header: 'Pagatore (Cod. fiscale)', type: tipoColonna.TESTO},
      {field: 'importo', header: 'Importo', type: tipoColonna.IMPORTO},
      {field: 'stato', header: 'Stato', type: tipoColonna.TESTO},
      {field: 'allarme', header: '', type: tipoColonna.ICONA}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.TEMPLATING
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.datiQuadratura) {
      this.societaId = this.datiQuadratura.societaId;
      this.flussoId = this.datiQuadratura.flussoId;
      this.pspId = this.datiQuadratura.pspId;
      this.listaDettaglioTransazione = this.datiQuadratura.listaDettaglioTransazione;
      this.impostaTabella(this.listaDettaglioTransazione);
    }
    window.scrollTo(0, 0);
  }

  impostaTabella(listaDettaglioTransazione: DettaglioTransazione[]): void {
    this.tableData.rows = [];
    if (listaDettaglioTransazione) {
      listaDettaglioTransazione.forEach(elemento => {
        this.tableData.rows.push(this.creaRigaTabella(elemento));
      });
    }
  }

  creaRigaTabella(dettaglioTransazione: DettaglioTransazione) {
    return {
      dataTransazione: {value: dettaglioTransazione.dataTransazione
          ? moment(dettaglioTransazione.dataTransazione).format(Utils.FORMAT_DATE_CALENDAR) : null},
      iuv: {value: dettaglioTransazione.iuv},
      pagatore: {value: dettaglioTransazione.pagatoreCodiceFiscale},
      importo: {value: dettaglioTransazione.importo},
      stato: {value: dettaglioTransazione.stato},
      allarme: Utils.creaIcona('assets/img/exclamation-triangle-solid.svg#alert-icon', '#B06202', 'prova', 'inline'),  // TODO aggiungere tooltip motivo icona allarme
      id: {value: dettaglioTransazione.dettaglioTransazioneId}
    };
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' dettagli transazione';
  }

  redirectToMonitoraggioTransazioni(): void {
    const quadraturaId = parseInt(this.activatedRoute.snapshot.paramMap.get('quadraturaId'));
    const urlMonitoraggioTransazione = '/monitoraggioTransazioni?flussoQuadratura=' + quadraturaId;
    this.router.navigateByUrl(urlMonitoraggioTransazione);
  }

}
