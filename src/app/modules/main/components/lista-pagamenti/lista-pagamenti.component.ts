import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {ListaPagamentiService} from "../../../../services/lista-pagamenti.service";

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

  constructor(private listaPagamentiService: ListaPagamentiService) {
  }

  ngOnInit(): void {
    this.listaPagamentiService.getListaPagamenti(this.rid)
      .subscribe(value => {
        this.listaPagamenti = value;
        let total = this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);

        this.onChangeNumeroPagamenti.emit(this.listaPagamenti.length);
        this.onChangeTotalePagamento.emit(total);
      })
  }

}
