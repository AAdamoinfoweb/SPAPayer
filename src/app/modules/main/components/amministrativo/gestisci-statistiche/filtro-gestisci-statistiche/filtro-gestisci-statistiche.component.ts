import {Component, EventEmitter, OnInit} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ParametriRicercaStatistiche} from "../../../../model/statistiche/ParametriRicercaStatistiche";
import {DatePickerComponent, ECalendarValue} from "ng2-date-picker";
import * as moment from "moment";

@Component({
  selector: 'app-filtro-gestisci-statistiche',
  templateUrl: './filtro-gestisci-statistiche.component.html',
  styleUrls: ['./filtro-gestisci-statistiche.component.scss']
})
export class FiltroGestisciStatisticheComponent extends FiltroGestioneElementiComponent implements OnInit {

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService) {
    super(activatedRoute, amministrativoService);
  }

  idFunzione;
  onChangeFiltri: EventEmitter<any>;

  filtroRicercaStatistiche: ParametriRicercaStatistiche;

  // calendar
  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = moment().format('DD/MM/YYYY');
  readonly tipoData = ECalendarValue.String;

  ngOnInit(): void {
    this.inizializzaFiltroRicercaStatistiche();
  }

  private inizializzaFiltroRicercaStatistiche() {
    this.filtroRicercaStatistiche = new ParametriRicercaStatistiche();
    this.filtroRicercaStatistiche.avvioSchedulazione = null;
    this.filtroRicercaStatistiche.fineSchedulazione = null;
    this.filtroRicercaStatistiche.attiva = false;
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtroRicercaStatistiche);
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.inizializzaFiltroRicercaStatistiche();
    this.onChangeFiltri.emit(null);
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
}
