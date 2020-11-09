import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {RaggruppamentoTipologiaServizio} from '../../../../../model/RaggruppamentoTipologiaServizio';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../../services/RaggruppamentoTipologiaServizio.service';

@Component({
  selector: 'app-filtro-raggruppamento-tipologie',
  templateUrl: './filtro-raggruppamento-tipologie.component.html',
  styleUrls: ['./filtro-raggruppamento-tipologie.component.scss']
})
export class FiltroRaggruppamentoTipologieComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Input() listaElementi: Array<RaggruppamentoTipologiaServizio> = new Array<RaggruppamentoTipologiaServizio>();
  opzioniFiltroRaggruppamentiTipologie: Array<OpzioneSelect> = new Array<OpzioneSelect>();

  @Output()
  onChangeFiltri: EventEmitter<number> = new EventEmitter<number>();

  filtroRaggruppamentiTipologieServizi: number = null;

  idFunzione;

  constructor(protected amministrativoService: AmministrativoService, protected route: ActivatedRoute) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
  }

  ngOnChanges(sc: SimpleChanges): void {
    if (sc.listaElementi) {
      this.impostaOpzioniFiltroRaggruppamentiTipologieServizi();
    }
  }

  impostaOpzioniFiltroRaggruppamentiTipologieServizi(): void {
    this.opzioniFiltroRaggruppamentiTipologie = [];

    this.listaElementi.forEach(raggruppamentoTipologiaServizio => {
      this.opzioniFiltroRaggruppamentiTipologie.push({
        value: raggruppamentoTipologiaServizio.id,
        label: raggruppamentoTipologiaServizio.nome
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

  pulisciFiltri(filtroRaggruppamentoTipologieForm: NgForm): void {
    filtroRaggruppamentoTipologieForm.resetForm();
    this.filtroRaggruppamentiTipologieServizi = null;
    this.onChangeFiltri.emit(null);
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtroRaggruppamentiTipologieServizi);
  }

  disabilitaBottone(filtroForm: NgForm): boolean {
    return !this.filtroRaggruppamentiTipologieServizi;
  }

}
