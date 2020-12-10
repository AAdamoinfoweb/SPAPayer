import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ParametriRicercaQuadratura} from '../../../../../model/quadratura/ParametriRicercaQuadratura';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {EnteService} from '../../../../../../../services/ente.service';
import * as _ from 'lodash';
import {Utils} from '../../../../../../../utils/Utils';
import {ECalendarValue} from 'ng2-date-picker';
import {QuadraturaService} from '../../../../../../../services/quadratura.service';

@Component({
  selector: 'app-filtro-quadratura',
  templateUrl: './filtro-quadratura.component.html',
  styleUrls: ['./filtro-quadratura.component.scss']
})
export class FiltroQuadraturaComponent extends FiltroGestioneElementiComponent implements OnInit {

  filtri: ParametriRicercaQuadratura = new ParametriRicercaQuadratura();
  opzioniFiltroSocieta: OpzioneSelect[];
  opzioniFiltroEnti: OpzioneSelect[];
  opzioniFiltroPsp: OpzioneSelect[];
  TipoCampoEnum = TipoCampoEnum;
  ibanRegex = Utils.IBAN_ITALIA_REGEX;

  readonly minDateDDMMYYYY = '01/01/1900';
  readonly tipoData = ECalendarValue.String;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaQuadratura> = new EventEmitter<ParametriRicercaQuadratura>();

  constructor(protected route: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private quadraturaService: QuadraturaService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.popolaFiltroSocieta();
    this.popolaFiltroEnti();
    this.popolaFiltroPSP();
  }

  popolaFiltroSocieta(): void {
    this.opzioniFiltroSocieta = [];
    this.quadraturaService.recuperaFiltroSocieta(this.idFunzione).subscribe(listaSocieta => {
      if (listaSocieta) {
        listaSocieta.forEach(societa => {
          this.opzioniFiltroSocieta.push({
            value: societa.id,
            label: societa.nome
          });
        });
        this.opzioniFiltroSocieta = _.sortBy(this.opzioniFiltroSocieta, ['label']);
      }
    });
  }

  popolaFiltroEnti(): void {
    this.opzioniFiltroEnti = [];
    this.quadraturaService.recuperaFiltroEnte(this.idFunzione).subscribe(listaEnti => {
      if (listaEnti) {
        listaEnti.forEach(ente => {
          this.opzioniFiltroEnti.push({
            value: ente.id,
            label: ente.nomeEnte
          });
        });
        this.opzioniFiltroEnti = _.sortBy(this.opzioniFiltroEnti, ['label']);
      }
    });
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
    this.onChangeFiltri.emit(this.filtri);
  }

  pulisciFiltri(filtroForm: NgForm): void {
    this.filtri = new ParametriRicercaQuadratura();
    this.onChangeFiltri.emit(null);
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    const areFiltriValorizzati = Object.keys(this.filtri).some(chiaveFiltro => {
      return this.filtri[chiaveFiltro] != null;
    });
    return !areFiltriValorizzati;
  }
}
