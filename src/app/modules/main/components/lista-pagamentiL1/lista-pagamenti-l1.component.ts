import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {Pagamento} from '../../model/Pagamento';
import {ListaPagamentiService} from '../../../../services/lista-pagamenti.service';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Carrello} from '../../model/Carrello';
import {XsrfService} from "../../../../services/xsrf.service";
import {Router} from "@angular/router";

const arrowup = 'assets/img/sprite.svg#it-arrow-up-triangle'
const arrowdown = 'assets/img/sprite.svg#it-arrow-down-triangle'
export type SortColumn = keyof Pagamento | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {asc: 'desc', desc: 'asc'};
const compare = (v1: any, v2: any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-lista-pagamenti-l1',
  templateUrl: './lista-pagamenti-l1.component.html',
  styleUrls: ['./lista-pagamenti-l1.component.scss']
})
export class ListaPagamentiL1Component implements OnInit {

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
  onChangeEmailPagamento: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  urlBackEmitterChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private listaPagamentiService: ListaPagamentiService, private route: Router) {
  }


  ngOnInit(): void {
    let observable: Observable<Pagamento[]> = this.listaPagamentiService.verificaRid(this.rid)
      .pipe(flatMap((urlBack) => {
        if (urlBack)
          this.urlBackEmitterChange.emit(urlBack);
        return this.listaPagamentiService.getCarrello()
          .pipe(map((value: Carrello) => {
            this.listaPagamenti = value.dettaglio;

            this.collectionSize = this.listaPagamenti.length

            this.onChangeNumeroPagamenti.emit(this.listaPagamenti.length);
            this.onChangeTotalePagamento.emit(value.totale);
            this.onChangeEmailPagamento.emit(value.email);

            return this.listaPagamenti;
          }));
      }));
    observable.subscribe((ret) => {
      if (ret == null)
        this.route.navigateByUrl("/nonautorizzato");
    });
  }

  onChangePageSize(event): void {
    this.pageSize = event.target.innerText;
  }

  onSort(column) {
    this.sort = {...this.sortDefault}
    this.sort[column] = this.direction === 'asc' ? arrowup : arrowdown;
    this.listaPagamenti = [...this.listaPagamenti].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return this.direction === 'asc' ? res : -res;
    });
    this.direction = rotate[this.direction];
  }
}
