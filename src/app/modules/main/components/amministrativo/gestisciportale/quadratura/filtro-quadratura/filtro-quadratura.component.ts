import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ParametriRicercaQuadratura} from '../../../../../model/quadratura/ParametriRicercaQuadratura';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import * as _ from 'lodash';
import {Utils} from '../../../../../../../utils/Utils';
import {DatePickerComponent, ECalendarValue} from 'ng2-date-picker';
import {QuadraturaService} from '../../../../../../../services/quadratura.service';
import {FiltroSelect} from '../../../../../model/servizio/FiltroSelect';
import {GestisciPortaleService} from '../../../../../../../services/gestisci-portale.service';
import * as moment from 'moment';

@Component({
  selector: 'app-filtro-quadratura',
  templateUrl: './filtro-quadratura.component.html',
  styleUrls: ['./filtro-quadratura.component.scss']
})
export class FiltroQuadraturaComponent extends FiltroGestioneElementiComponent implements OnInit {

  filtri: ParametriRicercaQuadratura = new ParametriRicercaQuadratura();
  opzioniFiltroSocieta: FiltroSelect[];
  opzioniFiltroEnti: FiltroSelect[];
  opzioniFiltroPsp: OpzioneSelect[];
  opzioniFiltroFlussoId: string[];
  opzioniFiltroFlussoIdFiltrate: string[];
  TipoCampoEnum = TipoCampoEnum;
  ibanRegex = Utils.IBAN_ITALIA_REGEX;

  isCalendarOpen: boolean;
  readonly minDateDDMMYYYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaQuadratura> = new EventEmitter<ParametriRicercaQuadratura>();

  constructor(protected route: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private quadraturaService: QuadraturaService, private gestisciPortaleService: GestisciPortaleService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.popolaFiltroSocieta();
    this.popolaFiltroEnti();
    this.popolaFiltroPSP();
    this.popolaFiltroFlussoId();
  }

  popolaFiltroSocieta(): void {
    this.opzioniFiltroSocieta = [];
    this.gestisciPortaleService.gestisciPortaleFiltroSocieta(this.idFunzione).subscribe(listaSocieta => {
      if (listaSocieta) {
        this.opzioniFiltroSocieta = _.sortBy(listaSocieta, ['nome']);
      }
    });
  }

  popolaFiltroEnti(): void {
    this.opzioniFiltroEnti = [];
    this.gestisciPortaleService.gestisciPortaleFiltroEnte(this.idFunzione).subscribe(listaEnti => {
      if (listaEnti) {
        this.opzioniFiltroEnti = _.sortBy(listaEnti, ['nome']);
      }
    });
  }

  openDatepicker(datePickerComponent: DatePickerComponent): void {
    datePickerComponent.api.open();
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  popolaFiltroPSP(): void {
    this.opzioniFiltroPsp = [];
    this.quadraturaService.recuperaFiltroPsp(this.idFunzione).subscribe(listaPsp => {
      if (listaPsp) {
        listaPsp.forEach(psp => {
          this.opzioniFiltroPsp.push({
            value: psp.id,
            label: psp.nome
          });
        });
        this.opzioniFiltroPsp = _.sortBy(this.opzioniFiltroPsp, ['label']);
      }
    });
  }

  popolaFiltroFlussoId(): void {
    this.opzioniFiltroFlussoId = [];
    this.quadraturaService.recuperaFiltroFlussoId(this.idFunzione).subscribe(listaFlussoId => {
      if (listaFlussoId) {
        listaFlussoId.sort();
        this.opzioniFiltroFlussoId = listaFlussoId;
      }
    });
  }

  filtraOpzioniFlussoId(event): void {
    const input = event.query;
    this.opzioniFiltroFlussoIdFiltrate = this.opzioniFiltroFlussoId
      .filter(value => value.toLowerCase().startsWith(input.toLowerCase()));
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel, tipoCampo: TipoCampoEnum): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'inserisci';
        case TipoCampoEnum.DATEDDMMYY:
          return 'seleziona una data';
      }
    }
  }

  cercaElementi(): void {
    const filtri = {...this.filtri};
    filtri.dataQuadraturaDa = filtri.dataQuadraturaDa ? moment(filtri.dataQuadraturaDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME) : null;
    filtri.dataQuadraturaA = filtri.dataQuadraturaA ? moment(filtri.dataQuadraturaA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO) : null;
    this.onChangeFiltri.emit(filtri);
  }

  pulisciFiltri(filtroForm: NgForm): void {
    this.filtri = new ParametriRicercaQuadratura();
    this.onChangeFiltri.emit(null);
  }

  disabilitaBottonePulisci(filtroForm: NgForm): boolean {
    const areFiltriValorizzati = Object.keys(this.filtri).some(chiaveFiltro => {
      return this.filtri[chiaveFiltro] != null;
    });
    return !areFiltriValorizzati;
  }

  disabilitaBottoneSalva(filtroForm: NgForm): boolean {
    return !filtroForm.valid;
  }
}
