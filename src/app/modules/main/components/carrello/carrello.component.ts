import {Component, OnInit} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {
  isDark: boolean = false;
  separator: string = "/";
  items = [];
  accordion: any;
  listaPagamenti: Pagamento[] = [];
  total: number;
  email: string;

  constructor() {
  }

  ngOnInit(): void {
    this.listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    this.listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
  }

  get totale(): number {
    return this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);
  }

}
