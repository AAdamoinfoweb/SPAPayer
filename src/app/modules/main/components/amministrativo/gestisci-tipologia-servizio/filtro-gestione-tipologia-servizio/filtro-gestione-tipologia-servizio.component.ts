import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FiltroGestioneElementiComponent} from '../../filtro-gestione-elementi.component';
import {AmministrativoService} from '../../../../../../services/amministrativo.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm, NgModel} from '@angular/forms';
import {ParametriRicercaTipologiaServizio} from '../../../../model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {OpzioneSelect} from '../../../../model/OpzioneSelect';
import {TipoCampoEnum} from '../../../../../../enums/tipoCampo.enum';
import {RaggruppamentoTipologiaServizioService} from '../../../../../../services/RaggruppamentoTipologiaServizio.service';
import {CampoTipologiaServizioService} from '../../../../../../services/campo-tipologia-servizio.service';
import {FunzioneGestioneEnum} from '../../../../../../enums/funzioneGestione.enum';
import {TipologiaServizio} from '../../../../model/tipologiaServizio/TipologiaServizio';
import * as _ from 'lodash';

@Component({
  selector: 'app-filtro-gestione-tipologia-servizio',
  templateUrl: './filtro-gestione-tipologia-servizio.component.html',
  styleUrls: ['./filtro-gestione-tipologia-servizio.component.scss']
})
export class FiltroGestioneTipologiaServizioComponent extends FiltroGestioneElementiComponent implements OnInit, OnChanges {

  @Output()
  onChangeFiltri: EventEmitter<ParametriRicercaTipologiaServizio> = new EventEmitter<ParametriRicercaTipologiaServizio>();

  TipoCampoEnum = TipoCampoEnum;

  @Input()
  funzione: FunzioneGestioneEnum;
  FunzioneGestioneEnum = FunzioneGestioneEnum;

  opzioniRaggruppamento: OpzioneSelect[] = [];

  filtriRicerca: ParametriRicercaTipologiaServizio = new ParametriRicercaTipologiaServizio();

  @Input()
  filtriIniziali: ParametriRicercaTipologiaServizio;

  listaTipologie: TipologiaServizio[] = [];
  listaTipologieFiltrate: TipologiaServizio[] = [];

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
    if (this.isPaginaGestione()) {
      this.caricaCodiciTipologia();
    }
  }

  ngOnChanges(sc: SimpleChanges) {
    if (sc.filtriIniziali && sc.filtriIniziali.currentValue) {
      // Carico il filtro raggruppamento quando termina la GET del dettaglio tipologia
      if (this.funzione === FunzioneGestioneEnum.MODIFICA || this.funzione === FunzioneGestioneEnum.DETTAGLIO) {
        this.filtriRicerca = this.filtriIniziali;
      }

      // Svuoto i filtri dopo che è stata salvata la tipologia (al Salva, in FormTipologia si crea un nuovo oggetto filtro)
      // Va controllato che i valori del filtro in input siano diversi per distinguere dal caso in cui, dopo l'onChange del filtro premendo Crea, arriva un nuovo filtro in input con i valori appena impostati
      if (this.funzione === FunzioneGestioneEnum.AGGIUNGI
        && (sc.filtriIniziali.currentValue.raggruppamentoId !== this.filtriRicerca.raggruppamentoId
          || sc.filtriIniziali.currentValue.tipologia?.codice !== this.filtriRicerca.tipologia?.codice)) {
        this.filtriRicerca = this.filtriIniziali;
        this.isTipologiaCreata = false;
      }
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
          this.opzioniRaggruppamento = _.sortBy(this.opzioniRaggruppamento, ['label']);
        }
      });
  }

  selezionaRaggruppamento() {
    // resetto il filtro codice
    this.filtriRicerca.tipologia = new TipologiaServizio();
    this.listaTipologie = [];
    this.listaTipologieFiltrate = [];

    // Nella pagina Form, carico solo i codici tipologia relativi al raggruppamento selezionato
    if (!this.isPaginaGestione() && this.filtriRicerca.raggruppamentoId) {
      this.caricaCodiciTipologia();
    }
  }

  cercaElementi(): void {
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  creaTipologia(): void {
    this.isTipologiaCreata = true;
    this.onChangeFiltri.emit(this.filtriRicerca);
  }

  caricaCodiciTipologia(): void {
    this.campoTipologiaServizioService.recuperaTipologieServizio(this.filtriRicerca, this.idFunzione).subscribe(listaTipologieServizio => {
      if (listaTipologieServizio) {
        listaTipologieServizio = _.sortBy(listaTipologieServizio, ['codice']);
        this.listaTipologie = listaTipologieServizio;
      }
    });
  }

  filtraCodiciTipologia(event): void {
    const input = event.query;
    this.listaTipologieFiltrate = this.listaTipologie.filter(tipologia => tipologia.codice.toLowerCase().startsWith(input.toLowerCase()));
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
    if (this.isPaginaGestione()) {
      this.caricaCodiciTipologia();
    }
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
    return !this.filtriRicerca.raggruppamentoId && !this.filtriRicerca.tipologia?.codice ? true : null;
  }

  disabilitaPulsanteCrea(): boolean {
    return !this.filtriRicerca.raggruppamentoId || this.isTipologiaCreata;
  }

}
