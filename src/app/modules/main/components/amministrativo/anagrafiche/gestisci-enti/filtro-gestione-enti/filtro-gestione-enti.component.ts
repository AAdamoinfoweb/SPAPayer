import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OpzioneSelect} from '../../../../../model/OpzioneSelect';
import {SocietaService} from '../../../../../../../services/societa.service';
import {AmministrativoService} from '../../../../../../../services/amministrativo.service';
import {NgForm, NgModel} from '@angular/forms';
import {ParametriRicercaUtente} from '../../../../../model/utente/ParametriRicercaUtente';
import {TipoCampoEnum} from '../../../../../../../enums/tipoCampo.enum';
import {BottoneEnum} from '../../../../../../../enums/bottone.enum';
import {map} from 'rxjs/operators';
import {NuovoPagamentoService} from '../../../../../../../services/nuovo-pagamento.service';
import {FunzioneService} from '../../../../../../../services/funzione.service';
import {UtenteService} from '../../../../../../../services/utente.service';
import {OverlayService} from '../../../../../../../services/overlay.service';
import {Societa} from '../../../../../model/Societa';

@Component({
  selector: 'app-filtro-gestione-enti',
  templateUrl: './filtro-gestione-enti.component.html',
  styleUrls: ['./filtro-gestione-enti.component.scss']
})
export class FiltroGestioneEntiComponent implements OnInit, OnChanges {

  opzioniFiltroSocieta: OpzioneSelect[] = [];
  opzioniFiltroLivelliTerritoriali: OpzioneSelect[] = [];

  @Input()
  filtroSocieta = null;

  filtroApplicato: ParametriRicercaUtente;

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private societaService: SocietaService,
              private funzioneService: FunzioneService, private utenteService: UtenteService, private overlayService: OverlayService,
              private amministrativoService: AmministrativoService) {
  }

  ngOnInit(): void {
    this.filtroApplicato = new ParametriRicercaUtente();

    this.recuperaFiltroSocieta();
    this.recuperaFiltroLivelloTerritoriale();
  }

  ngOnChanges(sc: SimpleChanges): void {
    if (sc.listaSocieta) {
      this.impostaOpzioniFiltroSocieta();
    }
  }

  recuperaFiltroSocieta(): void {
    this.societaService.filtroSocieta()
      .pipe(map(societa => {
        societa.forEach(s => {
          this.listaSocieta.push({
            value: s.id,
            label: s.nome
          });
        });

        if (this.filtroSocieta) {
          this.overlayService.caricamentoEvent.emit(true);
          const isFiltroSocietaValido = this.listaSocieta.some(item => item.value === this.filtroSocieta);
          if (isFiltroSocietaValido) {
            this.filtroApplicato.societaId = this.filtroSocieta;
            const parametriRicercaUtente = new ParametriRicercaUtente();
            parametriRicercaUtente.societaId = this.filtroSocieta;
            this.utenteService.ricercaUtenti(parametriRicercaUtente, this.amministrativoService.idFunzione).subscribe(utenti => {
              // this.onChangeListaUtenti.emit(utenti);
              this.overlayService.caricamentoEvent.emit(false);
            });
          } else {
            this.overlayService.caricamentoEvent.emit(false);
            window.open('/nonautorizzato', '_self');
          }
        }
      })).subscribe();
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.opzioniFiltroLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        });
      });
    })).subscribe();
  }

  impostaOpzioniFiltroSocieta(): void {
    this.societaService.filtroSocieta()
      .pipe(map(societa => {
        societa.forEach(s => {
          this.opzioniFiltroSocieta.push({
            value: s.id,
            label: s.nome
          });
        });
      }));
  }

  isCampoInvalido(campo: NgModel) {
    return campo?.errors;
  }

  setPlaceholder(campo: NgModel, tipo: string): string {
    if (this.isCampoInvalido(campo)) {
      return 'campo non valido';
    } else {
      if (TipoCampoEnum.SELECT === tipo) {
        return 'seleziona un elemento dalla lista';
      } else if (TipoCampoEnum.INPUT_TESTUALE === tipo) {
        return 'inserisci testo';
      } else {
        return 'inserisci data';
      }
    }
  }

  pulisciFiltri(filtroGestioneUtentiForm: NgForm): void {
    filtroGestioneUtentiForm.resetForm();
    this.filtroApplicato = new ParametriRicercaUtente();
  }


  selezionaLivelloTerritoriale(): void {

  }

  disabilitaBottone(filtroGestioneUtentiForm: NgForm, nomeBottone: string): boolean {
    const isAtLeastOneFieldValued = Object.keys(filtroGestioneUtentiForm.value).some(key => filtroGestioneUtentiForm.value[key]);
    if (nomeBottone === BottoneEnum.PULISCI) {
      return !isAtLeastOneFieldValued;
    } else if (nomeBottone === BottoneEnum.CERCA) {
      return !filtroGestioneUtentiForm.valid || !isAtLeastOneFieldValued;
    }
  }

  cercaSocieta() {

  }
}
