import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {Utils} from '../../../../../../utils/Utils';
import {ParametriRicercaBanner} from '../../../../model/banner/ParametriRicercaBanner';
import {Banner} from '../../../../model/banner/Banner';
import {NgForm, NgModel} from '@angular/forms';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';
import {BannerService} from '../../../../../../services/banner.service';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {getBannerType, LivelloBanner} from '../../../../../../enums/livelloBanner.enum';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-filtro-gestione-banner',
  templateUrl: './filtro-gestione-banner.component.html',
  styleUrls: ['../gestisci-banner.component.scss', './filtro-gestione-banner.component.scss']
})
export class FiltroGestioneBannerComponent extends FiltroGestioneElementiComponent implements OnInit {

  isCalendarOpen = false;
  readonly minDateDDMMYYYY = '01/01/1990';
  readonly tipoData = ECalendarValue.String;

  filtroGestioneBannerApplicato: ParametriRicercaBanner;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaBanner> = new EventEmitter<ParametriRicercaBanner>();

  idFunzione;

  constructor(protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
        return 'campo non valido';
    } else {
      if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else if (TipoCampoEnum.DATEDDMMYY === tipo) {
        return 'inserisci data';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  pulisciFiltri(filtroGestioneBannerForm: NgForm): void {
    filtroGestioneBannerForm.resetForm();
    this.filtroGestioneBannerApplicato = new ParametriRicercaBanner();
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    const filtro = {...this.filtroGestioneBannerApplicato};

    if ('attivo' in filtro) {
      this.filtroGestioneBannerApplicato.attivo = filtro.attivo;
    } else {
      this.filtroGestioneBannerApplicato.attivo = false;
      filtro.attivo = false;
    }
    filtro.inizio = filtro.inizio ? moment(filtro.inizio, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtro.fine = filtro.fine ? moment(filtro.fine, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;

    this.onChangeFiltri.emit(filtro);
  }

  disabilitaBottone(filtroGestioneBannerForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneBannerForm.value).some(key => filtroGestioneBannerForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued && this.filtroGestioneBannerApplicato.attivo == null;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneBannerForm.valid;
    }
  }

}
