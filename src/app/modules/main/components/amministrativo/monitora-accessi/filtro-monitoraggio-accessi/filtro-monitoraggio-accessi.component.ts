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

@Component({
  selector: 'app-filtro-monitoraggio-accessi',
  templateUrl: './filtro-monitoraggio-accessi.component.html',
  styleUrls: ['./filtro-monitoraggio-accessi.component.scss']
})
export class FiltroMonitoraggioAccessiComponent extends FiltroGestioneElementiComponent implements OnInit {

  readonly TipoCampoEnum = TipoCampoEnum;
  readonly minCharsToRetrieveCF = 1;

  @Input()
  listaElementi: Array<Accesso> = [];

  listaFunzioniAbilitate: Array<OpzioneSelect> = [];
  funzioneSelezionata: number = null;

  listaIdUtenti = [];
  idUtenteSelezionato: string = null;
  indirizzoIPSelezionato: string = null;
  dataDaSelezionata: string = null;
  dataASelezionata: string = null;

  @Output()
  onChangeListaElementi: EventEmitter<any[]> = new EventEmitter<Accesso[]>();

  constructor(
    private amministrativoService: AmministrativoService,
    private accessoService: AccessoService,
    private funzioneService: FunzioneService,
    private utenteService: UtenteService
  ) {
    super();
  }

  ngOnInit(): void {
    this.popolaFiltroFunzioni();
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
    });
  }

  suggerimentiIdUtente(event): void {
    const inputCf = event.query;

    if (inputCf.length < this.minCharsToRetrieveCF) {
      this.listaIdUtenti = [];
    } else if (inputCf.length === this.minCharsToRetrieveCF) {
      this.utenteService.letturaCodiceFiscale(inputCf, this.amministrativoService.idFunzione).subscribe(data => {
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
    parametriRicercaAccesso.inizioSessione = this.dataDaSelezionata ? new Date(this.dataDaSelezionata) : null;
    parametriRicercaAccesso.fineSessione = this.dataASelezionata ? new Date(this.dataASelezionata) : null;
    return parametriRicercaAccesso;
  }

  cercaElementi(): void {
    this.accessoService.recuperaAccessi(this.getParametriRicerca(), this.amministrativoService.idFunzione).subscribe(listaAccessi => {
      this.onChangeListaElementi.emit(listaAccessi);
    });
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.reset();
    this.onChangeListaElementi.emit(this.listaElementi);
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
