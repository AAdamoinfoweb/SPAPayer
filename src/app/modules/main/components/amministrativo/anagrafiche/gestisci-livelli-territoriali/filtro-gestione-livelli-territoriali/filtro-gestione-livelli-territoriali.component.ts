import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LivelloTerritoriale} from '../../../../../model/LivelloTerritoriale';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {LivelloTerritorialeService} from '../../../../../../../services/livelloTerritoriale.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {FiltroGestioneElementiComponent} from "../../../filtro-gestione-elementi.component";

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
  onChangeListaElementi: EventEmitter<LivelloTerritoriale[]> = new EventEmitter<LivelloTerritoriale[]>();

  filtroLivelliTerritoriali: number = null;

  constructor(private livelloTerritorialeService: LivelloTerritorialeService,
              private amministrativoService: AmministrativoService) {
    super()
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges): void {
    if (sc.listaElementi) {
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
    this.onChangeListaElementi.emit(this.listaElementi);
  }

  cercaElementi(): void {
    this.livelloTerritorialeService.ricercaLivelliTerritoriali(this.filtroLivelliTerritoriali, this.amministrativoService.idFunzione).subscribe(listaLivelliTerritoriali => {
      this.onChangeListaElementi.emit(listaLivelliTerritoriali);
    });
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return !this.filtroLivelliTerritoriali;
  }

}
