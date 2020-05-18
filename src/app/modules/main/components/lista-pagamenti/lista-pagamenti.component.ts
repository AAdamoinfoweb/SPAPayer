import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {ListaPagamentiService} from "../../../../services/lista-pagamenti.service";

@Component({
  selector: 'app-lista-pagamenti',
  templateUrl: './lista-pagamenti.component.html',
  styleUrls: ['./lista-pagamenti.component.scss']
})
export class ListaPagamentiComponent implements OnInit {

  listaPagamenti: Pagamento[];

  @Output()
  listaPagamentiLength: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  listaPagamentiTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private listaPagamentiService: ListaPagamentiService) {
  }

  ngOnInit(): void {
    this.listaPagamentiService.getListaPagamenti()
      .subscribe(value => {
        this.listaPagamenti = value;
        let total = this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);

        this.listaPagamentiLength.emit(this.listaPagamenti.length);
        this.listaPagamentiTotal.emit(total);
      })
  }

}
