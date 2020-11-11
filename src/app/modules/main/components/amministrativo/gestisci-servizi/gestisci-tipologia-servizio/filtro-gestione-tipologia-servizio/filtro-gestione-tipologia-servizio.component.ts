import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm, NgModel} from '@angular/forms';
import {ParametriRicercaTipologiaServizio} from '../../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {Utils} from '../../../../../../../utils/Utils';

@Component({
  selector: 'app-filtro-gestione-tipologia-servizio',
  templateUrl: './filtro-gestione-tipologia-servizio.component.html',
  styleUrls: ['./filtro-gestione-tipologia-servizio.component.scss']
})
export class FiltroGestioneTipologiaServizioComponent extends FiltroGestioneElementiComponent implements OnInit {

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaTipologiaServizio> = new EventEmitter<ParametriRicercaTipologiaServizio>();

  minCharsRecuperoValoriAutocomplete = 1;

  @Input()
  isPaginaAggiungi: boolean;
  TipoCampoEnum = TipoCampoEnum;

  opzioniRaggruppamento: OpzioneSelect[] = [];
  filtriRicerca: ParametriRicercaTipologiaServizio = new ParametriRicercaTipologiaServizio();

  listaCodiciTipologia: string[] = [];

  constructor(
    protected amministrativoService: AmministrativoService, protected route: ActivatedRoute,
    private raggruppamentoTipologiaServizioService: RaggruppamentoTipologiaServizioService,
    private campoTipologiaServizioService: CampoTipologiaServizioService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    // todo fixare logica idFunzione, il codice entra qui nell'onInit prima di valorizzare idFunzione nel padre
    this.inizializzaOpzioniRaggruppamento();
  }

  inizializzaOpzioniRaggruppamento(): void {
    this.raggruppamentoTipologiaServizioService.ricercaRaggruppamentoTipologiaServizio(null, this.idFunzione)
      .subscribe(listaRaggruppamenti => {
      if (listaRaggruppamenti) {
        listaRaggruppamenti.forEach(raggruppamento => {
          this.opzioniRaggruppamento.push({
            value: raggruppamento.id,
            label: raggruppamento.descrizione
          });
        });
        Utils.ordinaOpzioniSelect(this.opzioniRaggruppamento);
      }
    });
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  caricaCodiciTipologia(event): void {
    const input = event.query;

    if (input.length < this.minCharsRecuperoValoriAutocomplete) {
      this.listaCodiciTipologia = [];
    } else if (input.length === this.minCharsRecuperoValoriAutocomplete) {
      let filtro = null;
      if (this.isPaginaAggiungi) {
        filtro = new ParametriRicercaTipologiaServizio();
        filtro.raggruppamento = this.filtriRicerca.raggruppamento;
      }
      this.campoTipologiaServizioService.recuperaTipologieServizio(filtro, this.idFunzione).subscribe(listaTipologieServizio => {
        if (listaTipologieServizio) {
          this.listaCodiciTipologia = listaTipologieServizio.map(tipologiaServizio => tipologiaServizio.codice);
        }
      });
    } else {
      this.listaCodiciTipologia = this.listaCodiciTipologia.filter(codice => codice.toLowerCase().startsWith(input.toLowerCase()));
    }
  }

  setPlaceholder(campo: NgModel, tipoCampo: TipoCampoEnum): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      switch (tipoCampo) {
        case TipoCampoEnum.SELECT:
          return 'seleziona un elemento dalla lista';
        case TipoCampoEnum.INPUT_TESTUALE:
          return 'inserisci testo';
      }
    }
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  pulisciFiltri(form: NgForm): void {
    form.reset();
    this.onChangeFiltri.emit(null);
  }

  disabilitaAutocompleteCodici(): boolean {
    return this.isPaginaAggiungi ? this.filtriRicerca.raggruppamento != null : null;
  }

  disabilitaPulisci(): boolean {
    return !this.filtriRicerca.raggruppamento && !this.filtriRicerca.codice ? true : null;
  }

}
