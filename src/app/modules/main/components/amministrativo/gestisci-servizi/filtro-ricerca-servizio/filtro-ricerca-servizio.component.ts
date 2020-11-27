import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, NgForm, ValidatorFn} from '@angular/forms';
import {ParametriRicercaServizio} from '../../../../model/servizio/ParametriRicercaServizio';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {ConfiguraServizioService} from '../../../../../../services/configura-servizio.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-filtro-ricerca-servizio',
  templateUrl: './filtro-ricerca-servizio.component.html',
  styleUrls: ['./filtro-ricerca-servizio.component.scss']
})
export class FiltroRicercaServizioComponent extends FiltroGestioneElementiComponent implements OnInit {

  listaCodiciTipologia = [];
  listaCodiciTipologiaFiltrati = [];
  labelOggettoTipologia: string;

  isCalendarOpen = false;
  readonly minDateDDMMYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  filtriRicerca: ParametriRicercaServizio = new ParametriRicercaServizio();
  opzioniRaggruppamento: OpzioneSelect[] = [];

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaServizio> = new EventEmitter<ParametriRicercaServizio>();

  constructor(
    protected amministrativoService: AmministrativoService, protected route: ActivatedRoute,
    private raggruppamentoTipologiaServizioService: RaggruppamentoTipologiaServizioService,
    private configuraServizioService: ConfiguraServizioService) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaOpzioniRaggruppamento();
    this.caricaCodiciTipologia();
  }

  inizializzaOpzioniRaggruppamento(): void {
    this.raggruppamentoTipologiaServizioService.ricercaRaggruppamentoTipologiaServizio(null, this.idFunzione)
      .subscribe(listaRaggruppamenti => {
        if (listaRaggruppamenti) {
          listaRaggruppamenti.forEach(raggruppamento => {
            this.opzioniRaggruppamento.push({
              value: raggruppamento.id,
              label: raggruppamento.descrizione
            });
          });
          this.opzioniRaggruppamento = _.sortBy(this.opzioniRaggruppamento, ['label']);
        }
      });
  }

  caricaCodiciTipologia(): void {
    let observable;

    observable = this.configuraServizioService.configuraServiziFiltroTipologia(this.idFunzione);
    this.labelOggettoTipologia = 'nome';

    observable.subscribe(listaTipologieServizio => {
      if (listaTipologieServizio) {
        listaTipologieServizio = _.sortBy(listaTipologieServizio, [this.labelOggettoTipologia]);
        this.listaCodiciTipologia = listaTipologieServizio;
        this.listaCodiciTipologiaFiltrati = this.listaCodiciTipologia;

        if (this.filtriRicerca.tipologiaServizioId) {
          this.filtriRicerca.tipologiaServizio = this.listaCodiciTipologiaFiltrati
            .find(value => value.id === this.filtriRicerca.tipologiaServizioId);
        }
      }
    });
  }

  filtraCodiciTipologia(event): void {
    const input = event.query;
    this.listaCodiciTipologiaFiltrati = this.listaCodiciTipologia
      .filter(value => value[this.labelOggettoTipologia].toLowerCase().startsWith(input.toLowerCase()));
  }

  pulisciFiltri(form: NgForm): void {
    form.reset();
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  validateRange() {
    let self = this;
    return ((control: FormControl) => {

      if (self.filtriRicerca.abilitaDa && self.filtriRicerca.abilitaA &&
        moment(self.filtriRicerca.abilitaDa, 'DD/MM/YYYY').isAfter(moment(self.filtriRicerca.abilitaA, 'DD/MM/YYYY'))) {
        return {date: false};
      }

      return null;
    }) as ValidatorFn;
  }
}
