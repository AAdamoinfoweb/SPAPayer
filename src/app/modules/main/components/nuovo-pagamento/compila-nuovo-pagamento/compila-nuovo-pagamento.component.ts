import {Component, OnInit} from '@angular/core';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {map} from 'rxjs/operators';
import {LivelloTerritoriale} from '../../../model/LivelloTerritoriale';
import {Ente} from '../../../model/Ente';
import {FiltroServizio} from '../../../model/FiltroServizio';
import {OpzioneSelect} from '../../../model/OpzioneSelect';
import {OverlayService} from '../../../../../services/overlay.service';
import {MenuService} from "../../../../../services/menu.service";

@Component({
  selector: 'app-compila-nuovo-pagamento',
  templateUrl: './compila-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento.component.scss', './compila-nuovo-pagamento.component.scss']
})
export class CompilaNuovoPagamentoComponent implements OnInit {
  listaLivelliTerritoriali: Array<OpzioneSelect> = [];
  listaEnti: Array<OpzioneSelect> = [];
  listaServizi: Array<OpzioneSelect> = [];

  livelloTerritorialeSelezionato: LivelloTerritoriale = null;
  enteSelezionato: Ente = null;
  servizioSelezionato: FiltroServizio = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService,
              private menuService: MenuService,
              private overlayService: OverlayService) {
    this.nuovoPagamentoService.pulisciEvent.subscribe(() => {
      this.pulisci();
    });
  }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();
  }

  pulisci(): void {
    this.livelloTerritorialeSelezionato = null;
    this.enteSelezionato = null;
    this.servizioSelezionato = null;
    this.nuovoPagamentoService.compilazioneEvent.emit(null);
  }

  recuperaFiltroLivelloTerritoriale(): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello,
          label: livello.nome
        });
      });
    })).subscribe(() => this.restoreParziale('livelloTerritorialeId'));
  }

  private restoreParziale(field: string) {
    if (this.menuService.isUtenteAnonimo) {
      localStorage.removeItem("parziale");
    } else {
      if (localStorage.getItem("parziale") != null) {
        let item = JSON.parse(localStorage.getItem("parziale"));
        if (field == 'livelloTerritorialeId') {
          let filters: OpzioneSelect[] = this.listaLivelliTerritoriali.filter((livello: OpzioneSelect) => livello.value.id == item[field]);
          if (filters.length > 0) {
            this.livelloTerritorialeSelezionato = filters[0].value;
            this.selezionaLivelloTerritoriale();
          }
        } else if (field == 'enteId') {
          let filters: OpzioneSelect[] = this.listaEnti.filter((ente: OpzioneSelect) => ente.value.id == item[field]);
          if (filters.length > 0) {
            this.enteSelezionato = filters[0].value;
            this.selezionaEnte();
          }
        } else if (field == 'servizioId') {
          let filters: OpzioneSelect[] = this.listaServizi.filter((servizio: OpzioneSelect) => servizio.value.id == item[field]);
          if (filters.length > 0) {
            this.servizioSelezionato = filters[0].value;
            this.selezionaServizio();
          }
        }
      }
    }

    this.overlayService.caricamentoEvent.emit(false);
  }

  selezionaLivelloTerritoriale(): void {
    this.nuovoPagamentoService.compilazioneEvent.emit(null);
    this.enteSelezionato = null;
    this.listaEnti = [];
    this.servizioSelezionato = null;
    this.listaServizi = [];

    this.recuperaFiltroEnti(this.livelloTerritorialeSelezionato.id);
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente,
          label: ente.nome
        });
      });
    })).subscribe(() => this.restoreParziale('enteId'));
  }

  selezionaEnte(): void {
    this.nuovoPagamentoService.compilazioneEvent.emit(null);
    this.servizioSelezionato = null;
    this.listaServizi = [];

    this.recuperaFiltroServizi(this.enteSelezionato.id);
  }

  recuperaFiltroServizi(idEnte): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio,
          label: servizio.nome
        });
      });
    })).subscribe(() => this.restoreParziale('servizioId'));
  }

  selezionaServizio(): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.servizioSelezionato.enteNome = this.enteSelezionato.nome;
    this.nuovoPagamentoService.compilazioneEvent.emit(this.servizioSelezionato);
  }
}
