import { Component, OnInit } from '@angular/core';

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
  listaPagamenti: any = [];
  total: number;
  email: string;

  constructor() { }

  ngOnInit(): void {
  }

}
