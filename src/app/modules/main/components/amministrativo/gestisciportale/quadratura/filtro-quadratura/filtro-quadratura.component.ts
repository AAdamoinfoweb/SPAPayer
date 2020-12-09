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

@Component({
  selector: 'app-filtro-quadratura',
  templateUrl: './filtro-quadratura.component.html',
  styleUrls: ['./filtro-quadratura.component.scss']
})
export class FiltroQuadraturaComponent extends FiltroGestioneElementiComponent implements OnInit {

  filtri: ParametriRicercaQuadratura = new ParametriRicercaQuadratura();
  opzioniFiltroSocieta: OpzioneSelect[];
  opzioniFiltroEnti: OpzioneSelect[];
  TipoCampoEnum = TipoCampoEnum;

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaQuadratura> = new EventEmitter<ParametriRicercaQuadratura>();

  constructor(protected route: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private societaService: SocietaService, private enteService: EnteService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.popolaFiltroSocieta();
    this.popolaFiltroEnti();
  }

  popolaFiltroSocieta(): void {
    this.opzioniFiltroSocieta = [];
    this.societaService.ricercaSocieta(null, this.idFunzione).subscribe(listaSocieta => {
      if (listaSocieta) {
        listaSocieta.forEach(societa => {
          this.opzioniFiltroSocieta.push({
            value: societa.id,
            label: societa.nome
          });
        });
      }
    });
  }

  popolaFiltroEnti(): void {
    this.opzioniFiltroEnti = [];
    this.enteService.ricercaEnti(null, this.idFunzione).subscribe(listaEnti => {
      if (listaEnti) {
        listaEnti.forEach(ente => {
          this.opzioniFiltroEnti.push({
            value: ente.id,
            label: ente.nomeEnte
          });
        });
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
