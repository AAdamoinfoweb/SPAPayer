import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {GestisciElementoComponent} from '../gestisci-elemento.component';
import {ToolEnum} from '../../../../../enums/Tool.enum';
import {Colonna} from '../../../model/tabella/Colonna';
import {ImmaginePdf} from '../../../model/tabella/ImmaginePdf';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AmministrativoService} from '../../../../../services/amministrativo.service';
import {MenuService} from '../../../../../services/menu.service';
import {Tabella} from '../../../model/tabella/Tabella';
import {tipoColonna} from '../../../../../enums/TipoColonna.enum';
import {tipoTabella} from '../../../../../enums/TipoTabella.enum';
import {AccessoService} from '../../../../../services/accesso.service';
import {Accesso} from '../../../model/accesso/Accesso';
import {GruppoEnum} from '../../../../../enums/gruppo.enum';
import * as moment from 'moment';
import {Utils} from '../../../../../utils/Utils';
import {ParametriRicercaAccesso} from '../../../model/accesso/ParametriRicercaAccesso';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-monitora-accessi',
  templateUrl: './monitora-accessi.component.html',
  styleUrls: ['./monitora-accessi.component.scss']
})
export class MonitoraAccessiComponent extends GestisciElementoComponent implements OnInit {

  isMenuCarico = false;

  breadcrumbList = [];
  readonly tooltipTitolo = 'In questa pagina puoi consultare la lista completa degli accessi alle funzionalità amministrative e filtrarli';
  listaElementi = [];
  filtriRicerca: ParametriRicercaAccesso = null;

   righeSelezionate: any[];

  readonly toolbarIcons = [
    {type: ToolEnum.EXPORT_PDF},
    {type: ToolEnum.EXPORT_XLS}
  ];

  tableData: Tabella = {
    rows: [],
    cols: [
      {field: 'nome', header: 'Cognome e Nome', type: tipoColonna.TESTO},
      {field: 'funzioniVisitate', header: 'Gruppo Funzioni Visitate', type: tipoColonna.TESTO},
      {field: 'inizioSessione', header: 'Inizio Sessione', type: tipoColonna.TESTO},
      {field: 'fineSessione', header: 'Fine Sessione', type: tipoColonna.TESTO},
      {field: 'durataSessione', header: 'Durata sessione', type: tipoColonna.TESTO}
    ],
    dataKey: 'id.value',
    tipoTabella: tipoTabella.CHECKBOX_SELECTION
  };

  constructor(router: Router,
              route: ActivatedRoute, http: HttpClient, amministrativoService: AmministrativoService,
              private renderer: Renderer2, private el: ElementRef,
              private menuService: MenuService,
              private accessoService: AccessoService
  ) {
    super(router, route, http, amministrativoService);
  }

  ngOnInit(): void {
    this.waitingEmitter.subscribe(() => {

      if (this.amministrativoService.mappaFunzioni) {
        this.isMenuCarico = Object.keys(this.amministrativoService.mappaFunzioni).length > 0;
      }

      if (this.isMenuCarico) {
        this.init();
      } else {
        this.menuService.menuCaricatoEvent.subscribe(() => {
          this.init();
        });
      }
    });
  }

  init(): void {
    this.breadcrumbList = this.inizializzaBreadcrumbList([
      {label: 'Monitora Accessi', link: null}
    ]);

    // Non effettuo onInit il popolaLista, aspetto che il componente figlio lanci l'evento onChangeFiltri con i filtri data preimpostati
    this.waiting = false;
  }

  creaRigaTabella(accesso: Accesso) {
    let nome;
    if (accesso.cognome && accesso.nome) {
      nome = accesso.cognome + ' ' + accesso.nome;
    } else if (accesso.cognome && !accesso.nome) {
      nome = accesso.cognome;
    } else if (accesso.nome) {
      nome = accesso.nome;
    } else {
      nome = null;
    }

    let funzioniVisitate;
    if (accesso.listaFunzioni) {
      const funzioniAmministrazioneVisitate = accesso.listaFunzioni.filter(funzione => funzione.gruppo === GruppoEnum.AMMINISTRAZIONE);
      const funzioniGestioneVisitate = accesso.listaFunzioni.filter(funzione => funzione.gruppo === GruppoEnum.GESTIONE);
      if (funzioniAmministrazioneVisitate.length > 0 && funzioniGestioneVisitate.length > 0) {
        funzioniVisitate = 'Amministra/Gestisci';
      } else if (funzioniAmministrazioneVisitate.length > 0 && funzioniGestioneVisitate.length === 0) {
        funzioniVisitate = 'Amministra';
      } else if (funzioniGestioneVisitate.length > 0) {
        funzioniVisitate = 'Gestisci';
      } else {
        funzioniVisitate = null;
      }
    } else {
      funzioniVisitate = null;
    }

    return {
      id: {value: accesso.idAccesso},
      nome: {value: nome},
      funzioniVisitate: {value: funzioniVisitate},
      inizioSessione: {value: this.getDataSessioneFormattata(accesso.inizioSessione)},
      fineSessione: {value: this.getDataSessioneFormattata(accesso.fineSessione)},
      durataSessione: {value: Utils.getDurataSessioneFormattata(accesso.durata)}
    }
  }

  getObservableFunzioneRicerca(): Observable<Accesso[]> {
    return this.accessoService.recuperaAccessi(this.filtriRicerca, this.idFunzione);
  }

  callbackPopolaLista(): void {
    this.ordinaDescrescenteAccessi(this.listaElementi);
    this.impostaTabella(this.listaElementi);
  }

  getDataSessioneFormattata(dataSessione: Date): string {
    return dataSessione ? moment(dataSessione).format(Utils.FORMAT_DATE_TIME_CALENDAR) : null;
  }

  eseguiAzioni(azioneTool: ToolEnum): void {
    switch (azioneTool) {
      case ToolEnum.EXPORT_PDF:
        this.esportaTabellaInFilePdf(this.tableData, 'Lista Accessi');
        break;
      case ToolEnum.EXPORT_XLS:
        this.esportaTabellaInFileExcel(this.tableData, 'Lista Accessi');
        break;
    }
  }

  getColonneFilePdf(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFilePdf(righe: any[]) {
    return righe;
  }

  getImmaginiFilePdf(): ImmaginePdf[] {
    return [];
  }

  getNumeroRecord(): string {
    return 'Totale: ' + this.tableData.rows.length + ' accessi';
  }

  getColonneFileExcel(colonne: Colonna[]): Colonna[] {
    return colonne;
  }

  getRigheFileExcel(righe: any[]) {
    return righe.map(riga => {
      delete riga.id;
      riga.nome = riga.nome.value;
      riga.funzioniVisitate = riga.funzioniVisitate.value;
      riga.inizioSessione = riga.inizioSessione.value;
      riga.fineSessione = riga.fineSessione.value;
      riga.durataSessione = riga.durataSessione.value;
      return riga;
    });
  }

  ordinaDescrescenteAccessi(listaAccessi: Accesso[]): void {
    listaAccessi.sort((accesso1, accesso2) => {
      if (accesso1.inizioSessione && accesso2.inizioSessione) {
        if (moment(accesso1.inizioSessione) < moment(accesso2.inizioSessione)) {
          return 1;
        } else if (moment(accesso1.inizioSessione) > moment(accesso2.inizioSessione)) {
          return -1;
        } else {
          return 0;
        }
      } else {
        if (!accesso1.inizioSessione && accesso2.inizioSessione) {
          return -1;
        } else if (accesso1.inizioSessione) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

  selezionaRigaTabella(righeSelezionate: any[]): void {
    this.righeSelezionate = righeSelezionate;
  }

  mostraDettaglioAccesso(rigaTabella) {
    this.mostraDettaglioElemento('/dettaglioAccesso', rigaTabella.id.value);
  }

}
