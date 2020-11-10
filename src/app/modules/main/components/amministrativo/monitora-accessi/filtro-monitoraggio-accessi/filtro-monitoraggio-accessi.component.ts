import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {NgForm, NgModel} from '@angular/forms';
import {Accesso} from '../../../../model/accesso/Accesso';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {ParametriRicercaAccesso} from '../../../../model/accesso/ParametriRicercaAccesso';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {FunzioneService} from '../../../../../../services/funzione.service';
import {AccessoService} from '../../../../../../services/accesso.service';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {UtenteService} from '../../../../../../services/utente.service';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import * as moment from 'moment';
import {Utils} from '../../../../../../utils/Utils';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-filtro-monitoraggio-accessi',
  templateUrl: './filtro-monitoraggio-accessi.component.html',
  styleUrls: ['./filtro-monitoraggio-accessi.component.scss']
})
export class FiltroMonitoraggioAccessiComponent extends FiltroGestioneElementiComponent implements OnInit {

  readonly TipoCampoEnum = TipoCampoEnum;
  readonly minCharsToRetrieveCF = 1;
  readonly minDateDDMMYYYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;
  readonly formatoData = Utils.FORMAT_DATE_CALENDAR;

  listaFunzioniAbilitate: Array<OpzioneSelect> = [];

  funzioneSelezionata: number = null;

  listaIdUtenti = [];
  idUtenteSelezionato: string = null;
  indirizzoIPSelezionato: string = null;
  dataDaSelezionata: string = moment().subtract(1, 'months').format(this.formatoData);
  dataASelezionata: string = moment().format(this.formatoData);

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaAccesso> = new EventEmitter<ParametriRicercaAccesso>();

  constructor(
    protected amministrativoService: AmministrativoService,
    private accessoService: AccessoService,
    private funzioneService: FunzioneService,
    private utenteService: UtenteService,
    protected route: ActivatedRoute
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.popolaFiltroFunzioni();

    // Carico gli accessi con i filtri già impostati
    this.onChangeFiltri.emit(this.getParametriRicerca());
  }

  popolaFiltroFunzioni() {
    this.listaFunzioniAbilitate = [];
    this.funzioneService.letturaFunzioni().subscribe(listaFunzioni => {
      listaFunzioni.forEach(funzione => {
        this.listaFunzioniAbilitate.push({
          value: funzione.id,
          label: funzione.nome
        });
      });
      Utils.ordinaOpzioniSelect(this.listaFunzioniAbilitate);
    });
  }

  suggerimentiIdUtente(event): void {
    const inputCf = event.query;

    if (inputCf.length < this.minCharsToRetrieveCF) {
      this.listaIdUtenti = [];
    } else if (inputCf.length === this.minCharsToRetrieveCF) {
      this.utenteService.letturaCodiceFiscale(inputCf, this.idFunzione).subscribe(data => {
        this.listaIdUtenti = data;
      });
    } else {
      this.listaIdUtenti = this.listaIdUtenti.filter(cf => cf.toLowerCase().indexOf(inputCf.toLowerCase()) === 0);
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel, tipoCampo: TipoCampoEnum) {
    if (this.isCampoInvalido(campo)) {
      return 'campo invalido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'inserisci testo';
        case TipoCampoEnum.DATEDDMMYY:
          return 'inserisci data';
      }
    }
  }

  getParametriRicerca() {
    const parametriRicercaAccesso = new ParametriRicercaAccesso();
    parametriRicercaAccesso.funzioneId = this.funzioneSelezionata;
    parametriRicercaAccesso.codiceFiscale = this.idUtenteSelezionato || null;
    parametriRicercaAccesso.indirizzoIP = this.indirizzoIPSelezionato || null;
    parametriRicercaAccesso.inizioSessione = this.dataDaSelezionata ? moment(this.dataDaSelezionata, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    parametriRicercaAccesso.fineSessione = this.dataASelezionata ? moment(this.dataASelezionata, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    return parametriRicercaAccesso;
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.getParametriRicerca());
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.funzioneSelezionata = null;
    this.idUtenteSelezionato = null;
    this.indirizzoIPSelezionato = null;
    this.dataDaSelezionata = null;
    this.dataASelezionata = null;
    this.onChangeFiltri.emit(null);
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
  }

  areFiltriPuliti(): boolean {
    return !this.funzioneSelezionata && !this.idUtenteSelezionato && !this.indirizzoIPSelezionato && !this.dataDaSelezionata && !this.dataASelezionata;
  }

  disabilitaBottonePulisci(): boolean {
    return this.areFiltriPuliti();
  }

  disabilitaBottoneCerca(filtroForm: NgForm): boolean {
    return this.areFiltriPuliti() || filtroForm.status === 'INVALID';
  }

}
