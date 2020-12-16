import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {ActivatedRoute} from '@angular/router';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-filtro-iuv-senza-bonifico',
  templateUrl: './filtro-iuv-senza-bonifico.component.html',
  styleUrls: ['./filtro-iuv-senza-bonifico.component.scss']
})
export class FiltroIuvSenzaBonificoComponent extends FiltroGestioneElementiComponent implements OnInit {

  filtro: string;

  @Output()
  onChangeFiltri: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected activatedRoute: ActivatedRoute, protected amministrativoService: AmministrativoService) {
    super(activatedRoute, amministrativoService);
  }

  ngOnInit(): void {
  }

  pulisciFiltri(filtroForm: NgForm): void {
  }

  cercaElementi(): void {
    // TODO implementare logica cerca filtrando nella tabella ad ogni carattere digitato
  }

}
