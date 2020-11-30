import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ParametriRicercaTransazioni} from '../../../../../model/transazione/ParametriRicercaTransazioni';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../../utils/Utils';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {GestisciPortaleService} from '../../../../../../../services/gestisci-portale.service';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import {StatoTransazioneEnum} from '../../../../../../../enums/statoTransazione.enum';
import {BottoneEnum} from '../../../../../../../enums/bottone.enum';

@Component({
  selector: 'app-filtro-monitoraggio-transazioni',
  templateUrl: './filtro-monitoraggio-transazioni.component.html',
  styleUrls: ['./filtro-monitoraggio-transazioni.component.scss']
})
export class FiltroMonitoraggioTransazioniComponent extends FiltroGestioneElementiComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private gestisciPortaleService: GestisciPortaleService,
              private campoTipologiaServizioService: CampoTipologiaServizioService) {
    super(activatedRoute, amministrativoService);
  }

  @Input() flussoRendicontazione = null;

  @Output()
  onChangeFiltri: EventEmitter<any> = new EventEmitter<any>();

  filtroRicercaTransazioni: ParametriRicercaTransazioni;

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  // opzioni per select
  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriale: OpzioneSelect[] = [];
  opzioniFiltroEnte: OpzioneSelect[] = [];
  opzioniFiltroTipologiaServizio: OpzioneSelect[] = [];
  opzioniFiltroServizio: OpzioneSelect[] = [];
  opzioniFiltroIdentificativoTransazione: OpzioneSelect[] = [];
  opzioniFiltroCanale: OpzioneSelect[] = [];
  opzioniFiltroVersanteIndirizzoIP: OpzioneSelect[] = [];
  opzioniFiltroStatoTransazione: OpzioneSelect[] = [];

  ngOnInit(): void {
    this.filtroRicercaTransazioni = new ParametriRicercaTransazioni();
    if (this.flussoRendicontazione) {
      this.filtroRicercaTransazioni.flussoRendicontazione = this.flussoRendicontazione;
      const parametriRicercaTransazioni = new ParametriRicercaTransazioni();
      parametriRicercaTransazioni.flussoRendicontazione = this.flussoRendicontazione;
      this.onChangeFiltri.emit(parametriRicercaTransazioni);
    }

    this.recuperaFiltroSocieta();
    this.recuperaFiltroLivelloTerritoriale();
    this.recuperaFiltroEnte();
    this.recuperaFiltroTipologiaServizio();
    this.recuperaFiltroServizio();
    this.recuperaFiltroIdentificativoTransazione();
    this.recuperaFiltroCanale();
    this.recuperaFiltroVersanteIndirizzoIP();
    this.recuperaFiltroStatoTransazione();
  }

  recuperaFiltroSocieta(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroSocieta(this.idFunzione).pipe(map(listaSocieta => {
      listaSocieta.forEach(societa => {
        this.opzioniFiltroSocieta.push({
          value: societa.id,
          label: societa.nome
        });
      });
      this.opzioniFiltroSocieta = _.sortBy(this.opzioniFiltroSocieta, ['label']);
    })).subscribe();
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroLivelloTerritoriale(this.idFunzione).pipe(map(listaLivelloTerritoriale => {
      listaLivelloTerritoriale.forEach(livelloTerritoriale => {
        this.opzioniFiltroLivelliTerritoriale.push({
          value: livelloTerritoriale.id,
          label: livelloTerritoriale.nome
        });
      });
      this.opzioniFiltroLivelliTerritoriale = _.sortBy(this.opzioniFiltroLivelliTerritoriale, ['label']);
    })).subscribe();
  }

  recuperaFiltroEnte(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroEnte(this.idFunzione).pipe(map(listaEnte => {
      listaEnte.forEach(ente => {
        this.opzioniFiltroEnte.push({
          value: ente.id,
          label: ente.nome
        });
      });
      this.opzioniFiltroEnte = _.sortBy(this.opzioniFiltroEnte, ['label']);
    })).subscribe();
  }

  recuperaFiltroTipologiaServizio(): void {
    this.campoTipologiaServizioService.recuperaTipologieServizio(null, this.idFunzione).pipe(map(listaTipologiaServizio => {
      listaTipologiaServizio.forEach(tipologiaServizio => {
        this.opzioniFiltroTipologiaServizio.push({
          value: tipologiaServizio.id,
          label: tipologiaServizio.descrizione
        });
      });
      this.opzioniFiltroTipologiaServizio = _.sortBy(this.opzioniFiltroTipologiaServizio, ['label']);
    })).subscribe();
  }

  recuperaFiltroServizio(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroServizio(this.idFunzione).pipe(map(listaServizio => {
      listaServizio.forEach(servizio => {
        this.opzioniFiltroServizio.push({
          value: servizio.id,
          label: servizio.nome
        });
      });
      this.opzioniFiltroServizio = _.sortBy(this.opzioniFiltroServizio, ['label']);
    })).subscribe();
  }

  recuperaFiltroIdentificativoTransazione(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroTransazione(this.idFunzione).pipe(map(listaTransazioneId => {
      listaTransazioneId.forEach(transazioneId => {
        this.opzioniFiltroIdentificativoTransazione.push({
          value: transazioneId.id,
          label: transazioneId.id.toString()
        });
      });
      this.opzioniFiltroIdentificativoTransazione = _.sortBy(this.opzioniFiltroIdentificativoTransazione, ['label']);
    })).subscribe();
  }

  recuperaFiltroCanale(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroCanale(this.idFunzione).pipe(map(listaCanale => {
      listaCanale.forEach(canale => {
        this.opzioniFiltroCanale.push({
          value: canale.id,
          label: canale.nome
        });
      });
      this.opzioniFiltroCanale = _.sortBy(this.opzioniFiltroCanale, ['label']);
    })).subscribe();
  }

  recuperaFiltroVersanteIndirizzoIP(): void {
    this.gestisciPortaleService.gestisciPortaleFiltroVersante(this.idFunzione).pipe(map(listaVersanti => {
      listaVersanti.forEach(versante => {
        this.opzioniFiltroVersanteIndirizzoIP.push({
          value: versante.indirizzoIp,
          label: versante.indirizzoIp
        });
      });
    })).subscribe();
  }

  recuperaFiltroStatoTransazione(): void {
    const statoTransazioneEnum = StatoTransazioneEnum;
    const keys = Object.keys(statoTransazioneEnum).filter(k => typeof statoTransazioneEnum[k as any] === 'number');
    keys.forEach((key, index) => {
      this.opzioniFiltroStatoTransazione.push({
        value: index,
        label: key.replace(/_/g, ' ')
      });
    });
  }

  cercaElementi(): void {
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  private formattaFiltri() {
    const filtri: ParametriRicercaTransazioni = JSON.parse(JSON.stringify(this.filtroRicercaTransazioni));
    filtri.dataTransazioneDa = filtri.dataTransazioneDa ?
      moment(filtri.dataTransazioneDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtri.dataTransazioneA = filtri.dataTransazioneA ?
      moment(filtri.dataTransazioneA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    return filtri;
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    const filtri = this.formattaFiltri();
    this.onChangeFiltri.emit(filtri);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (campo.control?.errors?.required) {
      return 'Il campo è obbligatorio';
    } else {
      return 'Campo non valido';
    }
  }

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroForm.value).some(key => filtroForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroForm.valid;
    }
  }

}
