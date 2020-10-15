import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {ParametriRicercaPagamenti} from '../../../model/utente/ParametriRicercaPagamenti';
import {TipoCampoEnum} from '../../../../../enums/tipoCampo.enum';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {FunzioneService} from '../../../../../services/funzione.service';
import {map} from 'rxjs/operators';
import {IMieiPagamentiService} from '../../../../../services/i-miei-pagamenti.service';
import {DatiPagamento} from '../../../model/bollettino/DatiPagamento';
import {ListaPagamentiFiltri} from '../../../model/bollettino/imieipagamenti/ListaPagamentiFiltri';
import * as moment from 'moment';
import {OverlayService} from "../../../../../services/overlay.service";


@Component({
  selector: 'app-filtri-i-miei-pagamenti',
  templateUrl: './filtri-i-miei-pagamenti.component.html',
  styleUrls: ['./filtri-i-miei-pagamenti.component.scss']
})
export class FiltriIMieiPagamentiComponent implements OnInit {

  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];

  isCalendarOpen = false;
  readonly minDateDDMMYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  filtroRicercaPagamenti: ParametriRicercaPagamenti;

  @Input()
  listaPagamento: Array<DatiPagamento> = new Array<DatiPagamento>();

  @Output()
  onChangeListaPagamenti: EventEmitter<ListaPagamentiFiltri> = new EventEmitter<ListaPagamentiFiltri>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private funzioneService: FunzioneService, private iMieiPagamentiService: IMieiPagamentiService,
              private overlayService: OverlayService) {
  }

  ngOnInit(): void {
    this.filtroRicercaPagamenti = new ParametriRicercaPagamenti();

    // recupero dati select
    this.overlayService.caricamentoEvent.emit(true);
    this.recuperaLivelloTerritoriale();
  }

  recuperaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        });
      });
    })).subscribe();
  }

  selezionaLivelloTerritoriale(): void {
    // pulisci select ente
    if (this.filtroRicercaPagamenti.livelloTerritorialeId != null) {
      this.overlayService.caricamentoEvent.emit(true);
      this.filtroRicercaPagamenti.enteId = null;
      this.listaEnti = [];

      this.recuperaEnti(this.filtroRicercaPagamenti?.livelloTerritorialeId);
    }
  }

  recuperaEnti(livelloTerritorialeId): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(livelloTerritorialeId).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        });
        this.overlayService.caricamentoEvent.emit(false);
      });
    })).subscribe();
  }

  selezionaEnte(): void {
    // pulisci select servizio
    if (this.filtroRicercaPagamenti.enteId != null) {
      this.overlayService.caricamentoEvent.emit(true);
      this.filtroRicercaPagamenti.servizioId = null;
      this.listaServizi = [];

      this.recuperaFiltroServizi(this.filtroRicercaPagamenti?.enteId);
    }
  }

  recuperaFiltroServizi(enteId): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(enteId).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        });
        this.overlayService.caricamentoEvent.emit(false);
      });
    })).subscribe();
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      } else if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else {
        return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    if (campo?.name === 'dataScadenzaA') {
      const momentDataDa = moment(this.filtroRicercaPagamenti.dataScadenzaDa, 'DD/MM/YYYY');
      const momentDataA = moment(this.filtroRicercaPagamenti.dataScadenzaA, 'DD/MM/YYYY');
      return this.filtroRicercaPagamenti.dataScadenzaDa != null && moment(momentDataA).isBefore(momentDataDa);
    } else {
      return campo?.errors;
    }

  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.listaEnti = [];
    this.listaServizi = [];
    this.filtroRicercaPagamenti = new ParametriRicercaPagamenti();
    console.log(this.filtroRicercaPagamenti);
  }

  cercaPagamenti(form: NgForm): void {
    // inizia spinner
    this.overlayService.caricamentoEvent.emit(true);

    Object.keys(form.value).forEach(key => {
      const value = form.value[key];
      if (value !== undefined) {
        this.filtroRicercaPagamenti[key] = value;
      } else {
        this.filtroRicercaPagamenti[key] = null;
      }
    });

    const filtri = this.filtroRicercaPagamenti;
    this.iMieiPagamentiService.ricercaPagamenti(filtri).pipe(map(listaPagamenti => {
      const listaPagamentiFiltri: ListaPagamentiFiltri = new ListaPagamentiFiltri();
      listaPagamentiFiltri.listaPagamenti = listaPagamenti;
      listaPagamentiFiltri.filtri = filtri;
      this.onChangeListaPagamenti.emit(listaPagamentiFiltri);
    })).subscribe();
  }

  disabilitaBottone(filtroGestioneUtentiForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneUtentiForm.value).some(key => filtroGestioneUtentiForm.value[key]);
    if (nomeBottone === 'Pulisci') {
      return !isAtLeastOneFieldValued;
    } else {
      return !filtroGestioneUtentiForm.valid;
    }
  }
}
