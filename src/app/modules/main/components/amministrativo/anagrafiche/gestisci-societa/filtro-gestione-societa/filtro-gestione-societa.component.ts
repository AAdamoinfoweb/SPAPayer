import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Societa} from '../../../../../model/Societa';
import {NgForm, NgModel} from '@angular/forms';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {FiltroGestioneElementiComponent} from "../../../filtro-gestione-elementi.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-filtro-gestione-societa',
  templateUrl: './filtro-gestione-societa.component.html',
  styleUrls: ['../gestisci-societa.component.scss', './filtro-gestione-societa.component.scss']
})
export class FiltroGestioneSocietaComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Input()
  listaElementi: Array<Societa> = new Array<Societa>();
  opzioniFiltroSocieta: Array<OpzioneSelect> = new Array<OpzioneSelect>();

  @Output()
  onChangeListaElementi: EventEmitter<Societa[]> = new EventEmitter<Societa[]>();

  filtroSocieta: number = null;

  idFunzione;

  constructor(private societaService: SocietaService,
              protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges): void {
    if (sc.listaElementi) {
      this.impostaOpzioniFiltroSocieta();
    }
  }

  impostaOpzioniFiltroSocieta(): void {
    this.opzioniFiltroSocieta = [];
    this.listaElementi.forEach(societa => {
      this.opzioniFiltroSocieta.push({
        value: societa.id,
        label: societa.nome
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
    this.filtroSocieta = null;
    this.onChangeListaElementi.emit(this.listaElementi);
  }

  cercaElementi(): void {
    this.societaService.ricercaSocieta(this.filtroSocieta, this.idFunzione).subscribe(listaSocieta => {
      this.onChangeListaElementi.emit(listaSocieta);
    });
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return !this.filtroSocieta;
  }

}
