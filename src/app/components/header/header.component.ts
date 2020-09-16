import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from '../login-bar/StickyService';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {PrezzoService} from "../nuovo-pagamento/PrezzoService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private maxHeightOffset: number;

  constructor(private stickyService: StickyService, private router: Router, private prezzoService: PrezzoService) { }

  ngOnInit(): void {
    this.stickyService.stickyEvent.subscribe((value: number) => this.maxHeightOffset = value);
    this.router.events.pipe(filter(evento => evento instanceof NavigationEnd)).subscribe(event => {
      this.isPaginaNuovoPagamento = window.location.pathname === this.urlNuovoPagamento;
    })
    this.prezzoService.prezzoEvent.subscribe((prezzo: number) => {this.prezzoCarrello = prezzo});
  }

  isSticky: boolean = false;
  urlNuovoPagamento = "/nuovopagamento";
  isPaginaNuovoPagamento: boolean = window.location.pathname === this.urlNuovoPagamento;
  prezzoCarrello: number;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.maxHeightOffset;
  }

  ritornaAHomePage() {
    window.open("/", "_self");
  }

}
