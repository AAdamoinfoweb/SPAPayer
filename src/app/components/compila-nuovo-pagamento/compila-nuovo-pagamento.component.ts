import { Component, OnInit } from '@angular/core';
import {CampoForm} from '../../modules/main/model/CampoForm';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {PrezzoService} from '../nuovo-pagamento/PrezzoService';
import {map} from 'rxjs/operators';
import {CompilazioneService} from './CompilazioneService';

@Component({
  selector: 'app-compila-nuovo-pagamento',
  templateUrl: './compila-nuovo-pagamento.component.html',
  styleUrls: ['../nuovo-pagamento/nuovo-pagamento.component.scss', './compila-nuovo-pagamento.component.scss']
})
export class CompilaNuovoPagamentoComponent implements OnInit {
  listaLivelliTerritoriali: Array<any> = []

  listaEnti: Array<any> = []

  listaServizi: Array<any> = []

  isCompilato: boolean = false

  livelloTerritorialeSelezionato: string = null;
  enteSelezionato: string = null;
  servizioSelezionato: string = null;

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private compilazioneService: CompilazioneService) { }

  ngOnInit(): void {
    this.recuperaFiltroLivelloTerritoriale();
}

  recuperaFiltroLivelloTerritoriale(): void {
    this.nuovoPagamentoService.recuperaFiltroLivelloTerritoriale().pipe(map(livelliTerritoriali => {
      livelliTerritoriali.forEach(livello => {
        this.listaLivelliTerritoriali.push({
          value: livello.id,
          label: livello.nome
        })
      })
    })).subscribe();
  }

  recuperaFiltroEnti(idLivelloTerritoriale): void {
    this.isCompilato = false
    this.compilazioneService.compilazioneEvent.emit(null)
    this.enteSelezionato = null
    this.listaEnti = []
    this.nuovoPagamentoService.recuperaFiltroEnti(idLivelloTerritoriale).pipe(map(enti => {
      enti.forEach(ente => {
        this.listaEnti.push({
          value: ente.id,
          label: ente.nome
        })
      })
    })).subscribe();
  }

  recuperaFiltroServizi(idEnte): void {
    this.isCompilato = false
    this.compilazioneService.compilazioneEvent.emit(null)
    this.servizioSelezionato = null
    this.listaServizi = []
    this.nuovoPagamentoService.recuperaFiltroServizi(idEnte).pipe(map(servizi => {
      servizi.forEach(servizio => {
        this.listaServizi.push({
          value: servizio.id,
          label: servizio.nome
        })
      })
    })).subscribe();
  }

  compila(): void {
    this.isCompilato = true;
    this.compilazioneService.compilazioneEvent.emit(this.servizioSelezionato);
  }
}
