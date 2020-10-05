import { Component, OnInit } from '@angular/core';
import {CampoForm} from '../../../model/CampoForm';
import {NuovoPagamentoService} from '../../../../../services/nuovo-pagamento.service';
import {DatiPagamentoService} from '../dati-nuovo-pagamento/DatiPagamentoService';
import {map} from 'rxjs/operators';
import {CompilazioneService} from './CompilazioneService';
import {LivelloTerritoriale} from '../../../model/LivelloTerritoriale';
import {Ente} from '../../../model/Ente';
import {Servizio} from '../../../model/Servizio';
import {OpzioneSelect} from '../../../model/OpzioneSelect';

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
  servizioSelezionato: Servizio = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private compilazioneService: CompilazioneService) { }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();
}

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello,
          label: livello.nome
        });
      });
    })).subscribe();
  }

  selezionaLivelloTerritoriale(): void {
    this.compilazioneService.compilazioneEvent.emit(null)
    this.enteSelezionato = null;
    this.listaEnti = [];

    this.recuperaFiltroEnti(this.livelloTerritorialeSelezionato.id);
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente,
          label: ente.nome
        });
      });
    })).subscribe();
  }

  selezionaEnte(): void {
    this.compilazioneService.compilazioneEvent.emit(null);
    this.servizioSelezionato = null;
    this.listaServizi = [];

    this.recuperaFiltroServizi(this.enteSelezionato.id);
  }

  recuperaFiltroServizi(idEnte): void {
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio,
          label: servizio.nome
        });
      });
    })).subscribe();
  }

  selezionaServizio(): void {
    this.compilazioneService.compilazioneEvent.emit(this.servizioSelezionato);
  }
}
