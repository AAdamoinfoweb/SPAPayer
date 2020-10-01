import {Component, HostListener, Input, OnInit} from '@angular/core';
import {StickyService} from '../login-bar/StickyService';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {DatiPagamentoService} from '../../modules/main/components/nuovo-pagamento/dati-nuovo-pagamento/DatiPagamentoService';
import {MenuService} from '../../services/menu.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private maxHeightOffset: number;
  testoAccedi = 'Accedi';
  isAnonimo = false;

  constructor(private stickyService: StickyService, private router: Router,
              private datiPagamentoService: DatiPagamentoService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuService.userAutenticatedEvent
      .subscribe((isAnonimo: boolean) => {
        this.isAnonimo = isAnonimo;
        this.testoAccedi = isAnonimo ? 'Accedi' : 'Esci';
      });

    this.stickyService.stickyEvent.subscribe((value: number) => this.maxHeightOffset = value);
    this.router.events.pipe(filter(evento => evento instanceof NavigationEnd)).subscribe(event => {
      this.isPaginaNuovoPagamento = window.location.pathname === this.urlNuovoPagamento;
    })
    this.datiPagamentoService.prezzoEvent.subscribe((prezzo: number) => {
      this.prezzoCarrello = prezzo
    });
  }

  isSticky: boolean = false;
  urlNuovoPagamento = "/nuovoPagamento";
  isPaginaNuovoPagamento: boolean = window.location.pathname === this.urlNuovoPagamento;
  prezzoCarrello: number;

  @Input()
  isL1: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.maxHeightOffset;
  }

  ritornaAHomePage() {
    window.open("/", "_self");
  }

  getLoginLink() {
    return this.isAnonimo ? environment.bffBaseUrl + '/loginLepida.htm' : environment.bffBaseUrl + '/logout';
  }
}
