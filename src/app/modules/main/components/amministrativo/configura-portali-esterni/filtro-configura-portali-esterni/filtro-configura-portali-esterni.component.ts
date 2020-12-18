import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ParametriRicercaConfiguraPortaleEsterno} from '../../../../model/configuraportaliesterni/ParametriRicercaConfiguraPortaleEsterno';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {NgForm, NgModel} from '@angular/forms';
import {BottoneEnum} from '../../../../../../enums/bottone.enum';
import {ConfiguraPortaliEsterniService} from '../../../../../../services/configura-portali-esterni.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-filtro-configura-portali-esterni',
  templateUrl: './filtro-configura-portali-esterni.component.html',
  styleUrls: ['./filtro-configura-portali-esterni.component.scss']
})
export class FiltroConfiguraPortaliEsterniComponent extends FiltroGestioneElementiComponent implements OnInit {

  @Output()
  onChangeFiltri: EventEmitter<any> = new EventEmitter<any>();

  filtroRicercaConfiguraPortaliEsterni: ParametriRicercaConfiguraPortaleEsterno;

  opzioniFiltroPortaleEsterno: OpzioneSelect[] = [];
  opzioniFiltroTipoPortaleEsterno: OpzioneSelect[] = [];

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService,
              private configuraPortaliEsterniService: ConfiguraPortaliEsterniService) {
    super(activatedRoute, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaFiltri();
    this.recuperaFiltroPortaleEsterno();
    this.recuperaFiltroTipoPortale();
  }

  inizializzaFiltri(): void {
    this.filtroRicercaConfiguraPortaliEsterni = new ParametriRicercaConfiguraPortaleEsterno();
    this.filtroRicercaConfiguraPortaliEsterni.codicePortaleEsterno = null;
    this.filtroRicercaConfiguraPortaliEsterni.idTipoPortaleEsterno = null;
  }

  recuperaFiltroPortaleEsterno(): void {
    this.configuraPortaliEsterniService.configuraPortaliEsterniFiltroPortaleEsterno(this.idFunzione).subscribe(listaPortaleEsterno => {
      listaPortaleEsterno.forEach(portaleEsterno => {
        this.opzioniFiltroPortaleEsterno.push({
          value: portaleEsterno.nome,
          label: portaleEsterno.nome
        });
      });
      this.opzioniFiltroPortaleEsterno = _.sortBy(this.opzioniFiltroPortaleEsterno, ['label']);
    });
  }

  recuperaFiltroTipoPortale(): void {
    this.configuraPortaliEsterniService.configuraPortaliEsterniFiltroTipoPortaleEsterno(this.idFunzione).subscribe(listaTipoPortaleEsterno => {
      listaTipoPortaleEsterno.forEach(tipoPortaleEsterno => {
        this.opzioniFiltroTipoPortaleEsterno.push({
          value: tipoPortaleEsterno.id,
          label: tipoPortaleEsterno.nome
        });
      });
      this.opzioniFiltroTipoPortaleEsterno = _.sortBy(this.opzioniFiltroTipoPortaleEsterno, ['label']);
    });
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtroRicercaConfiguraPortaliEsterni);
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.onChangeFiltri.emit(this.filtroRicercaConfiguraPortaliEsterni);
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors != null;
  }

  getMessaggioErrore(campo: NgModel): string {
    if (this.isCampoInvalido(campo)) {
      return 'Campo non valido';
    }
  }

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroForm.value).some(key => filtroForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroForm.valid;
    }
  }

}
