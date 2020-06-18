import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {ListaPagamentiService} from "../../../../services/lista-pagamenti.service";
import {flatMap, map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Carrello} from "../../model/Carrello";

@Component({
  selector: 'app-lista-pagamenti',
  templateUrl: './lista-pagamenti.component.html',
  styleUrls: ['./lista-pagamenti.component.scss']
})
export class ListaPagamentiComponent implements OnInit {

  listaPagamenti: Pagamento[];

  @Input()
  private rid: string;

  @Output()
  onChangeNumeroPagamenti: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onChangeTotalePagamento: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onChangeEmailPagamento: EventEmitter<string> = new EventEmitter<string>();

  constructor(private listaPagamentiService: ListaPagamentiService) {
  }

  ngOnInit(): void {
    let observable: Observable<Pagamento[]> = this.listaPagamentiService.verificaRid(this.rid)
      .pipe(flatMap(() => {
        return this.listaPagamentiService.getCarrello()
          .pipe(map((value: Carrello) => {
            this.listaPagamenti = value.dettagli;

            this.onChangeNumeroPagamenti.emit(this.listaPagamenti.length);
            this.onChangeTotalePagamento.emit(value.totale);
            this.onChangeEmailPagamento.emit(value.email);

            return this.listaPagamenti;
          }));
      }));
    observable.subscribe();
  }

}
