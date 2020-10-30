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
import {OverlayService} from '../../../../../services/overlay.service';
import {Utils} from "../../../../../utils/Utils";


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
    this.inizializzaFiltroRicercaPagamenti();

    // recupero dati select
    this.recuperaLivelloTerritoriale();
    this.recuperaEnti();
    this.recuperaFiltroServizi();
  }

  private inizializzaFiltroRicercaPagamenti() {
    this.filtroRicercaPagamenti = new ParametriRicercaPagamenti();
    this.filtroRicercaPagamenti.livelloTerritorialeId = null;
    this.filtroRicercaPagamenti.servizioId = null;
    this.filtroRicercaPagamenti.enteId = null;
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

  recuperaEnti(): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(null, null, null).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        });
      });
    })).subscribe();
  }

  recuperaFiltroServizi(): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(null).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        });
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
     return this.controlloDate(campo);
      } else {
      return campo?.errors;
    }
  }

  controlloDate(campo?: NgModel): boolean{
    const momentDataDa = moment(this.filtroRicercaPagamenti.dataPagamentoDa, 'DD/MM/YYYY');
    const momentDataA = moment(this.filtroRicercaPagamenti.dataPagamentoA, 'DD/MM/YYYY');
    // tslint:disable-next-line:max-line-length
    return this.filtroRicercaPagamenti.dataPagamentoDa != null ? (moment(momentDataA).isBefore(momentDataDa) || campo?.errors != null) : campo?.errors != null;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.listaEnti = [];
    this.listaServizi = [];
    this.inizializzaFiltroRicercaPagamenti();
    this.ricercaPagamenti(this.filtroRicercaPagamenti);
  }

  cercaPagamenti(form: NgForm): void {
    // inizia spinner

    Object.keys(form.value).forEach(key => {
      const value = form.value[key];
      if (value !== undefined) {
        this.filtroRicercaPagamenti[key] = value;
      } else {
        this.filtroRicercaPagamenti[key] = null;
      }
    });
    this.ricercaPagamenti(this.filtroRicercaPagamenti);
  }

  ricercaPagamenti(filtri: ParametriRicercaPagamenti) {
    let filtriToBE: ParametriRicercaPagamenti = new ParametriRicercaPagamenti();
    filtriToBE.enteId = filtri.enteId;
    filtriToBE.livelloTerritorialeId = filtri.livelloTerritorialeId;
    filtriToBE.servizioId = filtri.servizioId;
    filtriToBE.numeroDocumento = filtri.numeroDocumento;
    filtriToBE.dataPagamentoDa = filtri.dataPagamentoDa ? moment(filtri.dataPagamentoDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtriToBE.dataPagamentoA = filtri.dataPagamentoA ? moment(filtri.dataPagamentoA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    this.iMieiPagamentiService.ricercaPagamenti(filtriToBE).pipe(map(listaPagamenti => {
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
      return !filtroGestioneUtentiForm.valid || !isAtLeastOneFieldValued || this.controlloDate();
    }
  }
}
