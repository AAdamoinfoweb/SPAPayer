import {Component, OnInit} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {Breadcrumb} from "../../dto/Breadcrumb";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {
  isDark: boolean = false;
  separator: string = "/";
  items = [];

  listaPagamenti: Pagamento[] = [];

  email: string = '';

  constructor() {
    this.items.push(new Breadcrumb("Home", null, null));
    this.items.push(new Breadcrumb("Pagamenti", null, null));
    this.items.push(new Breadcrumb("Carrello", null, null));
  }

  ngOnInit(): void {
    this.listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    this.listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
  }

  get totale(): number {
    return this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);
  }

}
