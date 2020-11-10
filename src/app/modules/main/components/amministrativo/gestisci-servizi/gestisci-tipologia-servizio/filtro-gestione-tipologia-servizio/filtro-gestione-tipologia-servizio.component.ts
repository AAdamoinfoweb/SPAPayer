import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ParametriRicercaTipologiaServizio} from '../../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-filtro-gestione-tipologia-servizio',
  templateUrl: './filtro-gestione-tipologia-servizio.component.html',
  styleUrls: ['./filtro-gestione-tipologia-servizio.component.scss']
})
export class FiltroGestioneTipologiaServizioComponent extends FiltroGestioneElementiComponent implements OnInit {

  onChangeFiltri: EventEmitter<ParametriRicercaTipologiaServizio> = new EventEmitter<ParametriRicercaTipologiaServizio>();

  @Input()
  isPaginaAggiungi: boolean;

  opzioniRaggruppamento: OpzioneSelect[];
  filtriRicerca: ParametriRicercaTipologiaServizio = new ParametriRicercaTipologiaServizio();

  constructor(protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  pulisciFiltri(form: NgForm): void {
    form.reset();
    this.onChangeFiltri.emit(null);
  }

  disabilitaBottone(form: NgForm) {
    // todo logica disabilita pulisci
  }

}
