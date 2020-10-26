import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Societa} from "../../../../../model/Societa";
import {OpzioneSelect} from "../../../../../model/OpzioneSelect";
import {SocietaService} from "../../../../../../../services/societa.service";
import {AmministrativoService} from "../../../../../../../services/amministrativo.service";
import {NgForm, NgModel} from "@angular/forms";

@Component({
  selector: 'app-filtro-gestione-enti',
  templateUrl: './filtro-gestione-enti.component.html',
  styleUrls: ['./filtro-gestione-enti.component.scss']
})
export class FiltroGestioneEntiComponent implements OnInit, OnChanges {

  @Input()
  listaSocieta: Array<Societa> = new Array<Societa>();
  opzioniFiltroSocieta: Array<OpzioneSelect> = new Array<OpzioneSelect>();

  @Output()
  onChangeListaSocieta: EventEmitter<Societa[]> = new EventEmitter<Societa[]>();

  filtroSocieta: number = null;

  constructor(private societaService: SocietaService,
              private amministrativoService: AmministrativoService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges): void {
    if (sc.listaSocieta) {
      this.impostaOpzioniFiltroSocieta();
    }
  }

  impostaOpzioniFiltroSocieta(): void {
    this.opzioniFiltroSocieta = [];
    this.listaSocieta.forEach(societa => {
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
    this.onChangeListaSocieta.emit(this.listaSocieta);
  }

  cercaSocieta(): void {
    this.societaService.ricercaSocieta(this.filtroSocieta, this.amministrativoService.idFunzione).subscribe(listaSocieta => {
      this.onChangeListaSocieta.emit(listaSocieta);
    });
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return !this.filtroSocieta;
  }

}
