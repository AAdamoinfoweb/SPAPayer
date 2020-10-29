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

@Component({
  selector: 'app-filtro-monitoraggio-accessi',
  templateUrl: './filtro-monitoraggio-accessi.component.html',
  styleUrls: ['./filtro-monitoraggio-accessi.component.scss']
})
export class FiltroMonitoraggioAccessiComponent extends FiltroGestioneElementiComponent implements OnInit {

  readonly TipoCampoEnum = TipoCampoEnum;

  @Input()
  listaElementi: Array<Accesso> = [];

  listaFunzioniAbilitate: Array<OpzioneSelect> = [];

  // parametriRicercaAccesso: ParametriRicercaAccesso = new ParametriRicercaAccesso();

  funzioneSelezionata: number = null;
  indirizzoIPSelezionato: string = null;
  idUtenteSelezionato: string = null;
  dataDaSelezionata: string = null;
  dataASelezionata: string = null;

  @Output()
  onChangeListaElementi: EventEmitter<any[]> = new EventEmitter<Accesso[]>();

  constructor(
    private amministrativoService: AmministrativoService,
    private accessoService: AccessoService,
    private funzioneService: FunzioneService
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

  cercaElementi(): void {
    const parametriRicercaAccesso = new ParametriRicercaAccesso();
    parametriRicercaAccesso.funzioneId = this.funzioneSelezionata;
    this.accessoService.recuperaAccessi(parametriRicercaAccesso, this.amministrativoService.idFunzione).subscribe(listaAccessi => {
      this.onChangeListaElementi.emit(listaAccessi);
    });
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.reset();
    this.onChangeListaElementi.emit(this.listaElementi);
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return filtroForm.status === 'INVALID';
  }

}
