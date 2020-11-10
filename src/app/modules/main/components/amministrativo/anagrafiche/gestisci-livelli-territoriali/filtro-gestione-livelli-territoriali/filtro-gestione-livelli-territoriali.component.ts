import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {LivelloTerritorialeService} from '../../../../../../../services/livelloTerritoriale.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {FiltroGestioneElementiComponent} from "../../../filtro-gestione-elementi.component";
import {ActivatedRoute} from "@angular/router";
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-filtro-gestione-livelli-territoriali',
  templateUrl: './filtro-gestione-livelli-territoriali.component.html',
  styleUrls: ['../gestisci-livelli-territoriali.component.scss', './filtro-gestione-livelli-territoriali.component.scss']
})
export class FiltroGestioneLivelliTerritorialiComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Input()
  listaElementi: Array<LivelloTerritoriale> = new Array<LivelloTerritoriale>();
  opzioniFiltroLivelliTerritoriali: Array<OpzioneSelect> = new Array<OpzioneSelect>();

  @Output()
  onChangeFiltri: EventEmitter<number> = new EventEmitter<number>();

  filtroLivelliTerritoriali: number = null;

  constructor(private livelloTerritorialeService: LivelloTerritorialeService,
              protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges): void {
    // Appena la lista viene popolata per la prima volta
    if (sc.listaElementi && !this.opzioniFiltroLivelliTerritoriali.length) {
      this.impostaOpzioniFiltroLivelliTerritoriali();
    }
  }

  impostaOpzioniFiltroLivelliTerritoriali(): void {
    this.opzioniFiltroLivelliTerritoriali = [];
    this.listaElementi.forEach(livelloTerritoriale => {
      this.opzioniFiltroLivelliTerritoriali.push({
        value: livelloTerritoriale.id,
        label: livelloTerritoriale.nome
      });
    });
    Utils.ordinaOpzioniSelect(this.opzioniFiltroLivelliTerritoriali);
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      return 'seleziona un elemento dalla lista';
    }
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.filtroLivelliTerritoriali = null;
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtroLivelliTerritoriali);
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return !this.filtroLivelliTerritoriali;
  }

}
