import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ParametriRicercaServizio} from '../../../../model/servizio/ParametriRicercaServizio';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {ConfiguraServizioService} from '../../../../../../services/configura-servizio.service';
import * as _ from 'lodash';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {FiltroSelect} from '../../../../model/servizio/FiltroSelect';
import {LivelloIntegrazioneEnum} from '../../../../../../enums/livelloIntegrazione.enum';

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
  readonly LivelloIntegrazioneEnum = LivelloIntegrazioneEnum;

  filtriRicerca: ParametriRicercaServizio = new ParametriRicercaServizio();
  opzioniRaggruppamento: FiltroSelect[] = [];

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaServizio> = new EventEmitter<ParametriRicercaServizio>();

  listaLivelloIntegrazione: FiltroSelect[] = [];
  listaEntiBeneficiario: FiltroSelect[] = [];
  listaEntiImpositore: FiltroSelect[] = [];
  listaServizi: FiltroSelect[] = [];

  constructor(
    protected amministrativoService: AmministrativoService, protected route: ActivatedRoute,
    private raggruppamentoTipologiaServizioService: RaggruppamentoTipologiaServizioService,
    private configuraServizioService: ConfiguraServizioService) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaOpzioniRaggruppamento();
    this.caricaLivelliIntegrazione();
    this.caricaCodiciTipologia();
    this.caricaEnteImpositore();
    this.caricaEnteBeneficiario();
    this.caricaServizi();
  }

  inizializzaOpzioniRaggruppamento(): void {
    this.configuraServizioService.configuraServiziFiltroRaggruppamento(null, this.idFunzione)
      .subscribe(listaRaggruppamenti => {
        this.opzioniRaggruppamento = listaRaggruppamenti;
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
    if (!this.filtriRicerca.attivo)
      this.filtriRicerca.attivo = null;
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    if (!this.filtriRicerca.attivo)
      this.filtriRicerca.attivo = false;
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  private caricaEnteBeneficiario() {
    this.configuraServizioService.configuraServiziFiltroEnteBeneficiario(null, this.idFunzione)
      .pipe(map((value) => this.listaEntiBeneficiario = value)).subscribe();
  }

  private caricaEnteImpositore() {
    this.configuraServizioService.configuraServiziFiltroEnteImpositore(null, this.idFunzione)
      .pipe(map((value) => this.listaEntiImpositore = value)).subscribe();
  }

  private caricaServizi() {
    this.configuraServizioService.filtroServizio(null, this.idFunzione)
      .pipe(map((value) => this.listaServizi = value)).subscribe();
  }

  private caricaLivelliIntegrazione() {
    this.configuraServizioService.filtroLivelliIntegrazione(null, this.idFunzione)
      .pipe(map((value) => this.listaLivelloIntegrazione = value)).subscribe();
  }
}
