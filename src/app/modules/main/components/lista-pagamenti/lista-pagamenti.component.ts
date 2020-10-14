import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pagamento} from '../../model/Pagamento';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Carrello} from '../../model/Carrello';
import {Router} from "@angular/router";
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";
import {DettagliTransazione} from "../../model/bollettino/DettagliTransazione";
import {OverlayService} from '../../../../services/overlay.service';
import {ConfirmationService} from "primeng/api";
import {Bollettino} from "../../model/bollettino/Bollettino";
import {MenuService} from "../../../../services/menu.service";

const arrowup = 'assets/img/sprite.svg#it-arrow-up-triangle'
const arrowdown = 'assets/img/sprite.svg#it-arrow-down-triangle'
export type SortColumn = keyof Pagamento | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {asc: 'desc', desc: 'asc'};
const compare = (v1: any, v2: any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-lista-pagamenti',
  templateUrl: './lista-pagamenti.component.html',
  styleUrls: ['./lista-pagamenti.component.scss']
})
export class ListaPagamentiComponent implements OnInit {

  listaPagamenti: Pagamento[];

  @Input()
  private rid: string;

  collectionSize: number;
  pageSize = 5
  page = 1
  direction = 'asc';
  sortDefault = {anno: '', numDocumento: '', causale: '', ente: '', servizio: '', importo: ''};
  sort = this.sortDefault;

  @Output()
  onChangeNumeroPagamenti: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onChangeTotalePagamento: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  urlBackEmitterChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private nuovoPagamentoService: NuovoPagamentoService, private route: Router,
              private menuService: MenuService,
              private confirmationService: ConfirmationService,
              private overlayService: OverlayService) {
  }

  ngOnInit(): void {
    this.overlayService.caricamentoEvent.emit(true);
    if (this.menuService.isUtenteAnonimo) {
      this.getCarrelloAnonimo();
    } else {
      this.getCarrelloAutenticato();
    }
  }

  private getCarrelloAnonimo() {
    this.listaPagamenti = [];
    for (var key in localStorage) {
      if (key.startsWith("boll-")) {
        let bollettino: Bollettino = JSON.parse(localStorage.getItem(key));
        let pagamento: Pagamento = new Pagamento();
        pagamento.numDocumento = bollettino.numero;
        pagamento.importo = bollettino.importo;
        pagamento.causale = bollettino.causale;
        pagamento.anno = bollettino.anno;
        pagamento.ente = bollettino.ente;
        pagamento.servizio = bollettino.servizio;
        this.listaPagamenti.push(pagamento);
      }
    }
    this.callChangeEvent();
    this.overlayService.caricamentoEvent.emit(false);
  }

  private callChangeEvent() {
    this.onChangeNumeroPagamenti.emit(this.listaPagamenti.length);
    let totale = this.listaPagamenti.reduce((a, b) => a + b.importo, 0);
    this.onChangeTotalePagamento.emit(totale);
  }

  private getCarrelloAutenticato() {
    let observable: Observable<Pagamento[]> = this.nuovoPagamentoService.getCarrello()
      .pipe(map((value: Carrello) => {
        this.listaPagamenti = value.dettaglio;

        this.collectionSize = this.listaPagamenti.length;

        this.onChangeNumeroPagamenti.emit(this.listaPagamenti.length);
        this.onChangeTotalePagamento.emit(value.totale);

        return this.listaPagamenti;
      }));
    observable.subscribe((ret) => {
      this.overlayService.caricamentoEvent.emit(false);
      if (ret == null) {
        this.route.navigateByUrl("/nonautorizzato");
      }
    });
  }

  onChangePageSize(event): void {
    this.pageSize = event.target.innerText;
  }

  onSort(column) {
    this.sort = {...this.sortDefault};
    this.sort[column] = this.direction === 'asc' ? arrowup : arrowdown;
    this.listaPagamenti = [...this.listaPagamenti].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.direction = rotate[this.direction];
  }

  eliminaBollettino(pagamento: Pagamento) {
    this.confirmationService.confirm({
      header: 'Conferma cancellazione',
      message: 'Procedere con la cancellazione del bollettino?',
      acceptButtonStyleClass: 'okButton',
      rejectButtonStyleClass: 'undoButton',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      reject: () => {
      },
      accept: () => {
        if (this.menuService.isUtenteAnonimo) {
          this.eliminaBollettinoAnonimo(pagamento);
        } else {
          this.eliminaBollettinoAutenticato(pagamento);
        }
      }
    });
  }

  private eliminaBollettinoAutenticato(pagamento: Pagamento) {
    const dettaglio: DettagliTransazione = new DettagliTransazione();
    dettaglio.listaDettaglioTransazioneId.push(pagamento.id);
    this.nuovoPagamentoService.eliminaBollettino(dettaglio).subscribe(() => {
      this.ngOnInit();
    });
  }

  salvaPerDopo(pagamento: Pagamento) {
    this.confirmationService.confirm({
      header: 'Salva per dopo',
      message: 'Procedere con il salvataggio per dopo del bollettino?',
      acceptButtonStyleClass: 'okButton',
      rejectButtonStyleClass: 'undoButton',
      acceptLabel: 'Conferma',
      rejectLabel: 'Annulla',
      reject: () => {
      },
      accept: () => {
        const dettaglio: DettagliTransazione = new DettagliTransazione();
        dettaglio.listaDettaglioTransazioneId.push(pagamento.id);
        this.nuovoPagamentoService.salvaPerDopo(dettaglio).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  private eliminaBollettinoAnonimo(pagamento: Pagamento) {
    this.listaPagamenti.splice(this.listaPagamenti.findIndex((p: Pagamento) => p.numDocumento == pagamento.numDocumento), 1);
    localStorage.removeItem("boll-" + pagamento.numDocumento);
    this.callChangeEvent();
  }
}
