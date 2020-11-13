import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm, NgModel} from '@angular/forms';
import {ParametriRicercaTipologiaServizio} from '../../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {CampoTipologiaServizioService} from '../../../../../../../services/campo-tipologia-servizio.service';
import {Utils} from '../../../../../../../utils/Utils';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';

@Component({
  selector: 'app-filtro-gestione-tipologia-servizio',
  templateUrl: './filtro-gestione-tipologia-servizio.component.html',
  styleUrls: ['./filtro-gestione-tipologia-servizio.component.scss']
})
export class FiltroGestioneTipologiaServizioComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaTipologiaServizio> = new EventEmitter<ParametriRicercaTipologiaServizio>();

  minCharsRecuperoValoriAutocomplete = 1;

  TipoCampoEnum = TipoCampoEnum;

  @Input()
  funzione: FunzioneGestioneEnum;
  FunzioneGestioneEnum = FunzioneGestioneEnum;

  opzioniRaggruppamento: OpzioneSelect[] = [];

  filtriRicerca: ParametriRicercaTipologiaServizio = new ParametriRicercaTipologiaServizio();

  @Input()
  filtriIniziali: ParametriRicercaTipologiaServizio;

  listaCodiciTipologia: string[] = [];

  isTipologiaCreata = false;

  constructor(
    protected amministrativoService: AmministrativoService, protected route: ActivatedRoute,
    private raggruppamentoTipologiaServizioService: RaggruppamentoTipologiaServizioService,
    private campoTipologiaServizioService: CampoTipologiaServizioService
  ) {
    super(route, amministrativoService);
  }

  ngOnInit(): void {
    this.inizializzaOpzioniRaggruppamento();
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.filtriIniziali?.currentValue) {
      this.filtriRicerca = this.filtriIniziali;
      this.isTipologiaCreata = false;
    }
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

  selezionaRaggruppamento() {
    this.filtriRicerca.codiceTipologia = null;
    this.listaCodiciTipologia = [];
  }

  selezionaCodice() {
    if (this.filtriRicerca.codiceTipologia === '') {
      this.filtriRicerca.codiceTipologia = null;
    }

    if (this.filtriRicerca.codiceTipologia) {
      this.filtriRicerca.codiceTipologia = this.filtriRicerca.codiceTipologia.toUpperCase();
    }
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  creaTipologia(): void {
    this.isTipologiaCreata = true;
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  caricaCodiciTipologia(event): void {
    const input = event.query;

    if (input.length < this.minCharsRecuperoValoriAutocomplete) {
      this.listaCodiciTipologia = [];
    } else if (input.length === this.minCharsRecuperoValoriAutocomplete) {
      let filtro = null;
      if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
        filtro = new ParametriRicercaTipologiaServizio();
        filtro.raggruppamento = this.filtriRicerca.raggruppamentoId;
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
    if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return null;
    } else if (this.isCampoInvalido(campo)) {
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

  isPaginaGestione(): boolean {
    return this.funzione === undefined;
  }

  disabilitaFiltroRaggruppamento(): boolean {
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI && this.isTipologiaCreata) {
      return true;
    } else if (this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
      return true;
    } else {
      return null;
    }
  }

  disabilitaFiltroCodice(): boolean {
    // L'autocomplete è sempre abilitato nella pagina Gestione; È abilitato solo se è selezionato il raggruppamento nella pagina Aggiungi
    if (this.funzione === FunzioneGestioneEnum.AGGIUNGI) {
      if (this.isTipologiaCreata) {
        return true;
      } else if (!this.filtriRicerca.raggruppamentoId) {
        return true;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  disabilitaBottonePulisci(): boolean {
    return !this.filtriRicerca.raggruppamentoId && !this.filtriRicerca.codiceTipologia ? true : null;
  }

  disabilitaPulsanteCrea(): boolean {
    return !this.filtriRicerca.raggruppamentoId || this.isTipologiaCreata;
  }

}
